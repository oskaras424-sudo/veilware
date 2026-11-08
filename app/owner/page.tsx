import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OwnerPanel } from '@/components/owner-panel'

export default async function OwnerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=%2Fowner')

  const { data: access } = await supabase.from('owner_access').select('role').eq('user_id', user.id).maybeSingle()
  if (!access || !['owner', 'admin'].includes(access.role)) notFound()

  return <OwnerPanel role={access.role as 'owner' | 'admin'} />
}
