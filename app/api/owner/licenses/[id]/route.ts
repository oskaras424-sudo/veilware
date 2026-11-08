import { NextResponse } from 'next/server'
import { requireOwnerAccess } from '@/lib/owner'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await requireOwnerAccess()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  const status = body?.status
  if (!['available', 'revoked'].includes(status)) return NextResponse.json({ error: 'Invalid license status.' }, { status: 400 })

  const { data, error } = await supabase
    .from('license_key_inventory')
    .update({ status })
    .eq('id', id)
    .is('order_id', null)
    .select('id, status')
    .maybeSingle()

  if (error) return NextResponse.json({ error: 'Unable to update license status.' }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Issued licenses cannot be changed.' }, { status: 409 })
  return NextResponse.json({ inventory: data })
}
