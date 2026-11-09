import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OwnerPanel } from '@/components/owner-panel'

export default async function OwnerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=%2Fowner')

  const { data: access } = await supabase.from('owner_access').select('role').eq('user_id', user.id).maybeSingle()
  if (!access || !['owner', 'admin'].includes(access.role)) {
    return <main className="owner-page"><div className="owner-shell owner-error-state"><p className="store-eyebrow">VEILWARE OWNER PANEL</p><h1>Access denied</h1><p className="owner-alert">Your account does not have Owner Panel access.</p><a className="table-action owner-retry" href="/">Return home</a></div></main>
  }

  return <OwnerPanel role={access.role as 'owner' | 'admin'} />
}
