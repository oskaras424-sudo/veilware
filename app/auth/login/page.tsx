import { AuthForm } from '@/components/auth-form'
import { AuthShell } from '@/components/auth-shell'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const params = await searchParams
  const nextPath = Array.isArray(params.next) ? params.next[0] : params.next
  return <AuthShell><div className="auth-panel"><p className="eyebrow">VEILWARE ACCOUNT</p><h1>Welcome back</h1><p>Sign in to view your orders and licenses.</p><AuthForm mode="login" nextPath={nextPath} /></div></AuthShell>
}
