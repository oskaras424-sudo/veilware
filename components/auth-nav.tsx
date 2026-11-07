'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthNav({ signedIn }: { signedIn: boolean }) {
  const router = useRouter()
  async function logout() {
    await createClient().auth.signOut()
    router.refresh()
  }

  return signedIn ? <><Link className="account-nav-link" href="/account">My Account</Link><button className="auth-nav-button" type="button" onClick={logout}>Logout</button></> : <><Link className="account-nav-link" href="/auth/login">Login</Link><Link className="account-nav-link" href="/auth/signup">Register</Link></>
}
