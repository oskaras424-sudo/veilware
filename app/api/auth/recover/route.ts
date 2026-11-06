import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export async function POST(request: Request) {
  const body = await request.json() as { email?: string; turnstileToken?: string }
  const email = body.email?.trim().toLowerCase() ?? ''
  const captchaToken = body.turnstileToken ?? ''
  if (!email || !captchaToken) {
    return NextResponse.json({ error: 'Enter a valid email and complete CAPTCHA.' }, { status: 400 })
  }

  const supabase = await createClient()
  await supabase.auth.resetPasswordForEmail(email, {
    captchaToken,
    redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${new URL(request.url).origin}/auth/callback?next=/auth/reset-password`,
  })
  return NextResponse.json({ ok: true })
}
