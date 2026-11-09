import Link from 'next/link'
import { LayoutDashboard, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export async function OwnerFloatingButton() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: access } = await supabase
    .from('owner_access')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!access || !['owner', 'admin'].includes(access.role)) return null

  return (
    <Link className="owner-floating-button" href="/owner" aria-label="Open Owner Panel">
      <ShieldCheck size={16} aria-hidden="true" />
      <span>Owner Panel</span>
      <LayoutDashboard size={14} aria-hidden="true" />
    </Link>
  )
}
