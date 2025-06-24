// src/utils/tailorHelpers.ts
export const SPECIALTIES = [
  'Traditional Filipino',
  'Traditional Indian',
  'Traditional Japanese',
  'Traditional Arabic',
  'Suits',
  'Formal Wear',
  'Business Attire',
  'Evening Gowns',
  'Wedding Dresses',
  'Cocktail Dresses',
  'Casual Wear',
  'Modern Fusion',
  'Vintage',
  'Haute Couture',
  'Alterations'
] as const

export const CULTURAL_STYLES = [
  'Western',
  'Traditional Filipino',
  'Traditional Indian',
  'Traditional Japanese',
  'Traditional Chinese',
  'Traditional Arabic',
  'Traditional African',
  'Indo-Western',
  'Modern Fusion'
] as const

export const GARMENT_CATEGORIES = [
  'Shirts',
  'Pants',
  'Dresses',
  'Suits',
  'Traditional Wear',
  'Formal Wear',
  'Casual Wear',
  'Wedding Attire',
  'Evening Wear',
  'Business Attire'
] as const

export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString()}`
}

export const formatRating = (rating: number): string => {
  return rating.toFixed(1)
}

export const formatExperience = (years: number): string => {
  return `${years}+ years`
}

export const getSpecialtyColor = (specialty: string): string => {
  const colorMap: Record<string, string> = {
    'Traditional Filipino': 'bg-red-100 text-red-800',
    'Traditional Indian': 'bg-orange-100 text-orange-800',
    'Traditional Japanese': 'bg-pink-100 text-pink-800',
    'Suits': 'bg-blue-100 text-blue-800',
    'Formal Wear': 'bg-indigo-100 text-indigo-800',
    'Evening Gowns': 'bg-purple-100 text-purple-800',
    'Modern Fusion': 'bg-green-100 text-green-800',
    'Haute Couture': 'bg-yellow-100 text-yellow-800'
  }
  
  return colorMap[specialty] || 'bg-gray-100 text-gray-800'
}