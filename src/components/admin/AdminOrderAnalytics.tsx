import { useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  ShoppingBag, DollarSign, Clock, TrendingUp, TrendingDown,
  MapPin, Download,
  CheckCircle, Star
} from 'lucide-react';
import type { MetricCardProps, TailorRankingCardProps, RecentOrderCardProps } from '@/types/admin';

// Mock order analytics data
const orderMetrics = {
  totalOrders: 2610,
  completedOrders: 2156,
  activeOrders: 342,
  cancelledOrders: 112,
  totalRevenue: 587250,
  averageOrderValue: 225,
  completionRate: 82.6,
  averageDeliveryTime: 18.5,
  customerSatisfaction: 4.7,
  repeatCustomerRate: 67.3
};

const monthlyOrderData = [
  { month: 'Jan', orders: 198, revenue: 44650, completed: 164, cancelled: 12, avgDelivery: 19.2 },
  { month: 'Feb', orders: 224, revenue: 50400, completed: 189, cancelled: 15, avgDelivery: 18.8 },
  { month: 'Mar', orders: 267, revenue: 60075, completed: 221, cancelled: 18, avgDelivery: 17.9 },
  { month: 'Apr', orders: 298, revenue: 67050, completed: 248, cancelled: 22, avgDelivery: 18.1 },
  { month: 'May', orders: 312, revenue: 70200, completed: 259, cancelled: 19, avgDelivery: 17.5 },
  { month: 'Jun', orders: 289, revenue: 65025, completed: 241, cancelled: 16, avgDelivery: 18.3 }
];

const orderStatusDistribution = [
  { name: 'Completed', value: 2156, percentage: 82.6, color: '#10B981' },
  { name: 'In Progress', value: 342, percentage: 13.1, color: '#3B82F6' },
  { name: 'Cancelled', value: 112, percentage: 4.3, color: '#EF4444' }
];

const garmentTypeData = [
  { type: 'Formal Suits', orders: 456, revenue: 136800, avgPrice: 300, satisfaction: 4.8 },
  { type: 'Traditional Wear', orders: 387, revenue: 96750, avgPrice: 250, satisfaction: 4.9 },
  { type: 'Casual Wear', orders: 298, revenue: 59600, avgPrice: 200, satisfaction: 4.6 },
  { type: 'Evening Gowns', orders: 234, revenue: 93600, avgPrice: 400, satisfaction: 4.7 },
  { type: 'Shirts & Blouses', orders: 189, revenue: 28350, avgPrice: 150, satisfaction: 4.5 },
  { type: 'Alterations', orders: 156, revenue: 15600, avgPrice: 100, satisfaction: 4.4 }
];

const geographicData = [
  { region: 'North America', orders: 785, revenue: 196250, growth: 15.2 },
  { region: 'Europe', orders: 642, revenue: 160500, growth: 22.1 },
  { region: 'Asia', orders: 534, revenue: 133500, growth: 28.7 },
  { region: 'Middle East', orders: 289, revenue: 86700, growth: 19.4 },
  { region: 'South America', orders: 198, revenue: 49500, growth: 12.8 },
  { region: 'Africa', orders: 162, revenue: 40500, growth: 35.6 }
];

const deliveryPerformance = [
  { timeRange: '< 7 days', orders: 234, percentage: 9.0 },
  { timeRange: '7-14 days', orders: 567, percentage: 21.7 },
  { timeRange: '15-21 days', orders: 892, percentage: 34.2 },
  { timeRange: '22-30 days', orders: 645, percentage: 24.7 },
  { timeRange: '> 30 days', orders: 272, percentage: 10.4 }
];

const topTailors = [
  { 
    id: 1, 
    name: 'Ahmed Hassan', 
    orders: 47, 
    revenue: 14100, 
    rating: 4.9, 
    completionRate: 95.7,
    avgDelivery: 16.2,
    location: 'Cairo, Egypt'
  },
  { 
    id: 2, 
    name: 'Maria Gonzalez', 
    orders: 42, 
    revenue: 12600, 
    rating: 4.8, 
    completionRate: 92.9,
    avgDelivery: 17.8,
    location: 'Barcelona, Spain'
  },
  { 
    id: 3, 
    name: 'David Kim', 
    orders: 39, 
    revenue: 11700, 
    rating: 4.7, 
    completionRate: 89.7,
    avgDelivery: 19.1,
    location: 'Seoul, South Korea'
  },
  { 
    id: 4, 
    name: 'Priya Sharma', 
    orders: 36, 
    revenue: 10800, 
    rating: 4.9, 
    completionRate: 94.4,
    avgDelivery: 15.9,
    location: 'Mumbai, India'
  }
];

const recentOrders = [
  {
    id: 'ORD-2024-001234',
    customer: 'Sarah Johnson',
    tailor: 'Ahmed Hassan',
    garmentType: 'Evening Gown',
    value: 450,
    status: 'In Progress',
    orderDate: '2024-06-08',
    estimatedDelivery: '2024-06-22',
    location: 'New York, USA'
  },
  {
    id: 'ORD-2024-001235',
    customer: 'Michael Chen',
    tailor: 'Maria Gonzalez',
    garmentType: 'Formal Suit',
    value: 380,
    status: 'Quality Review',
    orderDate: '2024-06-05',
    estimatedDelivery: '2024-06-20',
    location: 'San Francisco, USA'
  },
  {
    id: 'ORD-2024-001236',
    customer: 'Emma Thompson',
    tailor: 'David Kim',
    garmentType: 'Traditional Hanbok',
    value: 320,
    status: 'Completed',
    orderDate: '2024-05-28',
    deliveredDate: '2024-06-09',
    location: 'London, UK'
  }
];

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, subtitle, trend }) => {
  const isPositive = trend === 'up' || (change && change > 0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-blue-100'}`}>
            <Icon className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

const TailorRankingCard: React.FC<TailorRankingCardProps> = ({ tailor, rank }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
        #{rank}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-gray-900">{tailor.name}</h4>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{tailor.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">{tailor.location}</p>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-xs text-gray-500">{tailor.orders} orders</span>
          <span className="text-xs text-gray-500">${tailor.revenue.toLocaleString()}</span>
          <span className="text-xs text-gray-500">{tailor.completionRate}% completion</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-green-600">${tailor.revenue.toLocaleString()}</p>
        <p className="text-xs text-gray-500">{tailor.avgDelivery} days avg</p>
      </div>
    </div>
  );
};

const RecentOrderCard: React.FC<RecentOrderCardProps> = ({ order }) => {
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Quality Review': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{order.id}</h4>
          <p className="text-sm text-gray-600">{order.customer} → {order.tailor}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">Garment</p>
          <p className="text-sm font-medium">{order.garmentType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Value</p>
          <p className="text-sm font-medium">${order.value}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Order Date</p>
          <p className="text-sm font-medium">{order.orderDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">
            {order.status === 'Completed' ? 'Delivered' : 'Est. Delivery'}
          </p>
          <p className="text-sm font-medium">
            {order.deliveredDate || order.estimatedDelivery}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <MapPin className="w-3 h-3" />
        <span>{order.location}</span>
      </div>
    </div>
  );
};

const AdminOrderAnalytics = () => {  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Orders"
          value={orderMetrics.totalOrders.toLocaleString()}
          change={18.5}
          icon={ShoppingBag}
          trend="up"
          subtitle="All time"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${(orderMetrics.totalRevenue / 1000).toFixed(0)}k`}
          change={24.3}
          icon={DollarSign}
          trend="up"
          subtitle="All time"
        />
        <MetricCard
          title="Completion Rate"
          value={`${orderMetrics.completionRate}%`}
          change={3.2}
          icon={CheckCircle}
          trend="up"
          subtitle="Success rate"
        />
        <MetricCard
          title="Avg Delivery"
          value={`${orderMetrics.averageDeliveryTime} days`}
          change={-2.1}
          icon={Clock}
          trend="up"
          subtitle="Delivery time"
        />
        <MetricCard
          title="Customer Rating"
          value={orderMetrics.customerSatisfaction.toFixed(1)}
          change={1.8}
          icon={Star}
          trend="up"
          subtitle="Average rating"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Order & Revenue Trends</h3>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+18.5% orders</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyOrderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="orders" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} name="Orders" />
              <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.1} name="Revenue ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {orderStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Orders']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Garment Type Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Garment Type</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={garmentTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" name="Orders" />
            <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Revenue ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Geographic Performance & Top Tailors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Performance</h3>
          <div className="space-y-4">
            {geographicData.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{region.region}</h4>
                  <p className="text-sm text-gray-600">{region.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${region.revenue.toLocaleString()}</p>
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{region.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Tailors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Tailors</h3>
          <div className="space-y-3">
            {topTailors.map((tailor, index) => (
              <TailorRankingCard key={tailor.id} tailor={tailor} rank={index + 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Performance Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Time Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deliveryPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeRange" />
            <YAxis />
            <Tooltip formatter={(value) => [value, 'Orders']} />
            <Bar dataKey="orders" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Orders
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentOrders.map((order) => (
            <RecentOrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderAnalytics;