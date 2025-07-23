// data/mockPaymentData.ts - Mock Payment System Data
import type { 
  PaymentIntent, 
  PaymentMethod, 
  Transaction, 
  EscrowAccount, 
  TailorPayout
} from '../types/payment';
import {
  PaymentStatus,
  EscrowStatus,
  PayoutStatus,
  TransactionType
} from '../types/payment';
import { usePaymentStore } from '../store/paymentStore';

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    customerId: 'customer_1',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    stripePaymentMethodId: 'pm_stripe_1',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'pm_2',
    customerId: 'customer_1',
    type: 'card',
    brand: 'mastercard',
    last4: '5555',
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
    stripePaymentMethodId: 'pm_stripe_2',
    createdAt: new Date('2024-03-20')
  }
];

export const mockPaymentIntents: PaymentIntent[] = [
  {
    id: 'pi_2024_001',
    orderId: 'order_2024_001',
    customerId: 'customer_1',
    tailorId: 'tailor_1',
    amount: 682.45,
    currency: 'usd',
    status: PaymentStatus.SUCCEEDED,
    platformFee: 32.50,
    tailorAmount: 617.50,
    stripePaymentIntentId: 'pi_stripe_2024_001',
    createdAt: new Date('2024-05-15'),
    confirmedAt: new Date('2024-05-15'),
    metadata: {
      orderTotal: 650.00,
      stripeFee: 18.85,
      garmentType: 'Filipiniana Dress'
    }
  },
  {
    id: 'pi_2024_002',
    orderId: 'order_2024_003',
    customerId: 'customer_1',
    tailorId: 'tailor_3',
    amount: 1312.75,
    currency: 'usd',
    status: PaymentStatus.SUCCEEDED,
    platformFee: 62.50,
    tailorAmount: 1187.50,
    stripePaymentIntentId: 'pi_stripe_2024_002',
    createdAt: new Date('2024-04-20'),
    confirmedAt: new Date('2024-04-20'),
    metadata: {
      orderTotal: 1250.00,
      stripeFee: 36.55,
      garmentType: 'Lehenga Choli'
    }
  }
];

export const mockEscrowAccounts: EscrowAccount[] = [
  {
    id: 'escrow_2024_001',
    orderId: 'order_2024_001',
    paymentIntentId: 'pi_2024_001',
    amount: 682.45,
    currency: 'usd',
    status: EscrowStatus.HELD,
    holdUntil: new Date('2024-06-26'),
    platformFee: 32.50,
    tailorAmount: 617.50
  },
  {
    id: 'escrow_2024_002',
    orderId: 'order_2024_003',
    paymentIntentId: 'pi_2024_002',
    amount: 1312.75,
    currency: 'usd',
    status: EscrowStatus.RELEASED,
    holdUntil: new Date('2024-06-15'),
    releasedAt: new Date('2024-06-16'),
    releasedAmount: 1187.50,
    platformFee: 62.50,
    tailorAmount: 1187.50
  }
];

export const mockTailorPayouts: TailorPayout[] = [
  {
    id: 'payout_2024_001',
    tailorId: 'tailor_3',
    amount: 1187.50,
    currency: 'usd',
    status: PayoutStatus.COMPLETED,
    escrowAccountIds: ['escrow_2024_002'],
    scheduledDate: new Date('2024-06-19'),
    processedAt: new Date('2024-06-19'),
    bankAccount: '•••• •••• •••• 1234'
  },
  {
    id: 'payout_2024_002',
    tailorId: 'tailor_1',
    amount: 617.50,
    currency: 'usd',
    status: PayoutStatus.SCHEDULED,
    escrowAccountIds: ['escrow_2024_001'],
    scheduledDate: new Date('2024-06-29'),
    bankAccount: '•••• •••• •••• 5678'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'txn_2024_001',
    paymentIntentId: 'pi_2024_001',
    orderId: 'order_2024_001',
    type: TransactionType.PAYMENT,
    amount: 682.45,
    currency: 'usd',
    status: PaymentStatus.SUCCEEDED,
    description: 'Payment for order ORDER_001',
    createdAt: new Date('2024-05-15'),
    processedAt: new Date('2024-05-15')
  },
  {
    id: 'txn_2024_002',
    paymentIntentId: 'pi_2024_002',
    orderId: 'order_2024_003',
    type: TransactionType.PAYMENT,
    amount: 1312.75,
    currency: 'usd',
    status: PaymentStatus.SUCCEEDED,
    description: 'Payment for order ORDER_003',
    createdAt: new Date('2024-04-20'),
    processedAt: new Date('2024-04-20')
  },
  {
    id: 'txn_2024_003',
    paymentIntentId: 'pi_2024_002',
    orderId: 'order_2024_003',
    type: TransactionType.PAYOUT,
    amount: 1187.50,
    currency: 'usd',
    status: PaymentStatus.SUCCEEDED,
    description: 'Payout to tailor for order ORDER_003',
    createdAt: new Date('2024-06-19'),
    processedAt: new Date('2024-06-19')
  }
];

// Initialize payment store with mock data
export const initializeMockPaymentData = () => {
  const store = usePaymentStore.getState();
  
  // Only initialize if no payment data exists
  if (store.paymentIntents.length === 0) {
    usePaymentStore.setState({
      paymentIntents: mockPaymentIntents,
      paymentMethods: mockPaymentMethods,
      transactions: mockTransactions,
      escrowAccounts: mockEscrowAccounts,
      tailorPayouts: mockTailorPayouts
    });
  }
};