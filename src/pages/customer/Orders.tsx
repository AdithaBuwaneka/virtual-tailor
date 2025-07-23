// pages/customer/Orders.tsx - Customer Orders Overview Page
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, AlertCircle, Search, Filter, Eye } from 'lucide-react';
// import { useOrderStore } from '../../store/orderStore';
// import { useAuthStore } from '../../store/authStore';
import { OrderStatus } from '../../types/order';
// import { initializeMockOrderData } from '../../data/mockOrderData';

// --- DUMMY DATA FOR DEMO PURPOSES ---
const dummyOrders = [
  {
    id: '1',
    garmentType: 'Suit',
    style: 'Classic',
    status: OrderStatus.PENDING_ACCEPTANCE,
    tailor: { businessName: 'Tailor A' },
    createdAt: new Date('2025-06-01'),
    expectedDelivery: new Date('2025-06-20'),
    totalPrice: 250,
  },
  {
    id: '2',
    garmentType: 'Dress',
    style: 'Evening',
    status: OrderStatus.IN_PROGRESS,
    tailor: { businessName: 'Tailor B' },
    createdAt: new Date('2025-06-03'),
    expectedDelivery: new Date('2025-06-18'),
    totalPrice: 180,
  },
  {
    id: '3',
    garmentType: 'Shirt',
    style: 'Formal',
    status: OrderStatus.COMPLETED,
    tailor: { businessName: 'Tailor C' },
    createdAt: new Date('2025-05-15'),
    expectedDelivery: new Date('2025-05-30'),
    totalPrice: 60,
  },
];

export const CustomerOrders: React.FC = () => {
  // Comment out store and mock data logic for demo
  // const { user } = useAuthStore();
  // const { getCustomerOrders, orders } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // useEffect(() => {
  //   // Initialize mock data if no orders exist
  //   if (orders.length === 0) {
  //     initializeMockOrderData();
  //   }
  // }, [orders.length]);

  // const customerOrders = user ? getCustomerOrders(user.id) : [];
  const customerOrders = dummyOrders;

  const filteredOrders = customerOrders.filter(order => {
    const matchesSearch = order.garmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.tailor.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_ACCEPTANCE: return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case OrderStatus.ACCEPTED: return 'text-green-700 bg-green-100 border-green-200';
      case OrderStatus.IN_PROGRESS: return 'text-blue-700 bg-blue-100 border-blue-200';
      case OrderStatus.COMPLETED: return 'text-purple-700 bg-purple-100 border-purple-200';
      case OrderStatus.SHIPPED: return 'text-indigo-700 bg-indigo-100 border-indigo-200';
      case OrderStatus.DELIVERED: return 'text-green-800 bg-green-200 border-green-300';
      case OrderStatus.CANCELLED: return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_ACCEPTANCE: return <Clock className="w-4 h-4" />;
      case OrderStatus.IN_PROGRESS: return <Package className="w-4 h-4" />;
      case OrderStatus.COMPLETED:
      case OrderStatus.DELIVERED: return <CheckCircle className="w-4 h-4" />;
      case OrderStatus.CANCELLED: return <AlertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const orderStats = {
    total: customerOrders.length,
    pending: customerOrders.filter(o => o.status === OrderStatus.PENDING_ACCEPTANCE).length,
    active: customerOrders.filter(o => 
      [OrderStatus.ACCEPTED, OrderStatus.IN_PROGRESS, OrderStatus.MATERIALS_SOURCING].includes(o.status)
    ).length,
    completed: customerOrders.filter(o => 
      [OrderStatus.COMPLETED, OrderStatus.DELIVERED].includes(o.status)
    ).length
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your custom garment orders</p>
        </div>
        <Link
          to="/customer/tailor-browse"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Order
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{orderStats.pending}</p>
              <p className="text-sm text-gray-600">Pending Acceptance</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{orderStats.active}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{orderStats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by garment type or tailor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value={OrderStatus.PENDING_ACCEPTANCE}>Pending</option>
              <option value={OrderStatus.ACCEPTED}>Accepted</option>
              <option value={OrderStatus.IN_PROGRESS}>In Progress</option>
              <option value={OrderStatus.COMPLETED}>Completed</option>
              <option value={OrderStatus.DELIVERED}>Delivered</option>
              <option value={OrderStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.garmentType} - {order.style}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Tailor</p>
                      <p className="font-medium text-gray-900">{order.tailor.businessName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium text-gray-900">
                        {order.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Delivery</p>
                      <p className="font-medium text-gray-900">
                        {order.expectedDelivery.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">Order Total: </span>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                    
                    <Link
                      to={`/customer/orders/${order.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'No orders match your current filters.' 
                : "You haven't placed any orders yet."
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/customer/tailor-browse"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Package className="w-4 h-4" />
                Browse Tailors
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};