// data/mockOrderData.ts - Mock Order Data for Testing
import type { Order } from '@/types';
import { OrderStatus } from '@/types';

export const initializeMockOrderData = () => {
  // This function would typically initialize order data in a real app
  // Here it just returns the mock data
  return mockOrders;
};

export const mockOrders: Order[] = [
  {
    id: 'order_2024_001',
    customer: {
      id: 'customer_1',
      email: 'sarah.johnson@email.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      isVerified: true
    },
    tailor: {
      id: 'tailor_1',
      email: 'maria.santos@email.com',
      firstName: 'Maria',
      lastName: 'Santos',
      role: 'tailor',
      businessName: 'Traditional Filipino Couture',
      experience: 10,
      specialties: ['Filipino Traditional', 'Formal Wear'],
      location: 'Manila, Philippines',
      description: 'Specializing in traditional Filipino attire with modern touches',
      portfolio: [],
      rating: 4.8,
      reviewCount: 45,
      isVerified: true,
      pricing: {
        basePrice: 350,
        pricePerComplexity: 50,
        rush: 100
      },
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
          start: '09:00',
          end: '18:00'
        }
      }
    },
    garmentType: 'Filipiniana Dress',
    style: 'Modern Terno',
    measurements: {
      height: 165,
      chest: 86,
      waist: 68,
      hip: 92,
      shoulderWidth: 38,
      armLength: 58,
      size: 2
    },
    requirements: 'Traditional Filipino formal dress for a wedding ceremony. Prefer ivory or champagne color with delicate embroidery.',
    timeline: 6,
    basePrice: 450,
    customizations: [
      { name: 'Premium Fabric', price: 80 },
      { name: 'Hand Embroidery', price: 120 }
    ],
    totalPrice: 650,
    status: OrderStatus.IN_PROGRESS,
    createdAt: new Date('2024-05-15'),
    expectedDelivery: new Date('2024-06-26'),
    paymentStatus: 'paid'
  },
  {
    id: 'order_2024_002',
    customer: {
      id: 'customer_2',
      email: 'james.wright@email.com',
      firstName: 'James',
      lastName: 'Wright',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      isVerified: true
    },
    tailor: {
      id: 'tailor_2',
      email: 'rajesh.kumar@email.com',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      role: 'tailor',
      businessName: 'Kumar Bespoke Suits',
      experience: 15,
      specialties: ['Suits', 'Indo-Western'],
      location: 'New Delhi, India',
      description: 'Carrying forward a family legacy of fine tailoring for three generations',
      portfolio: [],
      rating: 4.9,
      reviewCount: 78,
      isVerified: true,
      pricing: {
        basePrice: 400,
        pricePerComplexity: 75,
        rush: 150
      },
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: {
          start: '10:00',
          end: '19:00'
        }
      }
    },
    garmentType: 'Business Suit',
    style: 'Classic Three-Piece',
    measurements: {
      height: 182,
      chest: 102,
      waist: 84,
      hip: 98,
      shoulderWidth: 45,
      armLength: 65,
      size: 3
    },
    requirements: 'Navy blue three-piece suit for business meetings. Prefer wool blend with subtle pattern. Need additional adjustments for athletic build.',
    timeline: 5,
    basePrice: 550,
    customizations: [
      { name: 'Premium Wool', price: 120 },
      { name: 'Monogrammed Initials', price: 35 }
    ],
    totalPrice: 705,
    status: OrderStatus.PENDING_ACCEPTANCE,
    createdAt: new Date('2024-05-20'),
    expectedDelivery: new Date('2024-06-25'),
    paymentStatus: 'pending'
  },
  {
    id: 'order_2024_003',
    customer: {
      id: 'customer_3',
      email: 'ling.chen@email.com',
      firstName: 'Ling',
      lastName: 'Chen',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      isVerified: true
    },
    tailor: {
      id: 'tailor_3',
      email: 'sofia.rodriguez@email.com',
      firstName: 'Sofia',
      lastName: 'Rodriguez',
      role: 'tailor',
      businessName: 'Eleganté Couture',
      experience: 8,
      specialties: ['Evening Wear', 'Bridal'],
      location: 'Barcelona, Spain',
      description: 'Creating timeless elegance with contemporary flair',
      portfolio: [],
      rating: 4.7,
      reviewCount: 36,
      isVerified: true,
      pricing: {
        basePrice: 500,
        pricePerComplexity: 100,
        rush: 200
      },
      availability: {
        workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: {
          start: '11:00',
          end: '20:00'
        }
      }
    },
    garmentType: 'Evening Gown',
    style: 'Contemporary Cheongsam',
    measurements: {
      height: 170,
      chest: 88,
      waist: 70,
      hip: 94,
      shoulderWidth: 37,
      armLength: 60,
      size: 2
    },
    requirements: 'Fusion modern cheongsam in emerald green silk for a gala event. High collar with gold embroidery details. Side slit for ease of movement.',
    timeline: 4,
    basePrice: 650,
    customizations: [
      { name: 'Silk Upgrade', price: 150 },
      { name: 'Hand-beaded Detail', price: 200 }
    ],
    totalPrice: 1000,
    status: OrderStatus.ACCEPTED,
    createdAt: new Date('2024-05-10'),
    expectedDelivery: new Date('2024-06-08'),
    paymentStatus: 'paid'
  },
  {
    id: 'order_2024_004',
    customer: {
      id: 'customer_4',
      email: 'michael.brown@email.com',
      firstName: 'Michael',
      lastName: 'Brown',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
      isVerified: true
    },
    tailor: {
      id: '2',
      email: 'tailor@example.com',
      firstName: 'John',
      lastName: 'Tailor',
      role: 'tailor',
      businessName: 'John\'s Custom Tailoring',
      experience: 12,
      specialties: ['Suits', 'Formal Wear', 'Alterations'],
      location: 'New York, USA',
      description: 'Professional tailoring services with attention to detail',
      portfolio: [],
      rating: 4.6,
      reviewCount: 52,
      isVerified: true,
      pricing: {
        basePrice: 300,
        pricePerComplexity: 60,
        rush: 120
      },
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
          start: '09:00',
          end: '17:00'
        }
      }
    },
    garmentType: 'Wedding Suit',
    style: 'Classic Tuxedo',
    measurements: {
      height: 178,
      chest: 100,
      waist: 82,
      hip: 96,
      shoulderWidth: 44,
      armLength: 64,
      size: 3
    },
    requirements: 'Black tuxedo for wedding ceremony. Prefer classic style with satin lapels. Need perfect fit for special day.',
    timeline: 8,
    basePrice: 450,
    customizations: [
      { name: 'Satin Lapels', price: 60 },
      { name: 'Bow Tie Included', price: 25 }
    ],
    totalPrice: 535,
    status: OrderStatus.PENDING_ACCEPTANCE,
    createdAt: new Date('2024-05-22'),
    expectedDelivery: new Date('2024-07-03'),
    paymentStatus: 'pending'
  },
  {
    id: 'order_2024_005',
    customer: {
      id: 'customer_5',
      email: 'emma.davis@email.com',
      firstName: 'Emma',
      lastName: 'Davis',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
      isVerified: true
    },
    tailor: {
      id: '2',
      email: 'tailor@example.com',
      firstName: 'John',
      lastName: 'Tailor',
      role: 'tailor',
      businessName: 'John\'s Custom Tailoring',
      experience: 12,
      specialties: ['Suits', 'Formal Wear', 'Alterations'],
      location: 'New York, USA',
      description: 'Professional tailoring services with attention to detail',
      portfolio: [],
      rating: 4.6,
      reviewCount: 52,
      isVerified: true,
      pricing: {
        basePrice: 300,
        pricePerComplexity: 60,
        rush: 120
      },
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
          start: '09:00',
          end: '17:00'
        }
      }
    },
    garmentType: 'Cocktail Dress',
    style: 'Little Black Dress',
    measurements: {
      height: 165,
      chest: 84,
      waist: 66,
      hip: 90,
      shoulderWidth: 36,
      armLength: 57,
      size: 1
    },
    requirements: 'Elegant black cocktail dress for corporate events. Knee-length with sophisticated cut. Comfortable for long evenings.',
    timeline: 3,
    basePrice: 280,
    customizations: [
      { name: 'Premium Fabric', price: 70 },
      { name: 'Custom Lining', price: 40 }
    ],
    totalPrice: 390,
    status: OrderStatus.IN_PROGRESS,
    createdAt: new Date('2024-05-18'),
    expectedDelivery: new Date('2024-06-08'),
    paymentStatus: 'paid'
  },
  {
    id: 'order_2024_006',
    customer: {
      id: 'customer_6',
      email: 'robert.wilson@email.com',
      firstName: 'Robert',
      lastName: 'Wilson',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
      isVerified: true
    },
    tailor: {
      id: '2',
      email: 'tailor@example.com',
      firstName: 'John',
      lastName: 'Tailor',
      role: 'tailor',
      businessName: 'John\'s Custom Tailoring',
      experience: 12,
      specialties: ['Suits', 'Formal Wear', 'Alterations'],
      location: 'New York, USA',
      description: 'Professional tailoring services with attention to detail',
      portfolio: [],
      rating: 4.6,
      reviewCount: 52,
      isVerified: true,
      pricing: {
        basePrice: 300,
        pricePerComplexity: 60,
        rush: 120
      },
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
          start: '09:00',
          end: '17:00'
        }
      }
    },
    garmentType: 'Casual Blazer',
    style: 'Modern Fit',
    measurements: {
      height: 175,
      chest: 98,
      waist: 80,
      hip: 94,
      shoulderWidth: 43,
      armLength: 62,
      size: 2
    },
    requirements: 'Navy blue blazer for business casual wear. Modern fit that works with jeans or dress pants. Quality cotton blend preferred.',
    timeline: 4,
    basePrice: 220,
    customizations: [
      { name: 'Contrast Buttons', price: 15 },
      { name: 'Ticket Pocket', price: 20 }
    ],
    totalPrice: 255,
    status: OrderStatus.COMPLETED,
    createdAt: new Date('2024-05-05'),
    expectedDelivery: new Date('2024-05-26'),
    paymentStatus: 'paid'
  },
  {
    id: 'order_2024_007',
    customer: {
      id: 'customer_7',
      email: 'lisa.garcia@email.com',
      firstName: 'Lisa',
      lastName: 'Garcia',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
      isVerified: true
    },
    tailor: {
      id: '2',
      email: 'tailor@example.com',
      firstName: 'John',
      lastName: 'Tailor',
      role: 'tailor',
      businessName: 'John\'s Custom Tailoring',
      experience: 12,
      specialties: ['Suits', 'Formal Wear', 'Alterations'],
      location: 'New York, USA',
      description: 'Professional tailoring services with attention to detail',
      portfolio: [],
      rating: 4.6,
      reviewCount: 52,
      isVerified: true,
      pricing: {
        basePrice: 300,
        pricePerComplexity: 60,
        rush: 120
      },
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
          start: '09:00',
          end: '17:00'
        }
      }
    },
    garmentType: 'Evening Dress',
    style: 'A-Line Cocktail Dress',
    measurements: {
      height: 168,
      chest: 88,
      waist: 70,
      hip: 94,
      shoulderWidth: 36,
      armLength: 56,
      size: 2
    },
    requirements: 'Black cocktail dress for a corporate event. Knee-length, professional yet elegant design.',
    timeline: 3,
    basePrice: 280,
    customizations: [
      { name: 'Premium Lining', price: 40 },
      { name: 'Belt Addition', price: 25 }
    ],
    totalPrice: 345,
    status: OrderStatus.PENDING_ACCEPTANCE,
    createdAt: new Date('2024-06-10'),
    expectedDelivery: new Date('2024-07-01'),
    paymentStatus: 'pending'
  },
  {
    id: 'order_2024_008',
    customer: {
      id: 'customer_8',
      email: 'robert.kim@email.com',
      firstName: 'Robert',
      lastName: 'Kim',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
      isVerified: true
    },
    tailor: {
      id: '2',
      email: 'tailor@example.com',
      firstName: 'John',
      lastName: 'Tailor',
      role: 'tailor',
      businessName: 'John\'s Custom Tailoring',
      experience: 12,
      specialties: ['Suits', 'Formal Wear', 'Alterations'],
      location: 'New York, USA',
      description: 'Professional tailoring services with attention to detail',
      portfolio: [],
      rating: 4.6,
      reviewCount: 52,
      isVerified: true,
      pricing: {
        basePrice: 300,
        pricePerComplexity: 60,
        rush: 120
      },
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
          start: '09:00',
          end: '17:00'
        }
      }
    },
    garmentType: 'Casual Shirt',
    style: 'Button-Down Oxford',
    measurements: {
      height: 175,
      chest: 96,
      waist: 80,
      hip: 88,
      shoulderWidth: 42,
      armLength: 62,
      size: 3
    },
    requirements: 'Light blue oxford shirt for casual business wear. High-quality cotton fabric.',
    timeline: 2,
    basePrice: 120,
    customizations: [
      { name: 'Monogram', price: 15 },
      { name: 'Contrast Collar', price: 20 }
    ],
    totalPrice: 155,
    status: OrderStatus.IN_PROGRESS,
    createdAt: new Date('2024-06-05'),
    expectedDelivery: new Date('2024-06-19'),
    paymentStatus: 'paid'
  }
];
