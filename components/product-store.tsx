'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { useMemo, useState } from 'react'
import { Bell, Box, Check, ChevronDown, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import type { Product, ProductApiResponse } from '@/lib/products'

const fetcher = async (url: string): Promise<ProductApiResponse> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Unable to load products')
  return response.json()
}

function ProductIcon({ slug, size }: { slug: string; size: number }) {
  if (slug.includes('roblox')) return <Box size={size} strokeWidth={1.4} />
  if (slug.includes('fortnite')) return <Sparkles size={size} strokeWidth={1.4} />
  return <Bell size={size} strokeWidth={1.4} />
}

function ProductArtwork({ product, large = false }: { product: Product; large?: boolean }) {
  return <div className={`product-artwork ${large ? 'large' : ''}`}><div className="artwork-grid" /><div className="artwork-mark"><ProductIcon slug={product.slug} size={large ? 42 : 28} /></div><span>{product.imageLabel}</span><i>{product.category}</i></div>
}

export function ProductCard({ product }: { product: Product }) {
  return <Link className="store-product-card" href={`/products/${product.slug}`}><ProductArtwork product={product} /><div className="store-product-copy"><div className="store-card-meta"><span>{product.category}</span><strong>{product.availability}</strong></div><h2>{product.title}</h2><p>{product.description}</p><div className="store-card-footer"><span>{product.cardFooter ?? 'Pricing announced soon'}</span><span className="card-arrow">↗</span></div></div></Link>
}

export function ProductCatalogue() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All products')
  const [inStockOnly, setInStockOnly] = useState(false)
  const { data, error, isLoading } = useSWR('/api/products', fetcher)
  const products = data?.products ?? []
  const categories = ['All products', ...new Set(products.map((product) => product.category))]
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesQuery = `${product.title} ${product.description}`.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All products' || product.category === category
    const matchesStock = !inStockOnly || product.variants.some((variant) => variant.available)
    return matchesQuery && matchesCategory && matchesStock
  }), [category, inStockOnly, products, query])

  if (isLoading) return <div className="catalogue-state" role="status"><div className="catalogue-state-line" /><p>Loading products</p></div>
  if (error) return <div className="catalogue-state catalogue-state-error" role="alert"><h2>Products are unavailable</h2><p>We couldn&apos;t load the catalogue right now. Please try again shortly.</p></div>

  return <>
    <div className="catalogue-toolbar"><label className="store-search"><Search size={17} /><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" /></label><div className="catalogue-filters"><label className="store-select"><SlidersHorizontal size={16} /><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label><label className="stock-filter"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} /><span><Check size={13} /> In stock only</span></label>{(query || category !== 'All products' || inStockOnly) && <button className="clear-filters" onClick={() => { setQuery(''); setCategory('All products'); setInStockOnly(false) }}>Clear filters</button>}</div></div>
    {filteredProducts.length > 0 ? <div className="store-product-grid">{filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="catalogue-empty"><Search size={24} /><h2>No products found</h2><p>Try a different search or clear your filters.</p><button className="clear-filters" onClick={() => { setQuery(''); setCategory('All products'); setInStockOnly(false) }}>Reset catalogue</button></div>}
  </>
}

export { ProductArtwork }
