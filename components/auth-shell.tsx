import Link from 'next/link'

const VEILWARE_LOGO = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9242e430-1360-46fa-9351-1fa170562f7e-RUNH1ejiJItyIHQwpvAUWXyHg9LXtJ.png'

export function AuthShell({ children }: { children: React.ReactNode }) {
  return <main className="auth-page"><header className="auth-header"><Link href="/" className="auth-brand" aria-label="Veilware home"><img src={VEILWARE_LOGO} alt="Veilware logo" /><span>VEIL<span>WARE</span></span></Link><Link className="auth-home-link" href="/">Home</Link></header>{children}</main>
}
