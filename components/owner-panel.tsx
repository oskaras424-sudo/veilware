'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { KeyRound, PackageCheck, Plus, RefreshCw, ShieldCheck, ShoppingBag } from 'lucide-react'

type OwnerPanelProps = { role: 'owner' | 'admin' }
type Overview = {
  role: string
  metrics: { orders: number; licenses: number; inventory: number; availableInventory: number }
  orders: Array<{ id: string; variant_id: string; quantity: number; status: string; created_at: string }>
  licenses: Array<{ id: string; license_key: string; status: string; validity_duration: string; activated_at: string | null; issued_at: string | null; expires_at: string | null }>
  products: Array<{ id: string; name: string; is_active: boolean }>
  variants: Array<{ id: string; product_id: string; duration: string; price_minor: number | null; currency: string; is_active: boolean }>
}

type InventoryItem = { id: string; variant_id: string; license_key: string; status: string; created_at: string; issued_at: string | null; expires_at: string | null; order_id: string | null }
class OwnerRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const fetcher = (url: string) => fetch(url).then(async (response) => {
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new OwnerRequestError(body.error ?? 'Request failed', response.status)
  return body
})

export function OwnerPanel({ role }: OwnerPanelProps) {
  const { data, error, isLoading, mutate } = useSWR<Overview>('/api/owner/overview', fetcher)
  const { data: inventoryData, error: inventoryError, isLoading: inventoryLoading, mutate: mutateInventory } = useSWR<{ inventory: InventoryItem[] }>('/api/owner/licenses', fetcher)
  const [variantId, setVariantId] = useState('')
  const [expiryPreset, setExpiryPreset] = useState('never')
  const [licenseKeys, setLicenseKeys] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function addKeys(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const response = await fetch('/api/owner/licenses', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ variantId, expiryPreset, licenseKeys: licenseKeys.split(/\r?\n|,/).map((key) => key.trim()).filter(Boolean) }) })
    const body = await response.json().catch(() => ({}))
    setBusy(false)
    if (!response.ok) { setMessage(body.error ?? 'Unable to add keys.'); return }
    setLicenseKeys('')
    setMessage('License keys added to available inventory.')
    await Promise.all([mutate(), mutateInventory()])
  }

  async function toggleInventory(item: InventoryItem) {
    const nextStatus = item.status === 'available' ? 'revoked' : 'available'
    await fetch(`/api/owner/licenses/${item.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: nextStatus }) })
    await Promise.all([mutate(), mutateInventory()])
  }

  if (error) {
    const accessDenied = error instanceof OwnerRequestError && (error.status === 401 || error.status === 403)
    return <main className="owner-page"><div className="owner-shell owner-error-state"><p className="store-eyebrow">VEILWARE OWNER PANEL</p><h1>{accessDenied ? 'Access denied' : 'Owner data unavailable'}</h1><p className="owner-alert">{accessDenied ? 'Your account does not have Owner Panel access.' : error.message}</p>{!accessDenied && <button className="table-action owner-retry" onClick={() => mutate()}>Retry</button>}</div></main>
  }
  if (isLoading || !data) return <main className="owner-page"><div className="owner-shell"><p className="store-eyebrow">VEILWARE OWNER PANEL</p><h1>Loading secure workspace…</h1></div></main>

  const variantLabel = (id: string) => { const variant = data.variants.find((item) => item.id === id); const product = data.products.find((item) => item.id === variant?.product_id); return variant && product ? `${product.name} · ${variant.duration}` : id }

  return (
    <main className="owner-page">
      <div className="owner-shell">
        <header className="owner-header"><div><p className="store-eyebrow">VEILWARE OWNER PANEL</p><h1>Operations console</h1><p>Manage inventory, monitor orders, and protect customer delivery.</p></div><span className="owner-role"><ShieldCheck size={15} /> {role}</span></header>
        <section className="owner-metrics" aria-label="Store metrics">
          <div><ShoppingBag size={17} /><strong>{data.metrics.orders}</strong><span>Orders</span></div>
          <div><KeyRound size={17} /><strong>{data.metrics.licenses}</strong><span>Issued licenses</span></div>
          <div><PackageCheck size={17} /><strong>{data.metrics.availableInventory}</strong><span>Available keys</span></div>
          <div><RefreshCw size={17} /><strong>{data.metrics.inventory}</strong><span>Total inventory</span></div>
        </section>
        <section className="owner-card"><div className="owner-card-heading"><div><p className="store-eyebrow">LICENSE INVENTORY</p><h2>Add genuine license keys</h2></div><span>Owner-only action</span></div><form onSubmit={addKeys} className="owner-form"><label>Product duration<select value={variantId} onChange={(event) => setVariantId(event.target.value)} required><option value="">Select a variant</option>{data.variants.filter((variant) => variant.is_active).map((variant) => <option key={variant.id} value={variant.id}>{variantLabel(variant.id)}</option>)}</select></label><label>Expiry<select value={expiryPreset} onChange={(event) => setExpiryPreset(event.target.value)}><option value="never">Never expires</option><option value="1_day">1 day</option><option value="1_week">1 week</option><option value="1_month">1 month</option><option value="3_months">3 months</option><option value="1_year">1 year</option></select></label><label>License keys<textarea value={licenseKeys} onChange={(event) => setLicenseKeys(event.target.value)} placeholder="One key per line" rows={4} required /></label><button className="primary-purchase" disabled={busy}>{busy ? 'Adding keys…' : <><Plus size={15} /> Add keys</>}</button></form>{message && <p className="owner-message" role="status">{message}</p>}</section>
        <section className="owner-card"><div className="owner-card-heading"><div><p className="store-eyebrow">INVENTORY STATUS</p><h2>License key inventory</h2></div></div>{inventoryError ? <div className="owner-alert">Unable to load inventory. <button className="table-action" onClick={() => mutateInventory()}>Retry</button></div> : inventoryLoading ? <p className="owner-alert">Loading inventory…</p> : <div className="owner-table-wrap"><table className="owner-table"><thead><tr><th>Key</th><th>Product</th><th>Status</th><th>Expires</th><th>Added</th><th /></tr></thead><tbody>{(inventoryData?.inventory ?? []).map((item) => <tr key={item.id}><td className="owner-key">{item.license_key}</td><td>{variantLabel(item.variant_id)}</td><td><span className={`owner-status ${item.status}`}>{item.status}</span></td><td>{item.expires_at ? new Date(item.expires_at).toLocaleDateString() : 'Never'}</td><td>{new Date(item.created_at).toLocaleDateString()}</td><td>{!item.order_id && <button className="table-action" onClick={() => toggleInventory(item)}>{item.status === 'available' ? 'Revoke' : 'Restore'}</button>}</td></tr>)}</tbody></table>{!inventoryData?.inventory.length && <p className="owner-empty">No license keys in inventory.</p>}</div>}</section>
        <section className="owner-card"><div className="owner-card-heading"><div><p className="store-eyebrow">ISSUED LICENSES</p><h2>Activation status</h2></div></div><div className="owner-table-wrap"><table className="owner-table"><thead><tr><th>Key</th><th>Status</th><th>Activation</th><th>Expiry</th></tr></thead><tbody>{data.licenses.map((license) => <tr key={license.id}><td className="owner-key">{license.license_key}</td><td><span className={`owner-status ${license.status}`}>{license.status}</span></td><td>{license.activated_at ? new Date(license.activated_at).toLocaleDateString() : 'Not activated'}</td><td>{license.expires_at ? new Date(license.expires_at).toLocaleDateString() : 'Lifetime'}</td></tr>)}</tbody></table>{!data.licenses.length && <p className="owner-empty">No issued licenses.</p>}</div></section><section className="owner-card"><div className="owner-card-heading"><div><p className="store-eyebrow">RECENT ORDERS</p><h2>Payment and delivery activity</h2></div></div><div className="owner-table-wrap"><table className="owner-table"><thead><tr><th>Order</th><th>Variant</th><th>Quantity</th><th>Status</th><th>Created</th></tr></thead><tbody>{data.orders.map((order) => <tr key={order.id}><td className="owner-key">{order.id.slice(0, 8)}</td><td>{variantLabel(order.variant_id)}</td><td>{order.quantity}</td><td><span className={`owner-status ${order.status}`}>{order.status}</span></td><td>{new Date(order.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></section>
      </div>
    </main>
  )
}
