// components/customer/DashboardFinancialSection.tsx - Financial section for customer dashboard
import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, CreditCard, Receipt, ArrowRight, TrendingUp } from 'lucide-react';
import { usePaymentStore } from '../../store/paymentStore';
import { useAuthStore } from '../../store/authStore';
import { PaymentStatus } from '../../types/payment';

export const DashboardFinancialSection: React.FC = () => {
  const { user } = useAuthStore();
  const { getCustomerPaymentHistory } = usePaymentStore();

  const paymentHistory = user ? getCustomerPaymentHistory(user.id) : [];
  const recentPayments = paymentHistory
    .filter(p => p.status === PaymentStatus.SUCCEEDED)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  const totalSpent = paymentHistory
    .filter(p => p.status === PaymentStatus.SUCCEEDED)
    .reduce((sum, p) => sum + p.amount, 0);

  const thisMonthSpent = paymentHistory
    .filter(p => {
      const now = new Date();
      const paymentDate = p.createdAt;
      return p.status === PaymentStatus.SUCCEEDED &&
             paymentDate.getMonth() === now.getMonth() &&
             paymentDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Financial Summary</h2>
        <Link
          to="/customer/payments"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(thisMonthSpent)}
              </p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      {recentPayments.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Recent Payments</h3>
          {recentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{payment.orderId.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {payment.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(payment.amount)}
                </p>
                <p className="text-xs text-green-600">Completed</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">No payments yet</p>
        </div>
      )}
    </div>
  );
};