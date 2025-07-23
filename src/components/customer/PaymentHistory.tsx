// components/customer/PaymentHistory.tsx - Customer Payment Dashboard
import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { usePaymentStore } from '../../store/paymentStore';
import { useAuthStore } from '../../store/authStore';
import { PaymentStatus } from '../../types/payment';

// Define the expected structure for payment metadata
interface PaymentMetadata {
  orderTotal?: number;
  stripeFee?: number;
  garmentType?: string;
  extra?: Record<string, unknown>;
}

export const CustomerPaymentHistory: React.FC = () => {
  const { user } = useAuthStore();
  const { getCustomerPaymentHistory } = usePaymentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('all');

  const paymentHistory = user ? getCustomerPaymentHistory(user.id) : [];

  const filteredPayments = paymentHistory.filter(payment => {
    const matchesSearch = payment.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    let matchesPeriod = true;
    if (selectedPeriod !== 'all') {
      const now = new Date();
      const paymentDate = payment.createdAt;
      const diffTime = now.getTime() - paymentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      switch (selectedPeriod) {
        case 'week': matchesPeriod = diffDays <= 7; break;
        case 'month': matchesPeriod = diffDays <= 30; break;
        case 'year': matchesPeriod = diffDays <= 365; break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING: return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case PaymentStatus.PROCESSING: return 'text-blue-700 bg-blue-100 border-blue-200';
      case PaymentStatus.SUCCEEDED: return 'text-green-700 bg-green-100 border-green-200';
      case PaymentStatus.FAILED: return 'text-red-700 bg-red-100 border-red-200';
      case PaymentStatus.REFUNDED: return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING: return <Clock className="w-4 h-4" />;
      case PaymentStatus.PROCESSING: return <Clock className="w-4 h-4" />;
      case PaymentStatus.SUCCEEDED: return <CheckCircle className="w-4 h-4" />;
      case PaymentStatus.FAILED: return <AlertCircle className="w-4 h-4" />;
      case PaymentStatus.REFUNDED: return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">View and manage your payment records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(thisMonthSpent)}
              </p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {paymentHistory.length}
              </p>
              <p className="text-sm text-gray-600">Total Payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value={PaymentStatus.SUCCEEDED}>Succeeded</option>
              <option value={PaymentStatus.PENDING}>Pending</option>
              <option value={PaymentStatus.PROCESSING}>Processing</option>
              <option value={PaymentStatus.FAILED}>Failed</option>
              <option value={PaymentStatus.REFUNDED}>Refunded</option>
            </select>
          </div>
            <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year' | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Payment History List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
        </div>

        <div className="divide-y">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <div key={payment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">
                        Payment #{payment.id.slice(-12).toUpperCase()}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(payment.status)}
                          {payment.status.toUpperCase()}
                        </div>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                      <div>
                        <p className="text-sm text-gray-600">Order</p>
                        <p className="font-medium text-gray-900">
                          #{payment.orderId.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium text-gray-900">
                          {payment.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Method</p>
                        <p className="font-medium text-gray-900">
                          •••• •••• •••• 4242
                        </p>
                      </div>
                    </div>                    {payment.metadata && (
                      <div className="text-sm text-gray-600">
                        {(payment.metadata as PaymentMetadata).garmentType || 'Garment'} - {formatCurrency(Number((payment.metadata as PaymentMetadata).orderTotal || 0))} + fees
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || selectedPeriod !== 'all'
                  ? 'No payments match your filters'
                  : 'No payments yet'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};