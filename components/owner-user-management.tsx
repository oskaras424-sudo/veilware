'use client'

import useSWR from 'swr'
import { Search, ShieldCheck, UserMinus, UserPlus } from 'lucide-react'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(async (response) => {
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error ?? 'Unable to load users.')
  return body as UserManagementData
})

type Account = { userId: string; email: string; createdAt: string; access: 'owner' | 'admin' | null }
type AccessEntry = { userId: string; email: string; role: 'owner' | 'admin'; grantedAt: string; grantedBy: string }
type UserManagementData = { accounts: Account[]; accessList: AccessEntry[] }

export function OwnerUserManagement() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [busyUserId, setBusyUserId] = useState('')
  const [message, setMessage] = useState('')
  const key = `/api/owner/users?q=${encodeURIComponent(submittedQuery)}`
  const { data, error, isLoading, mutate } = useSWR<UserManagementData>(key, fetcher)

  async function changeAccess(userId: string, action: 'grant' | 'revoke') {
    if (action === 'revoke' && !window.confirm('Revoke Owner Panel access for this account? This takes effect immediately.')) return
    setBusyUserId(userId)
    setMessage('')
    const response = await fetch('/api/owner/users', {
      method: action === 'grant' ? 'POST' : 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    const body = await response.json().catch(() => ({}))
    setBusyUserId('')
    if (!response.ok) {
      setMessage(body.error ?? 'Unable to update account access.')
      return
    }
    setMessage(action === 'grant' ? 'Admin access granted.' : 'Admin access revoked.')
    await mutate()
  }

  return (
    <section className="owner-card owner-user-management" id="user-management">
      <div className="owner-card-heading"><div><p className="store-eyebrow">USER MANAGEMENT</p><h2>Owner Panel access</h2><p className="owner-section-copy">Grant or revoke admin access for registered Supabase accounts.</p></div><span><ShieldCheck size={14} /> OWNER ONLY</span></div>
      <form className="owner-user-search" onSubmit={(event) => { event.preventDefault(); setSubmittedQuery(query.trim()) }}>
        <label htmlFor="owner-user-search">Search email or UUID</label>
        <div className="owner-search-row"><Search size={16} aria-hidden="true" /><input id="owner-user-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="name@domain.com or UUID" autoComplete="off" /><button className="table-action owner-search-button" type="submit">Search</button></div>
      </form>
      {message && <p className="owner-message" role="status">{message}</p>}
      {error ? <p className="owner-alert">{error.message}</p> : isLoading ? <p className="owner-alert">Loading registered accounts…</p> : <>
        <div className="owner-subheading"><h3>Matching accounts</h3><span>{data?.accounts.length ?? 0} shown</span></div>
        <div className="owner-table-wrap"><table className="owner-table owner-access-table"><thead><tr><th>Account</th><th>User ID</th><th>Access</th><th>Action</th></tr></thead><tbody>{data?.accounts.map((account) => <tr key={account.userId}><td>{account.email}</td><td className="owner-key">{account.userId}</td><td><span className={`owner-status ${account.access ?? 'customer'}`}>{account.access ?? 'customer'}</span></td><td>{account.access === 'owner' ? <span className="owner-protected-label">Protected owner</span> : account.access === 'admin' ? <button className="table-action danger" disabled={busyUserId === account.userId} onClick={() => changeAccess(account.userId, 'revoke')}><UserMinus size={13} /> {busyUserId === account.userId ? 'Updating…' : 'Revoke'}</button> : <button className="table-action" disabled={busyUserId === account.userId} onClick={() => changeAccess(account.userId, 'grant')}><UserPlus size={13} /> {busyUserId === account.userId ? 'Updating…' : 'Grant admin'}</button>}</td></tr>)}</tbody></table>{!data?.accounts.length && <p className="owner-empty">No registered accounts match that search.</p>}</div>
        <div className="owner-subheading"><h3>Accounts with access</h3><span>{data?.accessList.length ?? 0} total</span></div>
        <div className="owner-table-wrap"><table className="owner-table owner-access-table"><thead><tr><th>Account</th><th>Role</th><th>Granted</th><th>Granted by</th><th /></tr></thead><tbody>{data?.accessList.map((entry) => <tr key={entry.userId}><td>{entry.email}<small className="owner-table-subtext">{entry.userId}</small></td><td><span className={`owner-status ${entry.role}`}>{entry.role}</span></td><td>{new Date(entry.grantedAt).toLocaleString()}</td><td>{entry.grantedBy}</td><td>{entry.role === 'admin' && <button className="table-action danger" disabled={busyUserId === entry.userId} onClick={() => changeAccess(entry.userId, 'revoke')}><UserMinus size={13} /> Revoke</button>}</td></tr>)}</tbody></table></div>
      </>}
    </section>
  )
}
