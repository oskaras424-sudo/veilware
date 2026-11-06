import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export async function POST(request: Request) {
  const body = await request.json() as { email?: string; password?: string; turnstileToken?: string }
  const email = body.email?.trim().toLowerCase() ?? ''
  const captchaToken = body.turnstileToken ?? ''
  if (!email || !body.password || !captchaToken) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password: body.password, options: { captchaToken } })
  if (error) {
    const message = error.message.toLowerCase().includes('confirm') ? 'Confirm your email before signing in.' : 'Invalid email or password.'
    return NextResponse.json({ error: message }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
