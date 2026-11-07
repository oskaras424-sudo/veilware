import { AuthForm } from '@/components/auth-form'
import { AuthShell } from '@/components/auth-shell'

export default function SignupPage() {
  return <AuthShell><div className="auth-panel"><p className="eyebrow">VEILWARE ACCOUNT</p><h1>Create your account</h1><p>Keep your Veilware licenses and orders in one place.</p><AuthForm mode="signup" /></div></AuthShell>
}
