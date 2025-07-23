// components/tailor/PayoutDashboard.tsx - Tailor Earnings and Payout Management
import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  Eye,
  Clock
} from 'lucide-react';
import { PayoutStatus } from '../../types/payment';
import type { TailorPayout, Transaction } from '../../types/payment';

interface PayoutDashboardProps {
  totalEarnings: number;
  availableForPayout: number;
  pendingPayouts: TailorPayout[];
  completedPayouts: TailorPayout[];
  recentTransactions: Transaction[];
  onRequestPayout: (amount: number) => void;
  onViewPayoutDetails: (payoutId: string) => void;
}

export const PayoutDashboard: React.FC<PayoutDashboardProps> = ({
  totalEarnings,
  availableForPayout,
  pendingPayouts,
  completedPayouts,
  onRequestPayout,
  onViewPayoutDetails
}) => {
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const getPayoutStatusColor = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.SCHEDULED: return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case PayoutStatus.PROCESSING: return 'text-blue-700 bg-blue-100 border-blue-200';
      case PayoutStatus.COMPLETED: return 'text-green-700 bg-green-100 border-green-200';
      case PayoutStatus.FAILED: return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const monthlyEarnings = {
    thisMonth: 2450.00,
    lastMonth: 1890.00,
    growth: 29.6
  };

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount);
    if (amount > 0 && amount <= availableForPayout) {
      onRequestPayout(amount);
      setPayoutAmount('');
      setShowPayoutModal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalEarnings)}
              </p>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(monthlyEarnings.thisMonth)}
              </p>
              <p className="text-sm text-gray-600">This Month</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  +{monthlyEarnings.growth}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(availableForPayout)}
              </p>
              <p className="text-sm text-gray-600">Available for Payout</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {pendingPayouts.length}
              </p>
              <p className="text-sm text-gray-600">Pending Payouts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payout Management</h2>
            <p className="text-gray-600 text-sm mt-1">
              Request payouts and manage your earnings
            </p>
          </div>
          
          {availableForPayout > 0 && (
            <button
              onClick={() => setShowPayoutModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Request Payout
            </button>
          )}
        </div>

        {availableForPayout === 0 && (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              No funds available for payout. Complete more orders to earn money.
            </p>
          </div>
        )}
      </div>

      {/* Recent Payouts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Payouts</h2>
        </div>

        <div className="divide-y">
          {[...pendingPayouts, ...completedPayouts.slice(0, 5)].map((payout) => (
            <div key={payout.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">
                      Payout #{payout.id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPayoutStatusColor(payout.status)}`}>
                      {payout.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(payout.amount, payout.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Date</p>
                      <p className="font-medium text-gray-900">
                        {payout.scheduledDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bank Account</p>
                      <p className="font-medium text-gray-900">
                        {payout.bankAccount || '•••• •••• •••• 1234'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => onViewPayoutDetails(payout.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Details
                </button>
              </div>
            </div>
          ))}

          {pendingPayouts.length === 0 && completedPayouts.length === 0 && (
            <div className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No payouts yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Request Payout
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Available for payout: {formatCurrency(availableForPayout)}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    Payouts are processed within 1-3 business days. Minimum payout amount is $50.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="0.00"
                    min="50"
                    max={availableForPayout}
                    step="0.01"
                    className="pl-8 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setPayoutAmount((availableForPayout * 0.5).toFixed(2))}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => setPayoutAmount(availableForPayout.toFixed(2))}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    All
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPayoutModal(false);
                    setPayoutAmount('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestPayout}
                  disabled={!payoutAmount || parseFloat(payoutAmount) < 50 || parseFloat(payoutAmount) > availableForPayout}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Request Payout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};