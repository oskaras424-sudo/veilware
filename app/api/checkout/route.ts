import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProducts } from '@/lib/supabase/products'
import { getStripe } from '@/lib/stripe'
import { pool } from '@/lib/db'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in before purchasing.' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const variantId = typeof body?.variantId === 'string' ? body.variantId : ''
  if (!variantId) return NextResponse.json({ error: 'Choose a product duration.' }, { status: 400 })

  const products = await getProducts()
  const product = products.find((item) => item.variants.some((variant) => variant.id === variantId))
  const variant = product?.variants.find((item) => item.id === variantId)
  if (!product || !variant || variant.priceMinor === null || !product.isActive || !variant.isActive || variant.stockQuantity < 1) {
    return NextResponse.json({ error: 'This product duration is not available.' }, { status: 409 })
  }

  const order = await pool.query<{ id: string }>(
    `insert into public.orders (user_id, variant_id, quantity, status, payment_provider)
     values ($1, $2, 1, 'pending', 'stripe') returning id`,
    [user.id, variant.id],
  )

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price_data: { currency: variant.currency.toLowerCase(), product_data: { name: `${product.title} — ${variant.name}` }, unit_amount: variant.priceMinor }, quantity: 1 }],
      success_url: `${new URL('/account?checkout=success', request.url).toString()}`,
      cancel_url: `${new URL(`/products/${product.slug}`, request.url).toString()}`,
      client_reference_id: order.rows[0].id,
      metadata: { order_id: order.rows[0].id, variant_id: variant.id, user_id: user.id },
    }, { idempotencyKey: `checkout_${order.rows[0].id}` })
    await pool.query('update public.orders set provider_payment_id = $1 where id = $2', [session.id, order.rows[0].id])
    return NextResponse.json({ url: session.url })
  } catch (error) {
    await pool.query('update public.orders set status = \'failed\' where id = $1', [order.rows[0].id])
    console.error('[checkout.create]', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 502 })
  }
}
