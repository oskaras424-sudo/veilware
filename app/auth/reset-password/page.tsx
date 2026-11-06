'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    const { error } = await createClient().auth.updateUser({ password })
    if (error) setMessage('Unable to update your password. Please request a new link.')
    else router.push('/account')
    setPending(false)
  }

  return <main className="auth-page"><div className="auth-panel"><p className="eyebrow">ACCOUNT RECOVERY</p><h1>Choose a new password</h1><p>Use at least 8 characters for your new password.</p><form className="auth-form" onSubmit={submit}><label htmlFor="password">New password</label><input id="password" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /><button className="auth-submit" type="submit" disabled={pending}>{pending ? 'Updating…' : 'Update password'}</button>{message && <p className="auth-error" role="alert">{message}</p>}</form></div></main>
}
