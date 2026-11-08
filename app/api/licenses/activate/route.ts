import { NextResponse } from 'next/server'
import { withTransaction } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const durationIntervals: Record<string, string> = {
  '1_day': "interval '1 day'",
  '1_week': "interval '1 week'",
  '1_month': "interval '1 month'",
  '3_months': "interval '3 months'",
  '1_year': "interval '1 year'",
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in to activate a license.' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const licenseKey = typeof body?.licenseKey === 'string' ? body.licenseKey.trim() : ''
  if (!licenseKey || licenseKey.length > 512) return NextResponse.json({ error: 'Enter a valid license key.' }, { status: 400 })

  try {
    const result = await withTransaction(async (client) => {
      const { rows } = await client.query<{
        id: string
        user_id: string
        status: string
        activated_at: string | null
        expires_at: string | null
        validity_duration: string
      }>(
        `select id, user_id, status, activated_at, expires_at, validity_duration
         from public.licenses
         where lower(license_key) = lower($1)
         for update`,
        [licenseKey],
      )
      const license = rows[0]
      if (!license || license.user_id !== user.id) throw new Error('invalid_license')
      if (license.status !== 'active') throw new Error('inactive_license')
      if (license.activated_at) throw new Error('already_activated')

      const interval = durationIntervals[license.validity_duration]
      const expiryExpression = interval ? `now() + ${interval}` : 'null'
      const { rows: updated } = await client.query<{ activated_at: string; expires_at: string | null }>(
        `update public.licenses
         set activated_at = now(), expires_at = ${expiryExpression}
         where id = $1 and user_id = $2 and activated_at is null
         returning activated_at, expires_at`,
        [license.id, user.id],
      )
      if (!updated[0]) throw new Error('activation_conflict')

      await client.query(
        `update public.license_key_inventory
         set activated_at = $1, expires_at = $2
         where lower(license_key) = lower($3) and order_id is not null`,
        [updated[0].activated_at, updated[0].expires_at, licenseKey],
      )
      return updated[0]
    })
    return NextResponse.json({ license: result })
  } catch (error) {
    const code = error instanceof Error ? error.message : 'activation_failed'
    const messages: Record<string, string> = {
      invalid_license: 'This license key is not available for your account.',
      inactive_license: 'This license is not active.',
      already_activated: 'This license has already been activated.',
      activation_conflict: 'The license was activated by another request. Refresh and try again.',
    }
    return NextResponse.json({ error: messages[code] ?? 'Unable to activate this license.' }, { status: code === 'invalid_license' ? 404 : 409 })
  }
}
