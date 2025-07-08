import { useState } from 'react';
import {
  Users, UserCheck, Search, MoreHorizontal,
  Edit, Star, 
  Clock, CheckCircle, AlertTriangle, Ban,
  Briefcase, 
  Download, Plus, ShoppingBag
} from 'lucide-react';
import type { UserCardProps, VerificationCardProps, AdminUser, AdminVerification } from '../../types/admin';

// Mock user data
const users = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'customer',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b9ff?w=150',
    joinDate: '2024-03-15',
    lastActive: '2 hours ago',
    orders: 5,
    totalSpent: 1250,
    rating: 4.8,
    location: 'New York, USA',
    phone: '+1-555-0123',
    verified: true
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    role: 'tailor',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    joinDate: '2024-01-20',
    lastActive: '1 day ago',
    orders: 28,
    totalEarned: 8750,
    rating: 4.9,
    location: 'Cairo, Egypt',
    phone: '+20-123-456789',
    verified: true,
    specialties: ['Traditional Egyptian', 'Formal Wear'],
    businessName: 'Hassan Traditional Tailoring'
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@email.com',
    role: 'customer',
    status: 'pending_verification',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    joinDate: '2024-06-08',
    lastActive: '5 minutes ago',
    orders: 0,
    totalSpent: 0,
    rating: undefined, // changed from null to undefined for AdminUser compatibility
    location: 'Barcelona, Spain',
    phone: '+34-612-345678',
    verified: false
  },
  {
    id: 4,
    name: 'Kenji Tanaka',
    email: 'kenji.tanaka@email.com',
    role: 'tailor',
    status: 'pending_approval',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    joinDate: '2024-06-05',
    lastActive: '3 hours ago',
    orders: 0,
    totalEarned: 0,
    rating: undefined, // changed from null to undefined for AdminUser compatibility
    location: 'Tokyo, Japan',
    phone: '+81-90-1234-5678',
    verified: false,
    specialties: ['Japanese Traditional', 'Kimono'],
    businessName: 'Tanaka Artisan Atelier'
  },
  {
    id: 5,
    name: 'Emma Thompson',
    email: 'emma.thompson@email.com',
    role: 'customer',
    status: 'suspended',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    joinDate: '2024-02-10',
    lastActive: '1 week ago',
    orders: 3,
    totalSpent: 450,
    rating: 3.2,
    location: 'London, UK',
    phone: '+44-20-7123-4567',
    verified: true
  }
];

const pendingVerifications = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    role: 'tailor',
    submitDate: '2024-06-09',
    documents: ['Business License', 'Portfolio', 'ID Verification'],
    specialties: ['Indian Traditional', 'Sarees', 'Lehengas'],
    businessName: 'Sharma Heritage Tailoring',
    location: 'Mumbai, India'
  },
  {
    id: 2,
    name: 'Giovanni Rossi',
    email: 'giovanni.rossi@email.com',
    role: 'tailor',
    submitDate: '2024-06-07',
    documents: ['Portfolio', 'References', 'Certification'],
    specialties: ['Italian Suits', 'Formal Wear'],
    businessName: 'Rossi Sartoria',
    location: 'Milan, Italy'
  }
];

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onSuspend, onVerify }) => {
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
      case 'pending_approval': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string): React.ReactNode => {
    switch(role) {
      case 'tailor': return <Briefcase className="w-4 h-4" />;
      case 'customer': return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              {user.verified && <UserCheck className="w-4 h-4 text-green-500" />}
            </div>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              {getRoleIcon(user.role)}
              <span className="text-xs text-gray-500 capitalize">{user.role}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Join Date</p>
          <p className="text-sm font-medium">{user.joinDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Last Active</p>
          <p className="text-sm font-medium">{user.lastActive}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Location</p>
          <p className="text-sm font-medium">{user.location}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">
            {user.role === 'tailor' ? 'Total Earned' : 'Total Spent'}
          </p>
          <p className="text-sm font-medium">
            ${user.role === 'tailor' ? user.totalEarned : user.totalSpent}
          </p>
        </div>
      </div>

      {user.role === 'tailor' && user.specialties && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Specialties</p>
          <div className="flex flex-wrap gap-1">
            {user.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
        </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">
              {user.rating ? user.rating.toFixed(1) : 'No rating'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <ShoppingBag className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{user.orders} orders</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {user.status === 'pending_verification' && (
            <button
              onClick={() => onVerify(user)}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
            >
              Verify
            </button>
          )}
          {user.status === 'active' && (
            <button
              onClick={() => onSuspend(user)}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
            >
              Suspend
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const VerificationCard: React.FC<VerificationCardProps> = ({ verification, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{verification.name}</h3>
          <p className="text-sm text-gray-600">{verification.email}</p>
          <p className="text-sm text-gray-500 mt-1">{verification.businessName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Submitted</p>
          <p className="text-sm font-medium">{verification.submitDate}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Location</p>
        <p className="text-sm font-medium">{verification.location}</p>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Specialties</p>
        <div className="flex flex-wrap gap-1">
          {verification.specialties.map((specialty: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Documents Submitted</p>
        <div className="space-y-1">
          {verification.documents.map((doc: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t border-gray-100">
        <button
          onClick={() => onApprove(verification)}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(verification)}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Reject
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Review
        </button>
      </div>
    </div>
  );
};

const AdminUserManagement = () => {
  const [activeTab, setActiveTab] = useState('all-users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  const handleEditUser = (user: AdminUser) => {
    console.log('Edit user:', user);
  };

  const handleSuspendUser = (user: AdminUser) => {
    console.log('Suspend user:', user);
  };

  const handleVerifyUser = (user: AdminUser) => {
    console.log('Verify user:', user);
  };

  const handleApproveVerification = (verification: AdminVerification) => {
    console.log('Approve verification:', verification);
  };

  const handleRejectVerification = (verification: AdminVerification) => {
    console.log('Reject verification:', verification);
  };

  const tabs = [
    { id: 'all-users', name: 'All Users', count: users.length },
    { id: 'pending-verification', name: 'Pending Verification', count: pendingVerifications.length },
    { id: 'suspended', name: 'Suspended', count: users.filter(u => u.status === 'suspended').length }
  ];

  const renderAllUsers = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="tailor">Tailors</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEditUser}
            onSuspend={handleSuspendUser}
            onVerify={handleVerifyUser}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );

  const renderPendingVerification = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          <p className="text-blue-800">
            <span className="font-medium">{pendingVerifications.length} applications</span> awaiting review
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pendingVerifications.map((verification) => (
          <VerificationCard
            key={verification.id}
            verification={verification}
            onApprove={handleApproveVerification}
            onReject={handleRejectVerification}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage customers, tailors, and verification processes</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tailors</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'tailor' && u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingVerifications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'suspended').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'all-users' && renderAllUsers()}
      {activeTab === 'pending-verification' && renderPendingVerification()}
      {activeTab === 'suspended' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Ban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Suspended Users</h3>
          <p className="text-gray-600">View and manage suspended user accounts</p>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;