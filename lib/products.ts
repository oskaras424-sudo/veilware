export type ProductVariant = {
  id: string
  duration: string
  name: string
  priceMinor: number | null
  currency: string
  isActive: boolean
  available: boolean
  stockQuantity: number
  available_stock: number
  availability: string
}

export type Product = {
  id: string
  slug: string
  title: string
  isActive: boolean
  description: string
  longDescription: string
  imageUrl: string | null
  category: string
  imageLabel: string
  availability: string
  cardFooter: string
  additionalInformation: string[]
  variants: ProductVariant[]
}

export type ProductApiResponse = {
  products: Product[]
}

export const durationLabels: Record<string, string> = {
  '1_day': '1 DAY KEY',
  '1_week': '1 WEEK KEY',
  '1_month': '1 MONTH KEY',
  '3_months': '3 MONTH KEY',
  '1_year': '1 YEAR KEY',
  lifetime: 'LIFETIME KEY',
}

export function getDurationLabel(duration: string) {
  return durationLabels[duration] ?? duration.replaceAll('_', ' ').toUpperCase()
}
