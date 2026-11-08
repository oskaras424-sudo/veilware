import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe, stripeModeIsTest } from '@/lib/stripe'
import { withTransaction } from '@/lib/db'

export const runtime = 'nodejs'

async function fulfillOrder(session: Stripe.Checkout.Session, sandboxMode: boolean) {
  const orderId = session.metadata?.order_id
  if (!orderId) throw new Error('order_not_found')

  return withTransaction(async (client) => {
    await client.query('select pg_advisory_xact_lock(hashtextextended($1, 0))', [session.id])
    const { rows: orders } = await client.query<{
      id: string
      user_id: string
      variant_id: string
      status: string
      payment_provider: string
      provider_payment_id: string | null
    }>(
      'select id, user_id, variant_id, status, payment_provider, provider_payment_id from public.orders where id = $1 for update',
      [orderId],
    )
    const order = orders[0]
    if (!order) throw new Error('order_not_found')
    if (
      order.payment_provider !== 'stripe' ||
      order.provider_payment_id !== session.id ||
      session.client_reference_id !== order.id ||
      session.metadata?.variant_id !== order.variant_id ||
      session.metadata?.user_id !== order.user_id
    ) throw new Error('order_payment_mismatch')
    if (order.status === 'paid') return 'already_fulfilled'
    if (order.status !== 'pending') throw new Error('order_not_payable')

    const { rows: inventory } = await client.query<{ id: string; license_key: string; validity_duration: string }>(
      `select id, license_key, validity_duration from public.license_key_inventory
       where variant_id = $1 and status = 'available'
         and (($2::boolean and license_key like 'TEST-%') or (not $2::boolean and license_key not like 'TEST-%'))
       order by created_at asc, id asc limit 1 for update skip locked`,
      [order.variant_id, sandboxMode],
    )
    const key = inventory[0]
    if (!key) throw new Error('no_matching_stock')

    const { rowCount } = await client.query(
      `update public.license_key_inventory
       set status = 'issued', order_id = $1, user_id = $2, issued_at = now()
       where id = $3 and variant_id = $4 and status = 'available'
         and (($5::boolean and license_key like 'TEST-%') or (not $5::boolean and license_key not like 'TEST-%'))
       returning id`,
      [order.id, order.user_id, key.id, order.variant_id, sandboxMode],
    )
    if (rowCount !== 1) throw new Error('inventory_assignment_conflict')

    await client.query(
      `insert into public.licenses (order_id, user_id, license_key, status, validity_duration, expires_at)
       values ($1, $2, $3, 'active', $4, null)`,
      [order.id, order.user_id, key.license_key, key.validity_duration],
    )
    const { rowCount: paidOrderCount } = await client.query(
      `update public.orders
       set status = 'paid', payment_provider = 'stripe', provider_payment_id = $1, paid_at = now()
       where id = $2 and status = 'pending' and payment_provider = 'stripe' and provider_payment_id = $1
       returning id`,
      [session.id, order.id],
    )
    if (paidOrderCount !== 1) throw new Error('order_update_conflict')
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
    await fulfillOrder(session, event.livemode === false)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[stripe.webhook.fulfillment]', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'Fulfillment unavailable; retrying.' }, { status: 500 })
  }
}
