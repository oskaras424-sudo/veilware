import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe, stripeModeIsTest } from '@/lib/stripe'
import { withTransaction } from '@/lib/db'

export const runtime = 'nodejs'

async function fulfillOrder(orderId: string, sessionId: string, sandboxMode: boolean) {
  return withTransaction(async (client) => {
    await client.query('select pg_advisory_xact_lock(hashtextextended($1, 0))', [sessionId])
    const { rows: orders } = await client.query<{ id: string; user_id: string; variant_id: string; status: string }>(
      'select id, user_id, variant_id, status from public.orders where id = $1 for update',
      [orderId],
    )
    const order = orders[0]
    if (!order) throw new Error('order_not_found')
    if (order.status === 'paid') return 'already_fulfilled'

    const { rows: inventory } = await client.query<{ id: string; license_key: string; expires_at: string | null }>(
      `select id, license_key, expires_at from public.license_key_inventory
       where variant_id = $1 and status = 'available'
         and (expires_at is null or expires_at > now())
         and ($2::boolean or license_key not like 'TEST-%')
       order by case when $2::boolean and license_key like 'TEST-%' then 0 else 1 end, created_at asc, id asc limit 1 for update skip locked`,
      [order.variant_id, sandboxMode],
    )
    const key = inventory[0]
    if (!key) throw new Error('no_genuine_stock')

    await client.query(
      `update public.license_key_inventory
       set status = 'assigned', order_id = $1, user_id = $2, issued_at = now()
       where id = $3`,
      [order.id, order.user_id, key.id],
    )
    await client.query(
      `insert into public.licenses (order_id, user_id, license_key, status, expires_at)
       values ($1, $2, $3, 'active', $4)`,
      [order.id, order.user_id, key.license_key, key.expires_at],
    )
    await client.query(
      `update public.orders
       set status = 'paid', payment_provider = 'stripe', provider_payment_id = $1, paid_at = now()
       where id = $2`,
      [sessionId, order.id],
    )
    return 'fulfilled'
  })
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 400 })

  const payload = await request.text()
  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error('[stripe.webhook.signature]', error instanceof Error ? error.message : 'invalid signature')
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 })
  }

  if (stripeModeIsTest() !== (event.livemode === false)) return NextResponse.json({ error: 'Stripe mode mismatch.' }, { status: 400 })
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) return NextResponse.json({ received: true })
  const session = event.data.object as Stripe.Checkout.Session
  if (session.payment_status !== 'paid' || !session.metadata?.order_id) return NextResponse.json({ received: true })

  try {
    await fulfillOrder(session.metadata.order_id, session.id, event.livemode === false)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[stripe.webhook.fulfillment]', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'Fulfillment unavailable; retrying.' }, { status: 500 })
  }
}
