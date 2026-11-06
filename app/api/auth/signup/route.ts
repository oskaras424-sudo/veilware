import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyTurnstile } from '@/lib/auth/turnstile'

export async function POST(request: Request) {
  const body = await request.json() as { email?: string; password?: string; turnstileToken?: string }
  const email = body.email?.trim().toLowerCase() ?? ''
  const password = body.password ?? ''
  if (!email || password.length < 8 || !(await verifyTurnstile(body.turnstileToken ?? '', request.headers.get('x-forwarded-for')))) {
    return NextResponse.json({ error: 'Check your details and CAPTCHA, then try again.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${new URL(request.url).origin}/auth/callback` },
  })
  if (error) return NextResponse.json({ error: error.message.includes('already') ? 'Unable to create this account.' : 'Unable to create your account right now.' }, { status: 400 })
  return NextResponse.json({ needsEmailConfirmation: !data.session })
}
