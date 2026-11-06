import { AuthForm } from '@/components/auth-form'

export default function SignupPage() {
  return <main className="auth-page"><div className="auth-panel"><p className="eyebrow">VEILWARE ACCOUNT</p><h1>Create your account</h1><p>Keep your Veilware licenses and orders in one place.</p><AuthForm mode="signup" /></div></main>
}
