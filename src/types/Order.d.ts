// src/types/order.ts
// Order type for use in store and components
import type { Customer, Tailor } from './user';
import type { OrderStatus } from './order';

export interface Order {
  id: string;
  customer: Customer;
  tailor: Tailor;
  garmentType: string;
  style: string;
  measurements: Record<string, number>;
  requirements: string;
  timeline: number;
  basePrice: number;
  customizations: Array<{ name: string; price: number }>;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  expectedDelivery: Date;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}
