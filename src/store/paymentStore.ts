// store/paymentStore.ts - Payment System State Management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  PaymentIntent, 
  PaymentMethod, 
  Transaction, 
  EscrowAccount, 
  TailorPayout, 
  Invoice
} from '../types/payment';
import {
  PaymentStatus,
  EscrowStatus,
  PayoutStatus,
  TransactionType
} from '../types/payment';

interface PaymentState {
  // State
  paymentIntents: PaymentIntent[];
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  escrowAccounts: EscrowAccount[];
  tailorPayouts: TailorPayout[];
  invoices: Invoice[];
  loading: boolean;
  error: string | null;

  // Customer Payment Actions
  createPaymentIntent: (orderData: { orderId: string; customerId: string; tailorId: string; totalPrice: number; garmentType: string }) => Promise<PaymentIntent>;
  confirmPayment: (paymentIntentId: string, paymentMethodId?: string) => Promise<boolean>;
  savePaymentMethod: (paymentMethod: Partial<PaymentMethod>) => void;
  getCustomerPaymentHistory: (customerId: string) => PaymentIntent[];
  getCustomerInvoices: (customerId: string) => Invoice[];
  
  // Escrow Management
  createEscrowAccount: (paymentIntentId: string) => void;
  releaseEscrow: (escrowId: string) => void;
  disputeEscrow: (escrowId: string, reason: string) => void;
  refundEscrow: (escrowId: string, reason: string) => void;
  
  // Tailor Payout Actions
  getTailorEarnings: (tailorId: string) => { total: number; available: number; pending: number };
  requestPayout: (tailorId: string, amount: number) => void;
  getTailorPayouts: (tailorId: string) => TailorPayout[];
  processPayout: (payoutId: string) => void;
  
  // Transaction Management
  addTransaction: (transaction: Partial<Transaction>) => void;
  getTransactionHistory: (userId: string, userType: 'customer' | 'tailor') => Transaction[];
  
  // Utility Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      // Initial State
      paymentIntents: [],
      paymentMethods: [],
      transactions: [],
      escrowAccounts: [],
      tailorPayouts: [],
      invoices: [],
      loading: false,
      error: null,

      // Customer Payment Actions
      createPaymentIntent: async (orderData) => {
        set({ loading: true, error: null });
        try {
          const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const subtotal = orderData.totalPrice;
          const platformFeeRate = 0.05; // 5%
          const stripeFeeRate = 0.029; // 2.9% + $0.30
          const stripeFeeFixed = 0.30;
          const platformFee = subtotal * platformFeeRate;
          const stripeFee = (subtotal * stripeFeeRate) + stripeFeeFixed;
          const totalAmount = subtotal + platformFee + stripeFee;
          const tailorAmount = subtotal - platformFee;
          const paymentIntent: PaymentIntent = {
            id: paymentIntentId,
            orderId: orderData.orderId,
            customerId: orderData.customerId,
            tailorId: orderData.tailorId,
            amount: totalAmount,
            currency: 'usd',
            status: PaymentStatus.PENDING,
            platformFee,
            tailorAmount,
            stripePaymentIntentId: `pi_stripe_${Date.now()}`,
            createdAt: new Date(),
            metadata: {
              orderTotal: subtotal,
              stripeFee,
              garmentType: orderData.garmentType
            }
          };
          set(state => ({
            paymentIntents: [...state.paymentIntents, paymentIntent],
            loading: false
          }));
          return paymentIntent;
        } catch {
          set({ error: 'Failed to create payment intent', loading: false });
          throw new Error('Failed to create payment intent');
        }
      },      confirmPayment: async (paymentIntentId) => {
        set({ loading: true, error: null });
        
        try {
          // Simulate payment processing
          await new Promise(resolve => setTimeout(resolve, 2000));

          set(state => {
            const updatedPaymentIntents = state.paymentIntents.map(pi =>
              pi.id === paymentIntentId
                ? { ...pi, status: PaymentStatus.SUCCEEDED, confirmedAt: new Date() }
                : pi
            );

            const paymentIntent = updatedPaymentIntents.find(pi => pi.id === paymentIntentId);
            
            // Create escrow account
            const escrowAccount: EscrowAccount = {
              id: `escrow_${Date.now()}`,
              orderId: paymentIntent!.orderId,
              paymentIntentId,
              amount: paymentIntent!.amount,
              currency: paymentIntent!.currency,
              status: EscrowStatus.HELD,
              holdUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
              platformFee: paymentIntent!.platformFee,
              tailorAmount: paymentIntent!.tailorAmount
            };

            // Create transaction record
            const transaction: Transaction = {
              id: `txn_${Date.now()}`,
              paymentIntentId,
              orderId: paymentIntent!.orderId,
              type: TransactionType.PAYMENT,
              amount: paymentIntent!.amount,
              currency: paymentIntent!.currency,
              status: PaymentStatus.SUCCEEDED,
              description: `Payment for order ${paymentIntent!.orderId.slice(-8).toUpperCase()}`,
              createdAt: new Date(),
              processedAt: new Date()
            };

            return {
              paymentIntents: updatedPaymentIntents,
              escrowAccounts: [...state.escrowAccounts, escrowAccount],
              transactions: [...state.transactions, transaction],
              loading: false
            };
          });

          return true;
        } catch {
          set({ error: 'Payment confirmation failed', loading: false });
          return false;
        }
      },

      savePaymentMethod: (paymentMethod) => {
        const newPaymentMethod: PaymentMethod = {
          id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          customerId: paymentMethod.customerId!,
          type: paymentMethod.type || 'card',
          brand: paymentMethod.brand,
          last4: paymentMethod.last4,
          expiryMonth: paymentMethod.expiryMonth,
          expiryYear: paymentMethod.expiryYear,
          isDefault: paymentMethod.isDefault || false,
          stripePaymentMethodId: `pm_stripe_${Date.now()}`,
          createdAt: new Date()
        };

        set(state => ({
          paymentMethods: [...state.paymentMethods, newPaymentMethod]
        }));
      },

      getCustomerPaymentHistory: (customerId) => {
        return get().paymentIntents.filter(pi => pi.customerId === customerId);
      },

      getCustomerInvoices: (customerId) => {
        return get().invoices.filter(invoice => invoice.customerId === customerId);
      },

      // Escrow Management
      createEscrowAccount: (paymentIntentId) => {
        const paymentIntent = get().paymentIntents.find(pi => pi.id === paymentIntentId);
        if (!paymentIntent) return;

        const escrowAccount: EscrowAccount = {
          id: `escrow_${Date.now()}`,
          orderId: paymentIntent.orderId,
          paymentIntentId,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: EscrowStatus.HELD,
          holdUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          platformFee: paymentIntent.platformFee,
          tailorAmount: paymentIntent.tailorAmount
        };

        set(state => ({
          escrowAccounts: [...state.escrowAccounts, escrowAccount]
        }));
      },

      releaseEscrow: (escrowId) => {
        set(state => {
          const escrowAccount = state.escrowAccounts.find(acc => acc.id === escrowId);
          if (!escrowAccount) return state;

          const updatedEscrowAccounts = state.escrowAccounts.map(acc =>
            acc.id === escrowId
              ? { 
                  ...acc, 
                  status: EscrowStatus.RELEASED, 
                  releasedAt: new Date(),
                  releasedAmount: acc.tailorAmount
                }
              : acc
          );          // Find the associated payment intent to get the tailorId
          const paymentIntent = get().paymentIntents.find(pi => pi.id === escrowAccount.paymentIntentId);
          
          // Create payout for tailor
          const payout: TailorPayout = {
            id: `payout_${Date.now()}`,
            tailorId: paymentIntent ? paymentIntent.tailorId : escrowAccount.paymentIntentId.split('_')[0], // Get tailorId from payment intent
            amount: escrowAccount.tailorAmount,
            currency: escrowAccount.currency,
            status: PayoutStatus.SCHEDULED,
            escrowAccountIds: [escrowId],
            scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            processedAt: undefined
          };

          return {
            escrowAccounts: updatedEscrowAccounts,
            tailorPayouts: [...state.tailorPayouts, payout]
          };
        });
      },      disputeEscrow: (escrowId) => {
        set(state => ({
          escrowAccounts: state.escrowAccounts.map(acc =>
            acc.id === escrowId
              ? { ...acc, status: EscrowStatus.DISPUTED }
              : acc
          )
        }));
      },      refundEscrow: (escrowId) => {
        set(state => ({
          escrowAccounts: state.escrowAccounts.map(acc =>
            acc.id === escrowId
              ? { ...acc, status: EscrowStatus.REFUNDED, releasedAt: new Date() }
              : acc
          )
        }));
      },

      // Tailor Payout Actions
      getTailorEarnings: (tailorId) => {
        const payouts = get().tailorPayouts.filter(p => p.tailorId === tailorId);
        const total = payouts
          .filter(p => p.status === PayoutStatus.COMPLETED)
          .reduce((sum, p) => sum + p.amount, 0);
        
        const pending = payouts
          .filter(p => p.status === PayoutStatus.SCHEDULED || p.status === PayoutStatus.PROCESSING)
          .reduce((sum, p) => sum + p.amount, 0);

        const escrowAccounts = get().escrowAccounts.filter(acc => 
          acc.status === EscrowStatus.RELEASED
        );
        const available = escrowAccounts.reduce((sum, acc) => sum + acc.tailorAmount, 0) - pending;

        return { total, available: Math.max(0, available), pending };
      },

      requestPayout: (tailorId, amount) => {
        const payout: TailorPayout = {
          id: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tailorId,
          amount,
          currency: 'usd',
          status: PayoutStatus.SCHEDULED,
          escrowAccountIds: [], // Would be populated with relevant escrow accounts
          scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          bankAccount: '•••• •••• •••• 1234'
        };

        set(state => ({
          tailorPayouts: [...state.tailorPayouts, payout]
        }));
      },

      getTailorPayouts: (tailorId) => {
        return get().tailorPayouts.filter(p => p.tailorId === tailorId);
      },

      processPayout: (payoutId) => {
        set(state => ({
          tailorPayouts: state.tailorPayouts.map(p =>
            p.id === payoutId
              ? { ...p, status: PayoutStatus.COMPLETED, processedAt: new Date() }
              : p
          )
        }));
      },

      // Transaction Management
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          paymentIntentId: transaction.paymentIntentId!,
          orderId: transaction.orderId!,
          type: transaction.type!,
          amount: transaction.amount!,
          currency: transaction.currency || 'usd',
          status: transaction.status || PaymentStatus.SUCCEEDED,
          description: transaction.description!,
          createdAt: new Date(),
          processedAt: new Date()
        };

        set(state => ({
          transactions: [...state.transactions, newTransaction]
        }));
      },

      getTransactionHistory: (userId, userType) => {
        const transactions = get().transactions;
        const paymentIntents = get().paymentIntents;
        
        return transactions.filter(txn => {
          const pi = paymentIntents.find(p => p.id === txn.paymentIntentId);
          if (!pi) return false;
          
          return userType === 'customer' ? pi.customerId === userId : pi.tailorId === userId;
        });
      },

      // Utility Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'payment-store',
      partialize: (state) => ({
        paymentIntents: state.paymentIntents,
        paymentMethods: state.paymentMethods,
        transactions: state.transactions,
        escrowAccounts: state.escrowAccounts,
        tailorPayouts: state.tailorPayouts,
        invoices: state.invoices
      })
    }
  )
);