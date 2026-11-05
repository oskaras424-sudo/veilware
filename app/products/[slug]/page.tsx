import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/product-detail'
import { getProduct, products } from '@/lib/products'

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  return { title: product ? `${product.title} | Veilware` : 'Product | Veilware', description: product?.description }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
