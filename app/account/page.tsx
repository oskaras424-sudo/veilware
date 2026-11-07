import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/logout-button'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=%2Faccount')

  const [{ data: orders }, { data: licenses }] = await Promise.all([
    supabase.from('orders').select('id, variant_id, quantity, status, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('licenses').select('id, license_key, status, issued_at, expires_at').eq('user_id', user.id).order('issued_at', { ascending: false }),
  ])

  return <main className="account-page"><div className="account-wrap"><div className="account-topbar"><a className="auth-brand" href="/" aria-label="Veilware home"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9242e430-1360-46fa-9351-1fa170562f7e-RUNH1ejiJItyIHQwpvAUWXyHg9LXtJ.png" alt="Veilware logo" /><span>VEIL<span>WARE</span></span></a><a className="auth-home-link" href="/">Home</a></div><header className="account-header"><div><p className="eyebrow">VEILWARE ACCOUNT</p><h1>Your dashboard</h1><p>{user.email}</p></div><LogoutButton /></header><section className="account-section"><div className="account-section-heading"><h2>Licenses</h2><span>{licenses?.length ?? 0}</span></div>{licenses?.length ? <div className="account-list">{licenses.map((license) => <article className="account-card" key={license.id}><div><strong>{license.license_key}</strong><small>{license.status.toUpperCase()}</small></div><p>Issued {new Date(license.issued_at).toLocaleDateString()}</p></article>)}</div> : <div className="account-empty">No licenses have been issued yet.</div>}</section><section className="account-section"><div className="account-section-heading"><h2>Orders</h2><span>{orders?.length ?? 0}</span></div>{orders?.length ? <div className="account-list">{orders.map((order) => <article className="account-card" key={order.id}><div><strong>Order {order.id.slice(0, 8)}</strong><small>{order.status.toUpperCase()}</small></div><p>{order.quantity} item{order.quantity === 1 ? '' : 's'} · {new Date(order.created_at).toLocaleDateString()}</p></article>)}</div> : <div className="account-empty">No orders yet.</div>}</section></div></main>
}
