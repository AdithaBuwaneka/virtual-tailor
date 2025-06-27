// src/pages/admin/PaymentMonitoring.tsx
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { DollarSign, CreditCard, AlertCircle, FileText, Activity } from 'lucide-react';
import { usePaymentStore } from '@/store/paymentStore';
import { EscrowStatus } from '@/types/payment'; // Adjust the import based on your project structure

// Sample data for demonstration
const revenueData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18500 },
  { month: 'Apr', revenue: 22000 },
  { month: 'May', revenue: 24500 },
  { month: 'Jun', revenue: 28000 },
];

const paymentStatusData = [
  { name: 'Completed', value: 85, color: '#10b981' },
  { name: 'Processing', value: 10, color: '#3b82f6' },
  { name: 'Failed', value: 3, color: '#f43f5e' },
  { name: 'Refunded', value: 2, color: '#f59e0b' },
];

const COLORS = ['#10b981', '#3b82f6', '#f43f5e', '#f59e0b'];

export const AdminPaymentMonitoring: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const { escrowAccounts } = usePaymentStore();

  // Get the total amount in escrow
  const totalEscrow = escrowAccounts.reduce(
    (total, account) => total + account.amount, 
    0
  );

  // Get count of transactions in different states
  const pendingCount = escrowAccounts.filter(acc => acc.status === EscrowStatus.HELD).length;
  const releasedCount = escrowAccounts.filter(acc => acc.status === EscrowStatus.RELEASED).length;
  const disputedCount = escrowAccounts.filter(acc => acc.status === EscrowStatus.DISPUTED).length;
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Payment Monitoring</h1>
        <p className="text-gray-600 mt-2">Track payment processing, escrow statuses, and financial metrics</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">$264,500</div>
          <p className="text-sm text-green-600 flex items-center">
            <Activity className="h-4 w-4 mr-1" />
            +12.5% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Escrow Funds</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">${totalEscrow.toLocaleString()}</div>
          <p className="text-sm text-gray-600">{escrowAccounts.length} active escrow accounts</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Transaction Status</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{pendingCount}</div>
          <p className="text-sm text-gray-600">Pending transactions</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Refunds</h3>
            <div className="p-2 bg-red-100 rounded-lg">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
          <p className="text-sm text-gray-600">Open refund requests</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeRange('week')}
                className={`px-2 py-1 text-xs rounded-md ${timeRange === 'week' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeRange('month')}
                className={`px-2 py-1 text-xs rounded-md ${timeRange === 'month' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setTimeRange('year')}
                className={`px-2 py-1 text-xs rounded-md ${timeRange === 'year' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'}`}
              >
                Year
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => ['$' + value, 'Revenue']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Escrow Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Escrow Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h4 className="text-sm text-gray-600 mb-1">Pending Escrow</h4>
            <div className="text-xl font-bold text-blue-600">{pendingCount}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h4 className="text-sm text-gray-600 mb-1">Released Escrow</h4>
            <div className="text-xl font-bold text-green-600">{releasedCount}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <h4 className="text-sm text-gray-600 mb-1">Disputed Escrow</h4>
            <div className="text-xl font-bold text-red-600">{disputedCount}</div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Jan', pending: 4, released: 10, disputed: 1 },
                { name: 'Feb', pending: 5, released: 12, disputed: 2 },
                { name: 'Mar', pending: 8, released: 15, disputed: 1 },
                { name: 'Apr', pending: 7, released: 18, disputed: 0 },
                { name: 'May', pending: 9, released: 20, disputed: 2 },
                { name: 'Jun', pending: 11, released: 22, disputed: 1 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" fill="#3b82f6" />
              <Bar dataKey="released" fill="#10b981" />
              <Bar dataKey="disputed" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentMonitoring;
