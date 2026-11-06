import Link from 'next/link'

export default function CheckEmailPage() {
  return <main className="auth-page"><div className="auth-panel"><p className="eyebrow">CHECK YOUR INBOX</p><h1>One more step</h1><p>Follow the link in your email to continue. If you do not see it, check your spam folder.</p><Link className="auth-submit auth-submit-link" href="/auth/login">Back to sign in</Link></div></main>
}
