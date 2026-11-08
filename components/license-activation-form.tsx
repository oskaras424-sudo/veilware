'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LicenseActivationForm() {
  const router = useRouter()
  const [licenseKey, setLicenseKey] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const response = await fetch('/api/licenses/activate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ licenseKey }),
    })
    const body = await response.json().catch(() => ({}))
    setBusy(false)
    if (!response.ok) {
      setMessage(body.error ?? 'Unable to activate this license.')
      return
    }
    setLicenseKey('')
    setMessage('License activated successfully.')
    router.refresh()
  }

  return (
    <form className="license-activation-form" onSubmit={submit}>
      <label htmlFor="license-key">Activate a license</label>
      <div>
        <input id="license-key" value={licenseKey} onChange={(event) => setLicenseKey(event.target.value)} placeholder="Paste your license key" autoComplete="off" required />
        <button className="table-action" disabled={busy}>{busy ? 'Activating…' : 'Activate'}</button>
      </div>
      {message && <p role="status">{message}</p>}
    </form>
  )
}
