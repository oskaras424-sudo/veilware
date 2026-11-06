import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductCatalogue } from '@/components/product-store'

export const metadata = {
  title: 'Products | Veilware',
  description: 'Explore the Veilware collection of premium software products.',
}

export default function ProductsPage() {
  return <main className="store-page catalogue-page"><div className="store-shell"><Link className="back-home" href="/"><ArrowLeft size={15} /> Back to home</Link><header className="store-header"><div className="store-eyebrow">VEILWARE COLLECTION</div><h1>Our <em>products</em></h1><p>Explore the VEILWARE collection.</p></header><section className="catalogue-section" aria-labelledby="catalogue-heading"><div className="catalogue-heading-row"><div><span className="store-kicker">CATALOGUE</span><h2 id="catalogue-heading">Product catalogue</h2></div><span className="catalogue-count">Live catalogue</span></div><ProductCatalogue /></section></div></main>
}
