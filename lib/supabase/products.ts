import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { getDurationLabel, type Product, type ProductVariant } from '@/lib/products'

type ProductVariantRow = {
  id: string
  duration: string
  price_minor: number | null
  currency: string
  is_active: boolean | null
}

type PublicStockRow = {
  variant_id?: string
  product_variant_id?: string
  id?: string
  available_quantity?: number | null
  available_count?: number | null
  stock_count?: number | null
  available_stock?: number | null
  quantity?: number | null
}

type ProductRow = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean | null
  product_variants: ProductVariantRow[] | null
}

const productSelect = 'id, name, slug, description, image_url, is_active, product_variants(id, duration, price_minor, currency, is_active)'

function formatPrice(priceMinor: number, currency: string) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(priceMinor / 100)
}

function normalizeVariant(variant: ProductVariantRow, stockByVariantId: Map<string, number>): ProductVariant {
  const isActive = variant.is_active === true
  const stockQuantity = stockByVariantId.get(variant.id) ?? 0
  const hasPrice = variant.price_minor !== null
  return {
    id: variant.id,
    duration: variant.duration,
    name: getDurationLabel(variant.duration),
    priceMinor: variant.price_minor,
    currency: variant.currency,
    isActive,
    available: isActive && hasPrice && stockQuantity > 0,
    stockQuantity,
    available_stock: stockQuantity,
    availability: stockQuantity > 0 ? 'IN STOCK' : 'OUT OF STOCK',
  }
}

function normalizeProduct(row: ProductRow, stockByVariantId: Map<string, number>): Product {
  const variants = (row.product_variants ?? []).filter((variant) => variant.is_active === true).map((variant) => normalizeVariant(variant, stockByVariantId))
  const hasConfiguredPrice = variants.some((variant) => variant.priceMinor !== null)
  const hasStock = variants.some((variant) => variant.stockQuantity > 0)
  const category = row.slug.split('-')[0]?.toUpperCase() || 'VEILWARE'
  return {
    id: row.id,
    slug: row.slug,
    title: row.name,
    description: row.description ?? '',
    longDescription: row.description ?? '',
    imageUrl: row.image_url,
    category,
    imageLabel: row.name.toUpperCase(),
    availability: hasStock ? 'IN STOCK' : 'OUT OF STOCK',
    cardFooter: hasConfiguredPrice
      ? `${formatPrice(variants.find((variant) => variant.priceMinor !== null)?.priceMinor ?? 0, variants.find((variant) => variant.priceMinor !== null)?.currency ?? 'GBP')} · ${hasStock ? `${variants.find((variant) => variant.available)?.stockQuantity ?? 0} keys available` : 'OUT OF STOCK'}`
      : `PRICE COMING SOON · ${hasStock ? `${variants.reduce((total, variant) => total + variant.stockQuantity, 0)} keys available` : 'OUT OF STOCK'}`, 
    variants,
  }
}

async function getStockByVariantId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase.rpc('get_public_variant_stock')
  if (error) throw new Error('Unable to load product stock')

  return new Map((data as PublicStockRow[] ?? []).flatMap((row) => {
    const variantId = row.variant_id ?? row.product_variant_id ?? row.id
    const quantity = row.available_stock ?? row.available_quantity ?? row.available_count ?? row.stock_count ?? row.quantity ?? 0
    return variantId ? [[variantId, Math.max(0, Number(quantity))] as const] : []
  }))
}

export async function getProducts() {
  const supabase = await createClient()
  const stockByVariantId = await getStockByVariantId(supabase)
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Unable to load products')
  return (data ?? []).map((row) => normalizeProduct(row as ProductRow, stockByVariantId))
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const stockByVariantId = await getStockByVariantId(supabase)
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw new Error('Unable to load product')
  return data ? normalizeProduct(data as ProductRow, stockByVariantId) : null
}
