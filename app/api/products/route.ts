import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/supabase/products'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error('[supabase] products read failed', error)
    return NextResponse.json({ error: 'Unable to load products' }, { status: 500 })
  }
}
