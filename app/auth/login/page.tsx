import { AuthForm } from '@/components/auth-form'

export default function LoginPage() {
  return <main className="auth-page"><div className="auth-panel"><p className="eyebrow">VEILWARE ACCOUNT</p><h1>Welcome back</h1><p>Sign in to view your orders and licenses.</p><AuthForm mode="login" /></div></main>
}
