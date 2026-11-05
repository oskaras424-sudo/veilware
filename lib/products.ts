
export type ProductIconName = 'box' | 'sparkles' | 'bell'

export type ProductVariant = {
  slug: string
  name: string
  price: string | null
  available: boolean
  availability: string
}

export type Product = {
  slug: string
  title: string
  description: string
  longDescription: string
  icon: ProductIconName
  category: string
  imageLabel: string
  availability: string
  variants: ProductVariant[]
  additionalInformation: string[]
}

export const products: Product[] = [
  {
    slug: 'roblox-executor',
    title: 'Roblox Executor',
    description: 'A premium Roblox executor built for precision and a focused experience.',
    longDescription: 'Veilware Roblox Executor is designed around a clean workflow, thoughtful performance, and the privacy-first standards shared across the Veilware collection.',
    icon: 'box',
    category: 'ROBLOX',
    imageLabel: 'ROBLOX EXECUTOR',
    availability: 'Coming soon',
    variants: [
      { slug: 'standard', name: 'Standard edition', price: null, available: false, availability: 'Coming soon' },
      { slug: 'premium', name: 'Premium edition', price: null, available: false, availability: 'Coming soon' },
    ],
    additionalInformation: ['Windows support is planned for launch.', 'Access and pricing will be announced in the Veilware Discord.', 'Product availability may change during development.'],
  },
  {
    slug: 'fortnite-external',
    title: 'Fortnite External',
    description: 'A premium Fortnite external with a restrained, performance-first design.',
    longDescription: 'Fortnite External is being developed as a polished, lightweight product for the Veilware community, with clear communication and active maintenance at its core.',
    icon: 'sparkles',
    category: 'FORTNITE',
    imageLabel: 'FORTNITE EXTERNAL',
    availability: 'Coming soon',
    variants: [
      { slug: 'standard', name: 'Standard edition', price: null, available: false, availability: 'Coming soon' },
      { slug: 'lifetime', name: 'Lifetime edition', price: null, available: false, availability: 'Coming soon' },
    ],
    additionalInformation: ['Windows support is planned for launch.', 'Access and pricing will be announced in the Veilware Discord.', 'Product availability may change during development.'],
  },
  {
    slug: 'temp-spoofer',
    title: 'Temp Spoofer',
    description: 'A temporary spoofer concept focused on a clear, guided user experience.',
    longDescription: 'Temp Spoofer is part of the upcoming Veilware collection. Product details, supported configurations, and access information will be published as development progresses.',
    icon: 'bell',
    category: 'SYSTEM',
    imageLabel: 'TEMP SPOOFER',
    availability: 'Coming soon',
    variants: [
      { slug: 'standard', name: 'Standard access', price: null, available: false, availability: 'Coming soon' },
    ],
    additionalInformation: ['Windows support is planned for launch.', 'Access and pricing will be announced in the Veilware Discord.', 'Product availability may change during development.'],
  },
]

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}
