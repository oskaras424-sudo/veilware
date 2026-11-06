'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()
  return <button className="account-logout" onClick={async () => { await createClient().auth.signOut(); router.push('/'); router.refresh() }}>Sign out</button>
}
