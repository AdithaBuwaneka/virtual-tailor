// src/store/tailorStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tailor } from '@/types'

interface TailorFilters {
  location?: string
  specialties?: string[]
  priceRange?: [number, number]
  rating?: number
  experience?: number
  cultural?: string[]
  availability?: boolean
}

interface TailorState {
  tailors: Tailor[]
  filteredTailors: Tailor[]
  filters: TailorFilters
  isLoading: boolean
  error: string | null
  selectedTailor: Tailor | null
  searchQuery: string
  sortBy: 'rating' | 'price' | 'experience' | 'distance'
  
  // Actions
  loadTailors: () => Promise<void>
  setFilters: (filters: Partial<TailorFilters>) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: 'rating' | 'price' | 'experience' | 'distance') => void
  selectTailor: (tailorId: string) => Promise<void>
  clearFilters: () => void
  applyFilters: () => void
}

// Mock Tailor Service
class TailorService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  async getTailors(): Promise<Tailor[]> {
    await this.delay(1000)
    
    return [
      {
        id: '1',
        email: 'maria.santos@example.com',
        firstName: 'Maria',
        lastName: 'Santos',
        role: 'tailor',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        isVerified: true,
        businessName: 'Santos Traditional Wear',
        experience: 15,
        specialties: ['Traditional Filipino', 'Barong Tagalog', 'Terno', 'Modern Fusion'],
        location: 'Manila, Philippines',
        description: 'Master tailor specializing in traditional Filipino garments with modern touches. 15+ years of experience crafting authentic cultural wear for special occasions and everyday elegance.',
        portfolio: [
          {
            id: '1',
            title: 'Traditional Barong Tagalog',
            description: 'Hand-embroidered formal Barong with intricate piña fiber details',
            images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
            category: 'traditional',
            tags: ['barong', 'formal', 'wedding'],
            completionTime: 14,
            price: 450
          },
          {
            id: '2',
            title: 'Modern Terno Dress',
            description: 'Contemporary interpretation of the classic Filipino Terno',
            images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'],
            category: 'modern-fusion',
            tags: ['terno', 'elegant', 'formal'],
            completionTime: 18,
            price: 680
          }
        ],
        rating: 4.9,
        reviewCount: 127,
        pricing: {
          basePrice: 150,
          pricePerComplexity: 50,
          rush: 75
        },
        availability: {
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          workingHours: { start: '09:00', end: '18:00' }
        }
      },
      {
        id: '2',
        email: 'ahmed.hassan@example.com',
        firstName: 'Ahmed',
        lastName: 'Hassan',
        role: 'tailor',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        isVerified: true,
        businessName: 'Hassan Luxury Tailoring',
        experience: 22,
        specialties: ['Suits', 'Formal Wear', 'Business Attire', 'Tuxedos'],
        location: 'London, UK',
        description: 'Savile Row trained master tailor with over two decades of experience in luxury menswear. Specializing in bespoke suits and formal wear with impeccable attention to detail.',
        portfolio: [
          {
            id: '3',
            title: 'Bespoke Three-Piece Suit',
            description: 'Hand-tailored navy suit with peak lapels and contrasting vest',
            images: ['https://images.unsplash.com/photo-1507038772120-7fff76f79d79?w=400'],
            category: 'formal',
            tags: ['suit', 'three-piece', 'business'],
            completionTime: 21,
            price: 1200
          },
          {
            id: '4',
            title: 'Black Tie Tuxedo',
            description: 'Classic evening wear with satin lapels and perfect fit',
            images: ['https://images.unsplash.com/photo-1594938501514-d1e85169a6d0?w=400'],
            category: 'formal',
            tags: ['tuxedo', 'black-tie', 'evening'],
            completionTime: 16,
            price: 950
          }
        ],
        rating: 4.8,
        reviewCount: 89,
        pricing: {
          basePrice: 300,
          pricePerComplexity: 100,
          rush: 150
        },
        availability: {
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: { start: '10:00', end: '17:00' }
        }
      },
      {
        id: '3',
        email: 'priya.sharma@example.com',
        firstName: 'Priya',
        lastName: 'Sharma',
        role: 'tailor',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        isVerified: true,
        businessName: 'Sharma Ethnic Designs',
        experience: 8,
        specialties: ['Sarees', 'Lehengas', 'Kurtis', 'Indo-Western'],
        location: 'Mumbai, India',
        description: 'Young and talented designer specializing in traditional Indian wear with contemporary flair. Expert in bridal wear and festive collections.',
        portfolio: [
          {
            id: '5',
            title: 'Bridal Lehenga Set',
            description: 'Heavily embroidered bridal lehenga with intricate zardozi work',
            images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400'],
            category: 'traditional',
            tags: ['lehenga', 'bridal', 'embroidered'],
            completionTime: 25,
            price: 800
          },
          {
            id: '6',
            title: 'Designer Kurti Collection',
            description: 'Modern kurties perfect for casual and office wear',
            images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'],
            category: 'casual',
            tags: ['kurti', 'casual', 'office'],
            completionTime: 7,
            price: 120
          }
        ],
        rating: 4.7,
        reviewCount: 156,
        pricing: {
          basePrice: 80,
          pricePerComplexity: 30,
          rush: 40
        },
        availability: {
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          workingHours: { start: '11:00', end: '19:00' }
        }
      },
      {
        id: '4',
        email: 'jean.dubois@example.com',
        firstName: 'Jean',
        lastName: 'Dubois',
        role: 'tailor',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        isVerified: true,
        businessName: 'Atelier Dubois',
        experience: 18,
        specialties: ['Haute Couture', 'Evening Gowns', 'Cocktail Dresses', 'Bridal'],
        location: 'Paris, France',
        description: 'Parisian couturier with extensive experience in high fashion and luxury garments. Known for elegant designs and exceptional craftsmanship.',
        portfolio: [
          {
            id: '7',
            title: 'Haute Couture Evening Gown',
            description: 'Hand-draped silk gown with custom beadwork and perfect silhouette',
            images: ['https://images.unsplash.com/photo-1566479179817-c8dbe9ebbe44?w=400'],
            category: 'formal',
            tags: ['gown', 'evening', 'couture'],
            completionTime: 30,
            price: 2500
          },
          {
            id: '8',
            title: 'Vintage-Inspired Cocktail Dress',
            description: 'Classic 1950s silhouette with modern fabric and details',
            images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'],
            category: 'vintage',
            tags: ['cocktail', 'vintage', 'elegant'],
            completionTime: 12,
            price: 750
          }
        ],
        rating: 4.9,
        reviewCount: 73,
        pricing: {
          basePrice: 500,
          pricePerComplexity: 200,
          rush: 300
        },
        availability: {
          workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: { start: '10:00', end: '16:00' }
        }
      },
      {
        id: '5',
        email: 'kenji.nakamura@example.com',
        firstName: 'Kenji',
        lastName: 'Nakamura',
        role: 'tailor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        isVerified: true,
        businessName: 'Nakamura Traditional Crafts',
        experience: 12,
        specialties: ['Kimono', 'Yukata', 'Haori', 'Modern Japanese'],
        location: 'Kyoto, Japan',
        description: 'Traditional Japanese garment specialist preserving ancient techniques while creating contemporary interpretations. Expert in silk work and traditional Japanese aesthetics.',
        portfolio: [
          {
            id: '9',
            title: 'Formal Silk Kimono',
            description: 'Hand-painted silk kimono with traditional motifs and obi',
            images: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400'],
            category: 'traditional',
            tags: ['kimono', 'silk', 'formal'],
            completionTime: 35,
            price: 1800
          },
          {
            id: '10',
            title: 'Modern Haori Jacket',
            description: 'Contemporary haori suitable for daily wear with traditional craftsmanship',
            images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'],
            category: 'modern-fusion',
            tags: ['haori', 'jacket', 'daily'],
            completionTime: 14,
            price: 420
          }
        ],
        rating: 4.8,
        reviewCount: 94,
        pricing: {
          basePrice: 200,
          pricePerComplexity: 80,
          rush: 100
        },
        availability: {
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
          workingHours: { start: '09:00', end: '17:00' }
        }
      }
    ]
  }
  
  async getTailorById(id: string): Promise<Tailor | null> {
    await this.delay(500)
    const tailors = await this.getTailors()
    return tailors.find(t => t.id === id) || null
  }
}

const tailorService = new TailorService()

export const useTailorStore = create<TailorState>()(
  persist(
    (set, get) => ({
      tailors: [],
      filteredTailors: [],
      filters: {},
      isLoading: false,
      error: null,
      selectedTailor: null,
      searchQuery: '',
      sortBy: 'rating',
      
      loadTailors: async () => {
        try {
          set({ isLoading: true, error: null })
          const tailors = await tailorService.getTailors()
          set({ tailors, filteredTailors: tailors, isLoading: false })
          get().applyFilters()
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load tailors',
            isLoading: false 
          })
        }
      },
      
      setFilters: (newFilters: Partial<TailorFilters>) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters }
        }))
        get().applyFilters()
      },
      
      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
        get().applyFilters()
      },
      
      setSortBy: (sort: 'rating' | 'price' | 'experience' | 'distance') => {
        set({ sortBy: sort })
        get().applyFilters()
      },
      
      selectTailor: async (tailorId: string) => {
        try {
          set({ isLoading: true })
          const tailor = await tailorService.getTailorById(tailorId)
          set({ selectedTailor: tailor, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load tailor',
            isLoading: false 
          })
        }
      },
      
      clearFilters: () => {
        set({ filters: {}, searchQuery: '' })
        get().applyFilters()
      },
      
      applyFilters: () => {
        const { tailors, filters, searchQuery, sortBy } = get()
        let filtered = [...tailors]
        
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(tailor => 
            tailor.firstName.toLowerCase().includes(query) ||
            tailor.lastName.toLowerCase().includes(query) ||
            tailor.businessName.toLowerCase().includes(query) ||
            tailor.specialties.some(s => s.toLowerCase().includes(query)) ||
            tailor.location.toLowerCase().includes(query)
          )
        }
        
        // Location filter
        if (filters.location) {
          filtered = filtered.filter(tailor => 
            tailor.location.toLowerCase().includes(filters.location!.toLowerCase())
          )
        }
        
        // Specialties filter
        if (filters.specialties && filters.specialties.length > 0) {
          filtered = filtered.filter(tailor =>
            filters.specialties!.some(specialty =>
              tailor.specialties.some(ts => ts.toLowerCase().includes(specialty.toLowerCase()))
            )
          )
        }
        
        // Price range filter
        if (filters.priceRange) {
          const [min, max] = filters.priceRange
          filtered = filtered.filter(tailor =>
            tailor.pricing.basePrice >= min && tailor.pricing.basePrice <= max
          )
        }
        
        // Rating filter
        if (filters.rating) {
          filtered = filtered.filter(tailor => tailor.rating >= filters.rating!)
        }
        
        // Experience filter
        if (filters.experience) {
          filtered = filtered.filter(tailor => tailor.experience >= filters.experience!)
        }
        
        // Sort
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return b.rating - a.rating
            case 'price':
              return a.pricing.basePrice - b.pricing.basePrice
            case 'experience':
              return b.experience - a.experience
            case 'distance':
              // Mock distance sorting
              return Math.random() - 0.5
            default:
              return 0
          }
        })
        
        set({ filteredTailors: filtered })
      }
    }),
    {
      name: 'tailor-storage',
      partialize: (state) => ({ 
        tailors: state.tailors,
        selectedTailor: state.selectedTailor 
      })
    }
  )
)