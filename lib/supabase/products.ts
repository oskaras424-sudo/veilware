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

function normalizeVariant(variant: ProductVariantRow): ProductVariant {
  const isActive = variant.is_active === true
  return {
    id: variant.id,
    duration: variant.duration,
    name: getDurationLabel(variant.duration),
    priceMinor: variant.price_minor,
    currency: variant.currency,
    isActive,
    available: isActive && variant.price_minor !== null,
    availability: isActive && variant.price_minor !== null ? 'In stock' : 'PRICE COMING SOON',
  }
}

function normalizeProduct(row: ProductRow): Product {
  const variants = (row.product_variants ?? []).filter((variant) => variant.is_active === true).map(normalizeVariant)
  const hasConfiguredPrice = variants.some((variant) => variant.available)
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
    availability: hasConfiguredPrice ? 'in stock' : 'soon',
    cardFooter: hasConfiguredPrice
      ? formatPrice(variants.find((variant) => variant.available)?.priceMinor ?? 0, variants.find((variant) => variant.available)?.currency ?? 'GBP')
      : 'PRICE COMING SOON',
    variants,
  }
}

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Unable to load products')
  return (data ?? []).map((row) => normalizeProduct(row as ProductRow))
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw new Error('Unable to load product')
  return data ? normalizeProduct(data as ProductRow) : null
}
