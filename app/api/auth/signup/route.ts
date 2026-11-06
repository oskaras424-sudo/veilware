import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export async function POST(request: Request) {
  const body = await request.json() as { email?: string; password?: string; turnstileToken?: string }
  const email = body.email?.trim().toLowerCase() ?? ''
  const password = body.password ?? ''
  const captchaToken = body.turnstileToken ?? ''
  if (!email || password.length < 8 || !captchaToken) {
    return NextResponse.json({ error: 'Check your details and CAPTCHA, then try again.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { captchaToken, emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${new URL(request.url).origin}/auth/callback` },
  })
  if (error) {
    console.error('[auth.signup]', { operation: 'signUp', message: error.message, code: error.code ?? null, status: error.status ?? 400 })
    const normalized = `${error.code ?? ''} ${error.message}`.toLowerCase()
    let message = 'Unable to create your account right now.'
    if (normalized.includes('captcha')) message = 'CAPTCHA verification failed. Please complete the CAPTCHA again.'
    else if (normalized.includes('already') || normalized.includes('registered') || normalized.includes('exists')) message = 'Unable to create this account.'
    else if (normalized.includes('password') || normalized.includes('weak')) message = 'Choose a stronger password and try again.'
    else if (normalized.includes('email') && normalized.includes('invalid')) message = 'Enter a valid email address.'
    else if (error.status === 429 || normalized.includes('rate')) message = 'Too many attempts. Please wait and try again.'
    return NextResponse.json({ error: message }, { status: error.status && error.status >= 400 ? error.status : 400 })
  }
  return NextResponse.json({ needsEmailConfirmation: !data.session })
}
