// data/mockTailorBusinessData.ts - Comprehensive Mock Data for Tailor Dashboard
import type { 
  BusinessMetrics, 
  CustomerProfile, 
  PortfolioProject, 
  InventoryItem, 
  TimeEntry,
  CapacityPlan 
} from '../types/tailorBusiness';
import { useTailorBusinessStore } from '../store/tailorBusinessStore';

export const mockBusinessMetrics: BusinessMetrics = {
  revenue: {
    total: 47250,
    thisMonth: 5890,
    lastMonth: 4250,
    growth: 38.6,
    forecast: 6200,
    trend: 'up'
  },
  orders: {
    total: 127,
    completed: 118,
    active: 7,
    cancelled: 2,
    completionRate: 92.9,
    averageValue: 372,
    repeatCustomerRate: 67.3
  },
  customers: {
    total: 89,
    new: 12,
    returning: 23,
    retention: 78.4,
    lifetime: 531,
    satisfaction: 4.7
  },
  performance: {
    averageDeliveryTime: 18.5,
    qualityRating: 4.8,
    responseTime: 2.3,
    capacity: 87.5,
    efficiency: 94.2
  }
};

export const mockPortfolioProjects: PortfolioProject[] = [
  {
    id: 'project_1',
    title: 'Vintage Wedding Dress Restoration',
    description: 'Complete restoration of a 1940s silk wedding dress with modern alterations while preserving the vintage charm.',
    garmentType: 'Wedding Dress',
    style: 'Vintage Revival',
    techniques: ['Hand Sewing', 'Silk Restoration', 'Beadwork', 'Alteration'],
    materials: ['Silk Charmeuse', 'Vintage Lace', 'Pearl Beads', 'French Seams'],
    timeToComplete: 45,
    difficulty: 'expert',
    price: 1200,
    currency: 'USD',
    status: 'featured',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-04-20'),
    images: [
      {
        id: 'img_1',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Vintage wedding dress restoration - completed',
        type: 'hero',
        order: 1,
        isPrivate: false
      }
    ],
    processSteps: [],
    views: 2847,
    likes: 156,
    inquiries: 23,
    orders: 3,
    rating: 4.9,
    reviews: [],
    tags: ['vintage', 'wedding', 'restoration', 'silk'],
    customizations: ['Size alteration', 'Modern understructure', 'Preservation treatment']
  },
  {
    id: 'project_2',
    title: 'Modern Business Suit Collection',
    description: 'Contemporary take on classic business attire with sustainable materials and perfect fit.',
    garmentType: 'Business Suit',
    style: 'Modern Professional',
    techniques: ['Machine Tailoring', 'Hand Finishing', 'Pressed Seams'],
    materials: ['Wool Blend', 'Recycled Polyester', 'Natural Buttons'],
    timeToComplete: 28,
    difficulty: 'advanced',
    price: 850,
    currency: 'USD',
    status: 'published',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-05-15'),
    images: [
      {
        id: 'img_2',
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Modern business suit - navy blue',
        type: 'hero',
        order: 1,
        isPrivate: false
      }
    ],
    processSteps: [],
    views: 1523,
    likes: 89,
    inquiries: 12,
    orders: 5,
    rating: 4.7,
    reviews: [],
    tags: ['business', 'modern', 'sustainable', 'professional'],
    customizations: ['Custom measurements', 'Fabric selection', 'Personalized lining']
  }
];

export const mockCustomerProfiles: CustomerProfile[] = [
  {
    id: 'customer_1',
    personalInfo: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0123',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      location: {
        city: 'New York',
        country: 'USA',
        timezone: 'EST'
      }
    },
    businessMetrics: {
      totalOrders: 8,
      totalSpent: 3250,
      averageOrderValue: 406,
      lifetimeValue: 4200,
      firstOrderDate: new Date('2023-06-15'),
      lastOrderDate: new Date('2024-05-20'),
      orderFrequency: 1.2,
      churnRisk: 'low',
      loyaltyTier: 'gold'
    },
    preferences: {
      garmentTypes: ['Dresses', 'Suits', 'Formal Wear'],
      preferredStyles: ['Classic', 'Elegant', 'Tailored'],
      favoriteColors: ['Navy', 'Black', 'Ivory', 'Burgundy'],
      materialPreferences: ['Silk', 'Wool', 'Cotton'],
      budgetRange: { min: 300, max: 800 },
      preferredTimeline: 4,
      communicationPreference: 'email',
      meetingPreference: 'virtual'
    },
    measurements: {
      profiles: [],
      lastUpdated: new Date('2024-05-20'),
      notes: 'Prefers classic fit with room for comfort',
      fitPreferences: ['Classic fit', 'Slightly loose through waist']
    },
    communication: {
      totalMessages: 45,
      responseRate: 95,
      averageResponseTime: 1.2,
      preferredContactTime: '10:00-16:00',
      languagePreference: 'English',
      lastContact: new Date('2024-05-25')
    },
    feedback: {
      averageRating: 4.9,
      totalReviews: 6,
      satisfactionScore: 95,
      recommendationLikelihood: 9,
      commonCompliments: ['Excellent fit', 'Beautiful craftsmanship', 'Professional service'],
      areasForImprovement: []
    },
    notes: [],
    tags: ['VIP', 'Wedding Client', 'Referral Source'],
    customFields: {},
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-05-25')
  }
];

export const mockInventoryItems: InventoryItem[] = [
  {
    id: 'inv_1',
    name: 'Premium Wool Suiting - Navy',
    category: 'fabric',
    subcategory: 'Wool',
    description: 'High-quality wool blend perfect for business suits and formal wear',
    currentStock: 45,
    unit: 'yards',
    minimumStock: 15,
    reorderPoint: 25,
    reorderQuantity: 50,
    maxStock: 100,
    costPerUnit: 85,
    currency: 'USD',
    supplier: 'Premium Textiles Inc.',
    supplierSku: 'PTI-WOOL-NAVY-001',
    lastPurchasePrice: 85,
    lastPurchaseDate: new Date('2024-04-15'),
    color: 'Navy Blue',
    material: '80% Wool, 20% Polyester',
    weight: 280, // GSM
    width: 60, // inches
    composition: '80% Wool, 20% Polyester',
    careInstructions: 'Dry clean only',
    location: 'Shelf A-3',
    barcode: '123456789012',
    images: [],
    usageHistory: [],
    reservedQuantity: 12,
    availableQuantity: 33,
    status: 'active',
    notes: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-05-20')
  },
  {
    id: 'inv_2',
    name: 'Silk Lining - Champagne',
    category: 'lining',
    subcategory: 'Silk',
    description: 'Luxurious silk lining in champagne color',
    currentStock: 8,
    unit: 'yards',
    minimumStock: 15,
    reorderPoint: 20,
    reorderQuantity: 40,
    maxStock: 80,
    costPerUnit: 45,
    currency: 'USD',
    supplier: 'Luxury Linings Co.',
    lastPurchasePrice: 45,
    lastPurchaseDate: new Date('2024-03-20'),
    color: 'Champagne',
    material: '100% Silk',
    weight: 120,
    width: 45,
    composition: '100% Silk',
    careInstructions: 'Dry clean only',
    location: 'Shelf B-1',
    images: [],
    usageHistory: [],
    reservedQuantity: 3,
    availableQuantity: 5,
    status: 'low_stock',
    notes: ['Popular for wedding dresses', 'Consider increasing minimum stock'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-05-18')
  }
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: 'time_1',
    tailorId: 'tailor_1',
    orderId: 'order_2024_001',
    taskType: 'sewing',
    taskDescription: 'Working on suit jacket construction',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    totalMinutes: 90,
    breakMinutes: 0,
    productiveMinutes: 90,
    hourlyRate: 75,
    billableMinutes: 90,
    totalCost: 112.5,
    isBillable: true,
    difficultyLevel: 4,
    qualityRating: 5,
    efficiency: 1.1,
    status: 'completed',
    notes: 'Excellent progress on jacket construction',
    attachments: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

export const mockCapacityPlan: CapacityPlan = {
  id: 'capacity_1',
  tailorId: 'tailor_1',
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  dailyWorkingHours: 8,
  workingDaysPerWeek: 5,
  maxConcurrentOrders: 6,
  bufferTimePercentage: 15,
  allocatedHours: 140,
  availableHours: 20,
  utilizationRate: 87.5,
  bookings: [
    {
      id: 'booking_1',
      orderId: 'order_2024_001',
      orderTitle: 'Wedding Dress Alteration',
      customerId: 'customer_1',
      customerName: 'Sarah Johnson',
      estimatedHours: 25,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'in_progress'
    }
  ],
  demandForecast: 145,
  capacityRecommendations: [
    'Consider blocking Saturday appointments for overflow work',
    'Current utilization is optimal for quality delivery'
  ]
};

// Initialize mock data
export const initializeMockTailorBusinessData = () => {
  const store = useTailorBusinessStore.getState();
  
  if (!store.businessMetrics) {
    useTailorBusinessStore.setState({
      businessMetrics: mockBusinessMetrics,
      portfolioProjects: mockPortfolioProjects,
      customerProfiles: mockCustomerProfiles,
      inventoryItems: mockInventoryItems,
      timeEntries: mockTimeEntries,
      capacityPlan: mockCapacityPlan,
      portfolioAnalytics: {
        totalViews: 4370,
        totalLikes: 245,
        totalInquiries: 35,
        conversionRate: 0.23,
        topPerformingProjects: mockPortfolioProjects,
        viewsByPeriod: [],
        projectsByGarmentType: [
          { type: 'Wedding Dresses', count: 8, revenue: 12400 },
          { type: 'Business Suits', count: 12, revenue: 8900 },
          { type: 'Formal Dresses', count: 6, revenue: 4200 }
        ],
        skillDemand: [
          { skill: 'Wedding Dress Design', demand: 45, avgPrice: 1200 },
          { skill: 'Suit Tailoring', demand: 38, avgPrice: 850 },
          { skill: 'Vintage Restoration', demand: 23, avgPrice: 900 }
        ],
        seoRanking: []
      },
      productivityMetrics: {
        totalHours: 156,
        billableHours: 142,
        billabilityRate: 91.0,
        averageHourlyRate: 68,
        totalRevenue: 9656,
        taskBreakdown: [
          { taskType: 'sewing', hours: 89, percentage: 57, revenue: 5564 },
          { taskType: 'consultation', hours: 23, percentage: 15, revenue: 1725 },
          { taskType: 'fitting', hours: 18, percentage: 11, revenue: 1350 },
          { taskType: 'design', hours: 15, percentage: 10, revenue: 1125 },
          { taskType: 'admin', hours: 11, percentage: 7, revenue: 0 }
        ],
        averageEfficiency: 1.08,
        averageQuality: 4.7,
        onTimeDelivery: 94.2,
        weeklyTrends: []
      },
      marketInsights: {
        trendingStyles: [
          { name: 'Sustainable Fashion', growth: 34, demand: 78 },
          { name: 'Vintage Revival', growth: 28, demand: 65 },
          { name: 'Minimalist Design', growth: 22, demand: 82 }
        ],
        seasonalTrends: [],
        competitorAnalysis: {
          averagePrice: 750,
          averageRating: 4.3,
          averageDeliveryTime: 21,
          yourPosition: 'above'
        },
        recommendations: [
          {
            type: 'pricing',
            title: 'Increase Premium Service Pricing',
            description: 'Your quality ratings are 15% above market average. Consider 10-15% price increase for premium services.',
            impact: 'high',
            effort: 'low'
          },
          {
            type: 'style',
            title: 'Expand Sustainable Fashion Offerings',
            description: 'Sustainable fashion demand is growing 34% year-over-year. Consider adding eco-friendly options.',
            impact: 'medium',
            effort: 'medium'
          }
        ]
      },
      customerSegments: [
        {
          id: 'segment_1',
          name: 'High-Value Wedding Clients',
          description: 'Customers with wedding-related orders over $1000',
          criteria: { totalSpent: { min: 1000 }, garmentTypes: ['Wedding Dress', 'Bridal'] },
          customerCount: 23,
          totalValue: 28900,
          createdAt: new Date('2024-03-01')
        },
        {
          id: 'segment_2',
          name: 'Corporate Professionals',
          description: 'Business suit clients with multiple orders',
          criteria: { orderCount: { min: 3 }, garmentTypes: ['Business Suit', 'Formal'] },
          customerCount: 31,
          totalValue: 22150,
          createdAt: new Date('2024-03-15')
        }
      ],
      certifications: [
        {
          id: 'cert_1',
          name: 'Master Tailor Certification',
          level: 'master',
          issuedBy: 'International Tailoring Guild',
          issuedAt: new Date('2022-08-15'),
          verificationCode: 'ITG-MT-2022-1847',
          badgeUrl: '',
          skills: ['Advanced Pattern Making', 'Hand Sewing', 'Fitting Expertise'],
          projects: ['project_1', 'project_2']
        },
        {
          id: 'cert_2',
          name: 'Sustainable Fashion Design',
          level: 'advanced',
          issuedBy: 'Eco Fashion Institute',
          issuedAt: new Date('2023-05-20'),
          verificationCode: 'EFI-SF-2023-0924',
          badgeUrl: '',
          skills: ['Sustainable Materials', 'Eco-friendly Techniques', 'Zero Waste Design'],
          projects: ['project_2']
        }
      ]
    });
  }
};