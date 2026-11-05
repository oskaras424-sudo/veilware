import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, image_url, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[supabase] products read failed', error)
    return NextResponse.json({ error: 'Unable to load products' }, { status: 500 })
  }

  return NextResponse.json({ products: data ?? [] })
}
