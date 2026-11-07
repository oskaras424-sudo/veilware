import VeilwareSite from '@/components/veilware-site'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const { data: { user } } = await (await createClient()).auth.getUser()
  return <VeilwareSite signedIn={Boolean(user)} />
}
