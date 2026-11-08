import { NextResponse } from 'next/server'
import { requireOwnerAccess } from '@/lib/owner'

export async function GET() {
  const { supabase, user, role } = await requireOwnerAccess()
  if (!user || !role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [orders, licenses, inventory, availableInventory, products, variants] = await Promise.all([
    supabase.from('orders').select('id, variant_id, quantity, status, created_at, user_id').order('created_at', { ascending: false }).limit(8),
    supabase.from('licenses').select('id, order_id, user_id, license_key, status, issued_at, expires_at').order('issued_at', { ascending: false }).limit(8),
    supabase.from('license_key_inventory').select('id', { count: 'exact', head: true }),
    supabase.from('license_key_inventory').select('id', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('products').select('id, name, slug, is_active').order('name'),
    supabase.from('product_variants').select('id, product_id, name, duration, price_minor, currency, is_active').order('duration'),
  ])

  const firstError = [orders, licenses, inventory, availableInventory, products, variants].find((result) => result.error)?.error
  if (firstError) return NextResponse.json({ error: 'Unable to load owner data.' }, { status: 500 })

  return NextResponse.json({
    role,
    metrics: {
      orders: orders.data?.length ?? 0,
      licenses: licenses.data?.length ?? 0,
      inventory: inventory.count ?? 0,
      availableInventory: availableInventory.count ?? 0,
    },
    orders: orders.data ?? [],
    licenses: licenses.data ?? [],
    products: products.data ?? [],
    variants: variants.data ?? [],
  })
}
