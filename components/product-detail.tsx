'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Check, Minus, Plus, ShieldCheck } from 'lucide-react'
import { ProductArtwork } from './product-store'
import type { Product } from '@/lib/products'

function formatVariantPrice(priceMinor: number, currency: string) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(priceMinor / 100)
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<'description' | 'information'>('description')
  const purchaseAvailable = selectedVariant.available

  return <main className="store-page product-detail-page"><div className="store-shell"><Link className="back-to-store" href="/products"><ArrowLeft size={15} /> Back to products</Link><div className="product-detail-grid"><div><ProductArtwork product={product} large /><div className="detail-trust"><ShieldCheck size={16} /> Privacy-first product development</div></div><section className="product-purchase" aria-labelledby="product-title"><div className="store-eyebrow">{product.category} / VEILWARE COLLECTION</div><h1 id="product-title">{product.title}</h1><div className="detail-price">{selectedVariant.available && selectedVariant.priceMinor !== null ? formatVariantPrice(selectedVariant.priceMinor, selectedVariant.currency) : 'PRICE COMING SOON'}</div><div className={`availability ${purchaseAvailable ? 'available' : 'unavailable'}`}><span /> {purchaseAvailable ? 'In stock' : selectedVariant.availability}</div><p className="detail-description">{product.longDescription}</p><div className="variant-section"><div className="detail-label">Edition</div><div className="variant-list">{product.variants.map((variant) => <button key={variant.id} className={selectedVariant.id === variant.id ? 'selected' : ''} onClick={() => setSelectedVariant(variant)}><span>{variant.name}</span><small>{variant.available && variant.priceMinor !== null ? formatVariantPrice(variant.priceMinor, variant.currency) : 'PRICE COMING SOON'}</small></button>)}</div></div><div className="quantity-row"><div className="detail-label">Quantity</div><div className="quantity-control"><button aria-label="Decrease quantity" disabled={!purchaseAvailable || quantity === 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={14} /></button><span>{quantity}</span><button aria-label="Increase quantity" disabled={!purchaseAvailable} onClick={() => setQuantity((value) => value + 1)}><Plus size={14} /></button></div></div><div className="purchase-actions"><button className="primary-purchase" disabled={!purchaseAvailable}>Add to cart</button><button className="secondary-purchase" disabled={!purchaseAvailable}>Buy now</button></div><p className="purchase-note">Products are currently in development. Join Discord for launch announcements.</p></section></div><div className="product-tabs"><div className="tab-list" role="tablist">{(['description', 'information'] as const).map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item === 'description' ? 'Description' : 'Additional information'}</button>)}</div><div className="tab-panel">{tab === 'description' ? <p>{product.longDescription}</p> : <ul>{product.additionalInformation.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>}</div></div></div></main>
}
