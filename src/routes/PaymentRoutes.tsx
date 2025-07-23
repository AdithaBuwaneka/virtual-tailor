// routes/PaymentRoutes.tsx - Complete Payment System Route Integration
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Customer Payment Components
import { OrderPayment } from '../pages/customer/OrderPayment';
import { CustomerPaymentHistory } from '../components/customer/PaymentHistory';

// Tailor Payment Components  
import { PayoutDashboard } from '../components/tailor/PayoutDashboard';
import { usePaymentStore } from '../store/paymentStore';
import type { Transaction } from '../types/payment';

// Admin Payment Components
import { AdminPaymentMonitoring } from '../pages/admin/PaymentMonitoring';
import { EscrowManagement } from '../components/payment/EscrowManagement';
import { PaymentSettings, type PaymentConfig } from '../components/payment/PaymentSettings';
import { RefundManagement } from '../components/payment/RefundManagement';

// Mock Data
import { initializeMockPaymentData } from '../data/mockPaymentData';

// Customer Payment Routes
export const CustomerPaymentRoutes: React.FC = () => {
  const { user } = useAuthStore();
  
  React.useEffect(() => {
    initializeMockPaymentData();
  }, []);

  if (!user || user.role !== 'customer') {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Routes>
      <Route path="/payments" element={<CustomerPaymentHistory />} />
      <Route path="/orders/:orderId/payment" element={<OrderPayment />} />
    </Routes>
  );
};

// Tailor Payment Routes
export const TailorPaymentRoutes: React.FC = () => {
  const { user } = useAuthStore();
  const { getTailorEarnings, getTailorPayouts, requestPayout } = usePaymentStore();
  
  React.useEffect(() => {
    initializeMockPaymentData();
  }, []);

  if (!user || user.role !== 'tailor') {
    return <Navigate to="/auth/login" replace />;
  }

  const earnings = getTailorEarnings(user.id);
  const pendingPayouts = getTailorPayouts(user.id).filter(p => p.status === 'scheduled' || p.status === 'processing');
  const completedPayouts = getTailorPayouts(user.id).filter(p => p.status === 'completed');
  
  const mockTransactions: Transaction[] = []; // Would be populated from actual transaction history

  const handleRequestPayout = (amount: number) => {
    requestPayout(user.id, amount);
  };

  const handleViewPayoutDetails = (payoutId: string) => {
    console.log('View payout details:', payoutId);
  };

  return (
    <Routes>
      <Route 
        path="/earnings" 
        element={
          <PayoutDashboard
            totalEarnings={earnings.total}
            availableForPayout={earnings.available}
            pendingPayouts={pendingPayouts}
            completedPayouts={completedPayouts}
            recentTransactions={mockTransactions}
            onRequestPayout={handleRequestPayout}
            onViewPayoutDetails={handleViewPayoutDetails}
          />
        } 
      />
    </Routes>
  );
};

// Admin Payment Routes
export const AdminPaymentRoutes: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    escrowAccounts, 
    releaseEscrow, 
    disputeEscrow, 
    refundEscrow 
  } = usePaymentStore();
  
  React.useEffect(() => {
    initializeMockPaymentData();
  }, []);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth/login" replace />;
  }

  // Mock payment configuration
  const mockPaymentConfig = {
    platformFeeRate: 0.05,
    stripeFeeRate: 0.029,
    stripeFeeFixed: 0.30,
    escrowHoldDays: 30,
    payoutSchedule: 'weekly' as const,
    minimumPayoutAmount: 50,
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    fraudDetection: {
      enabled: true,
      maxFailedAttempts: 3,
      highValueThreshold: 1000,
      velocityChecks: true
    },
    refundPolicy: {
      allowRefunds: true,
      refundTimeLimit: 30,
      partialRefundsAllowed: true,
      autoRefundThreshold: 100
    }
  };

  // Mock refund requests
  const mockRefundRequests = [
    {
      id: 'refund_001',
      orderId: 'order_2024_001',
      customerId: 'customer_1',
      tailorId: 'tailor_1',
      amount: 650.00,
      requestedAmount: 650.00,
      reason: 'Order not as described. The measurements were incorrect and the garment does not fit properly.',
      status: 'pending' as const,
      type: 'full' as const,
      requestedAt: new Date('2024-06-09'),
      customerEmail: 'sarah.johnson@email.com',
      customerName: 'Sarah Johnson',
      evidence: ['measurement_comparison.jpg', 'fit_issues.jpg']
    }
  ];  const handleUpdateConfig = (config: PaymentConfig) => {
    console.log('Payment config updated:', config);
  };

  const handleApproveRefund = (refundId: string, amount: number, notes?: string) => {
    console.log('Approve refund:', { refundId, amount, notes });
  };

  const handleRejectRefund = (refundId: string, reason: string) => {
    console.log('Reject refund:', { refundId, reason });
  };

  const handleProcessRefund = (refundId: string) => {
    console.log('Process refund:', refundId);
  };

  return (
    <Routes>
      <Route path="/monitoring" element={<AdminPaymentMonitoring />} />
      <Route 
        path="/escrow" 
        element={
          <EscrowManagement
            escrowAccounts={escrowAccounts}
            onReleaseEscrow={releaseEscrow}
            onDisputeEscrow={disputeEscrow}
            onRefundEscrow={refundEscrow}
          />
        } 
      />
      <Route 
        path="/settings" 
        element={
          <PaymentSettings
            config={mockPaymentConfig}
            onUpdateConfig={handleUpdateConfig}
          />
        } 
      />
      <Route 
        path="/refunds" 
        element={
          <RefundManagement
            refundRequests={mockRefundRequests}
            onApproveRefund={handleApproveRefund}
            onRejectRefund={handleRejectRefund}
            onProcessRefund={handleProcessRefund}
          />
        } 
      />
    </Routes>
  );
};