// components/tailor/CustomerRelationshipManagement.tsx - Main CRM Interface
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  // Filter, // Unused
  Star, 
  MessageCircle, 
  Phone,
  Mail,
  // Calendar, // Unused
  // DollarSign, // Unused
  TrendingUp,
  // Heart, // Unused
  // Award, // Unused
  AlertTriangle,
  Eye,
  Edit3,
  Plus,
  Tag,
  Clock,
  MapPin,
  Activity
} from 'lucide-react';
import type { CustomerProfile, CommunicationRecord, CustomerSegment } from '../../types/tailorCRM';

interface CustomerRelationshipManagementProps {
  customers: CustomerProfile[];
  communications: CommunicationRecord[];
  segments: CustomerSegment[];
  onViewCustomer: (customerId: string) => void;
  onEditCustomer: (customerId: string) => void;
  onAddNote: (customerId: string, note: string) => void;
  onScheduleFollowUp: (customerId: string, date: Date, note: string) => void;
  onCreateSegment: (segment: Partial<CustomerSegment>) => void;
}

export const CustomerRelationshipManagement: React.FC<CustomerRelationshipManagementProps> = ({
  customers,
  communications,
  segments,
  onViewCustomer,
  onEditCustomer,
  onAddNote: _onAddNote,
  onScheduleFollowUp: _onScheduleFollowUp,
  onCreateSegment: _onCreateSegment
}) => {
  const [selectedTab, setSelectedTab] = useState<'customers' | 'segments' | 'communications' | 'analytics'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'bronze' | 'silver' | 'gold' | 'platinum'>('all');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'orders' | 'lastOrder'>('value');
  // Commented out unused state for now - will be used in future implementation
  // const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'gold': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'silver': return 'text-gray-700 bg-gray-100 border-gray-200';
      case 'bronze': return 'text-orange-700 bg-orange-100 border-orange-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-700 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = filterTier === 'all' || customer.businessMetrics.loyaltyTier === filterTier;
      const matchesRisk = filterRisk === 'all' || customer.businessMetrics.churnRisk === filterRisk;
      return matchesSearch && matchesTier && matchesRisk;
    })
    .sort((a, b) => {      switch (sortBy) {
        case 'name': return a.personalInfo.name.localeCompare(b.personalInfo.name);
        case 'value': return b.businessMetrics.lifetimeValue - a.businessMetrics.lifetimeValue;
        case 'orders': return b.businessMetrics.totalOrders - a.businessMetrics.totalOrders;
        case 'lastOrder': {
          const aDate = a.businessMetrics.lastOrderDate ? new Date(a.businessMetrics.lastOrderDate).getTime() : 0;
          const bDate = b.businessMetrics.lastOrderDate ? new Date(b.businessMetrics.lastOrderDate).getTime() : 0;
          return bDate - aDate;
        }
        default: return 0;
      }
    });

  const customerStats = {
    total: customers.length,
    highValue: customers.filter(c => c.businessMetrics.lifetimeValue > 2000).length,
    atRisk: customers.filter(c => c.businessMetrics.churnRisk === 'high').length,
    active: customers.filter(c => {
      const daysSinceLastOrder = c.businessMetrics.lastOrderDate 
        ? (Date.now() - new Date(c.businessMetrics.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)
        : Infinity;
      return daysSinceLastOrder < 90;
    }).length
  };

  const totalCustomerValue = customers.reduce((sum, c) => sum + c.businessMetrics.lifetimeValue, 0);
  const averageCustomerValue = totalCustomerValue / customers.length || 0;

  const tabs = [
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'segments', label: 'Segments', icon: Tag },
    { id: 'communications', label: 'Communications', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Relationship Management</h1>
          <p className="text-gray-600 mt-2">Build stronger relationships and grow your business</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4" />
            Import Customers
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Customer Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{customerStats.total}</p>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{customerStats.highValue}</p>
              <p className="text-sm text-gray-600">High-Value Customers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{customerStats.active}</p>
              <p className="text-sm text-gray-600">Active Customers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{customerStats.atRisk}</p>
              <p className="text-sm text-gray-600">At Risk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Customers Tab */}
          {selectedTab === 'customers' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value as typeof filterTier)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Tiers</option>
                    <option value="platinum">Platinum</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="bronze">Bronze</option>
                  </select>
                  
                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value as typeof filterRisk)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="value">Sort by Lifetime Value</option>
                  <option value="name">Sort by Name</option>
                  <option value="orders">Sort by Orders</option>
                  <option value="lastOrder">Sort by Last Order</option>
                </select>
              </div>

              {/* Customer List */}
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-grow">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {customer.personalInfo.avatar ? (
                            <img 
                              src={customer.personalInfo.avatar}
                              alt={customer.personalInfo.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <Users className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {customer.personalInfo.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTierColor(customer.businessMetrics.loyaltyTier)}`}>
                              {customer.businessMetrics.loyaltyTier}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(customer.businessMetrics.churnRisk)}`}>
                              {customer.businessMetrics.churnRisk} risk
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{customer.personalInfo.email}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Lifetime Value</p>
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(customer.businessMetrics.lifetimeValue)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Total Orders</p>
                              <p className="font-semibold text-gray-900">
                                {customer.businessMetrics.totalOrders}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Avg. Order Value</p>
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(customer.businessMetrics.averageOrderValue)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Last Order</p>
                              <p className="font-semibold text-gray-900">
                                {customer.businessMetrics.lastOrderDate ? new Date(customer.businessMetrics.lastOrderDate).toLocaleDateString() : 'Never'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              {customer.feedback.averageRating.toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {customer.communication.totalMessages} messages
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {customer.personalInfo.location.city}, {customer.personalInfo.location.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {customer.communication.responseRate.toFixed(0)}% response rate
                            </span>
                          </div>

                          {/* Customer Tags */}
                          {customer.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {customer.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                              {customer.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{customer.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => onViewCustomer(customer.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => onEditCustomer(customer.id)}
                          className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          <MessageCircle className="w-4 h-4" />
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredCustomers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                    <p className="text-gray-600">
                      {searchTerm || filterTier !== 'all' || filterRisk !== 'all'
                        ? 'No customers match your current filters.'
                        : 'Start building relationships by adding your first customer.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Segments Tab */}
          {selectedTab === 'segments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Create Segment
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {segments.map((segment) => (
                  <div key={segment.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{segment.name}</h4>
                        <p className="text-sm text-gray-600">{segment.description}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Customers</span>
                        <span className="text-sm font-medium text-gray-900">
                          {segment.customerCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Value</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(segment.totalValue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Value</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(segment.totalValue / segment.customerCount)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <button className="flex-1 text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        View Customers
                      </button>
                      <button className="flex-1 text-sm border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        Send Campaign
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {segments.length === 0 && (
                <div className="text-center py-12">
                  <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No segments created</h3>
                  <p className="text-gray-600 mb-6">
                    Create customer segments to target specific groups with personalized campaigns.
                  </p>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Create Your First Segment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Communications Tab */}
          {selectedTab === 'communications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Communications</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Log Communication
                </button>
              </div>

              <div className="space-y-4">
                {communications.slice(0, 10).map((comm) => (
                  <div key={comm.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-grow">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          comm.type === 'email' ? 'bg-blue-100' :
                          comm.type === 'phone' ? 'bg-green-100' :
                          comm.type === 'chat' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          {comm.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                          {comm.type === 'phone' && <Phone className="w-4 h-4 text-green-600" />}
                          {comm.type === 'chat' && <MessageCircle className="w-4 h-4 text-purple-600" />}
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{comm.subject || 'Communication'}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              comm.direction === 'inbound' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {comm.direction}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{comm.summary}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{new Date(comm.createdAt).toLocaleDateString()}</span>
                            {comm.duration && <span>{comm.duration} min</span>}
                            {comm.followUpRequired && (
                              <span className="text-red-600 font-medium">Follow-up required</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {communications.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No communications logged</h3>
                    <p className="text-gray-600 mb-6">
                      Start tracking customer communications to build stronger relationships.
                    </p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Plus className="w-4 h-4" />
                      Log First Communication
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {selectedTab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Analytics</h3>
                
                {/* Customer Value Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Customer Value Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Customer Value</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(totalCustomerValue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Customer Value</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(averageCustomerValue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">High-Value Customers</span>
                        <span className="font-semibold text-gray-900">
                          {customerStats.highValue} ({((customerStats.highValue / customerStats.total) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Loyalty Tier Distribution</h4>
                    <div className="space-y-3">
                      {['platinum', 'gold', 'silver', 'bronze'].map((tier) => {
                        const count = customers.filter(c => c.businessMetrics.loyaltyTier === tier).length;
                        const percentage = (count / customers.length) * 100;
                        return (
                          <div key={tier} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                tier === 'platinum' ? 'bg-purple-500' :
                                tier === 'gold' ? 'bg-yellow-500' :
                                tier === 'silver' ? 'bg-gray-400' :
                                'bg-orange-500'
                              }`}></div>
                              <span className="text-sm text-gray-700 capitalize">{tier}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-900">{count}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Analytics Chart Placeholder */}
                <div className="bg-gray-50 rounded-lg p-8">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Customer analytics charts would be displayed here</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Customer acquisition, retention, and value trends over time
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};