export async function verifyTurnstile(token: string, remoteIp?: string | null) {
  if (!token || !process.env.TURNSTILE_SECRET_KEY) return false

  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  })
  if (!response.ok) return false
  const result = await response.json() as { success?: boolean }
  return result.success === true
}
