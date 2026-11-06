import { AuthForm } from '@/components/auth-form'

export default function ForgotPasswordPage() {
  return <main className="auth-page"><div className="auth-panel"><p className="eyebrow">ACCOUNT RECOVERY</p><h1>Reset your password</h1><p>We&apos;ll send a secure reset link if an account matches.</p><AuthForm mode="recover" /></div></main>
}
