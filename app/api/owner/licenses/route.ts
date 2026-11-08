import { NextResponse } from 'next/server'
import { requireOwnerAccess } from '@/lib/owner'

export async function GET() {
  const { supabase, user } = await requireOwnerAccess()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabase
    .from('license_key_inventory')
    .select('id, variant_id, license_key, status, created_at, issued_at, order_id, user_id')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Unable to load inventory.' }, { status: 500 })
  return NextResponse.json({ inventory: data ?? [] })
}

export async function POST(request: Request) {
  const { supabase, user } = await requireOwnerAccess()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json().catch(() => null)
  const variantId = typeof body?.variantId === 'string' ? body.variantId : ''
  const licenseKeys = Array.isArray(body?.licenseKeys)
    ? (body.licenseKeys as unknown[]).filter((key: unknown): key is string => typeof key === 'string').map((key: string) => key.trim()).filter(Boolean)
    : []

  if (!variantId || licenseKeys.length === 0 || licenseKeys.length > 100) {
    return NextResponse.json({ error: 'Provide a variant and between 1 and 100 license keys.' }, { status: 400 })
  }
  if (licenseKeys.some((key) => key.length > 512)) {
    return NextResponse.json({ error: 'License keys must be 512 characters or fewer.' }, { status: 400 })
  }

  const uniqueKeys = [...new Set(licenseKeys)]
  const rows = uniqueKeys.map((license_key) => ({ variant_id: variantId, license_key, status: 'available' }))
  const { data, error } = await supabase.from('license_key_inventory').insert(rows).select('id, variant_id, license_key, status, created_at')

  if (error) return NextResponse.json({ error: 'Unable to add license keys. Check for duplicates and try again.' }, { status: 409 })
  return NextResponse.json({ inventory: data ?? [] }, { status: 201 })
}
