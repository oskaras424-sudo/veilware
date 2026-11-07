import { AuthForm } from '@/components/auth-form'
import { AuthShell } from '@/components/auth-shell'

export default function ForgotPasswordPage() {
  return <AuthShell><div className="auth-panel"><p className="eyebrow">ACCOUNT RECOVERY</p><h1>Reset your password</h1><p>We&apos;ll send a secure reset link if an account matches.</p><AuthForm mode="recover" /></div></AuthShell>
}
