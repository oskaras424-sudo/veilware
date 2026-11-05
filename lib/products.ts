
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
  cardFooter?: string
  variants: ProductVariant[]
  additionalInformation: string[]
}

export const products: Product[] = [
  {
    slug: 'roblox-executor',
    title: 'Roblox Executor',
    description: 'A premium Roblox executor for scripting in your favorite games.',
    longDescription: 'Veilware Roblox Executor is designed for all users to enjoy scripting. Get a key for free by completing the steps or buy one to skip.',
    icon: 'box',
    category: 'ROBLOX',
    imageLabel: 'ROBLOX EXECUTOR',
    availability: 'soon',
    cardFooter: 'Pricing announced soon',
    variants: [
      { slug: 'free-key', name: 'Free key', price: null, available: false, availability: 'soon' },
      { slug: '1-day', name: '1 DAY KEY', price: null, available: false, availability: 'soon' },
      { slug: '1-week', name: '1 WEEK KEY', price: null, available: false, availability: 'soon' },
      { slug: '1-month', name: '1 MONTH KEY', price: null, available: false, availability: 'soon' },
      { slug: '3-month', name: '3 MONTH KEY', price: null, available: false, availability: 'soon' },
      { slug: '1-year', name: '1 YEAR KEY', price: null, available: false, availability: 'soon' },
      { slug: 'lifetime', name: 'LIFETIME KEY', price: null, available: false, availability: 'soon' },
    ],
    additionalInformation: ['Windows, Linux and mac support is planned for launch.', 'Access and pricing will be announced in the Veilware Discord.', 'Product availability may change during development.'],
  },
  {
    slug: 'fortnite-external',
    title: 'Fortnite External',
    description: 'A premium Fortnite external most undetected on the market',
    longDescription: 'Fortnite External is being developed as a polished, lightweight product for the Veilware community, with clear communication and active maintenance at its core.',
    icon: 'sparkles',
    category: 'FORTNITE',
    imageLabel: 'FORTNITE EXTERNAL',
    availability: ' soon',
    cardFooter: 'Free.   For now',
    variants: [
      { slug: '1-day', name: '1 DAY KEY', price: null, available: false, availability: ' soon' },
      { slug: '1-week', name: '1 WEEK KEY', price: null, available: false, availability: ' soon' },
      { slug: '1-month', name: '1 MONTH KEY', price: null, available: false, availability: ' soon' },
      { slug: '3-month', name: '3 MONTH KEY', price: null, available: false, availability: ' soon' },
      { slug: '1-year', name: '1 YEAR KEY', price: null, available: false, availability: ' soon' },
      { slug: 'lifetime', name: 'LIFETIME KEY', price: null, available: false, availability: ' soon' },
    ],
    additionalInformation: ['Windows, Linux and mac support is planned for launch.', 'Access and pricing will be announced in the Veilware Discord.', 'Product availability may change during development.'],
  },
  {
    slug: 'temp-spoofer',
    title: 'Temp Spoofer',
    description: 'A temporary spoofer to get temporarily unhardware banned',
    longDescription: 'Temp Spoofer is part of the upcoming Veilware collection. Product details, supported configurations, and access information will be published as development progresses.',
    icon: 'bell',
    category: 'FORTNITE',
    imageLabel: 'TEMP SPOOFER',
    availability: 'soon',
    variants: [
      { slug: '1-day', name: '1 DAY KEY', price: null, available: false, availability: 'soon' },
      { slug: '1-week', name: '1 WEEK KEY', price: null, available: false, availability: 'soon' },
      { slug: '1-month', name: '1 MONTH KEY', price: null, available: false, availability: 'soon' },
      { slug: '3-month', name: '3 MONTH KEY', price: null, available: false, availability: 'soon' },
      { slug: '1-year', name: '1 YEAR KEY', price: null, available: false, availability: 'soon' },
      { slug: 'lifetime', name: 'LIFETIME KEY', price: null, available: false, availability: 'soon' },
    ],
    additionalInformation: ['Windows, Linux and mac support is planned for launch.', 'Access and pricing will be announced in the Veilware Discord.', 'Product availability may change during development.'],
  },
]

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}
