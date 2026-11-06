'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

type AuthMode = 'login' | 'signup' | 'recover'

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const isRecover = mode === 'recover'
  const endpoint = mode === 'signup' ? '/api/auth/signup' : mode === 'login' ? '/api/auth/login' : '/api/auth/recover'

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setMessage('')
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password, turnstileToken: token }) })
      const result = await response.json() as { error?: string; needsEmailConfirmation?: boolean }
      if (!response.ok) throw new Error(result.error ?? 'Something went wrong.')
      if (isRecover || result.needsEmailConfirmation) router.push('/auth/check-email')
      else router.push('/account')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.')
      setPending(false)
    }
  }

  return <form className="auth-form" onSubmit={submit}>
    <label htmlFor="email">Email address</label>
    <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
    {!isRecover && <><label htmlFor="password">Password</label><input id="password" type="password" minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required value={password} onChange={(event) => setPassword(event.target.value)} /></>}
    <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setToken} onExpire={() => setToken('')} options={{ theme: 'dark' }} />
    {message && <p className="auth-error" role="alert">{message}</p>}
    <button className="auth-submit" type="submit" disabled={pending || !token}>{pending ? 'Working…' : isRecover ? 'Send reset link' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
    <div className="auth-links">{mode !== 'login' && <Link href="/auth/login">Sign in</Link>}{mode !== 'signup' && <Link href="/auth/signup">Create account</Link>}{mode !== 'recover' && <Link href="/auth/forgot-password">Forgot password?</Link>}</div>
  </form>
}
