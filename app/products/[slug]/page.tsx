import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/product-detail'
import { getProductBySlug } from '@/lib/supabase/products'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  return { title: product ? `${product.title} | Veilware` : 'Product | Veilware', description: product?.description }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
