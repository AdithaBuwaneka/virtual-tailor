// components/tailor/BusinessAnalyticsDashboard.tsx - Main Analytics Dashboard
import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  Star,
  BarChart3,
  Activity,
  Target,
  Zap,
  Clock,
  Award
} from 'lucide-react';
import type { BusinessMetrics, RevenueData, CustomerInsight, MarketInsight } from '../../types/tailorBusiness';

interface BusinessAnalyticsDashboardProps {
  metrics: BusinessMetrics;
  customerInsights: CustomerInsight[];
  marketInsights: MarketInsight;
  // Optional props to address TypeScript strictness
  tailorId?: string;
  revenueData?: RevenueData[];
  onUpdateGoals?: (goals: Record<string, unknown>) => void;
}

export const BusinessAnalyticsDashboard: React.FC<BusinessAnalyticsDashboardProps> = ({
  metrics,
  customerInsights,
  marketInsights
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'revenue' | 'customers' | 'market'>('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getMetricTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: change,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      color: change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
    };
  };

  const revenueTrend = getMetricTrend(metrics.revenue.thisMonth, metrics.revenue.lastMonth);

  return (
    <div className="space-y-8">
      {/* Header with Period Selector */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600 mt-2">Track your performance and grow your tailoring business</p>
        </div>
          <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Metric */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.revenue.thisMonth)}
              </p>
              <div className={`flex items-center gap-1 mt-1 ${revenueTrend.color}`}>
                {revenueTrend.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : revenueTrend.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <Activity className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {formatPercentage(revenueTrend.value)}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-600">
              Forecast: {formatCurrency(metrics.revenue.forecast)}
            </p>
          </div>
        </div>

        {/* Orders Metric */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.orders.completionRate.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm text-gray-600">
                  {metrics.orders.completed} of {metrics.orders.total} orders
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-600">
              Avg. Value: {formatCurrency(metrics.orders.averageValue)}
            </p>
          </div>
        </div>

        {/* Customer Metric */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Retention</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.customers.retention.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm text-gray-600">
                  {metrics.customers.returning} returning customers
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-600">
              LTV: {formatCurrency(metrics.customers.lifetime)}
            </p>
          </div>
        </div>

        {/* Performance Metric */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quality Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.performance.qualityRating.toFixed(1)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= metrics.performance.qualityRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-600">
              Avg. Delivery: {metrics.performance.averageDeliveryTime} days
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'revenue', label: 'Revenue Analysis', icon: TrendingUp },
              { id: 'customers', label: 'Customer Insights', icon: Users },
              { id: 'market', label: 'Market Trends', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              return (                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as 'overview' | 'revenue' | 'customers' | 'market')}
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
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Performance Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-700">Capacity Utilization</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {metrics.performance.capacity.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-green-700">Efficiency Score</p>
                        <p className="text-2xl font-bold text-green-900">
                          {metrics.performance.efficiency.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-purple-700">Response Time</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {metrics.performance.responseTime.toFixed(1)}h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Award className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">Quality Milestone</h4>
                      <p className="text-sm text-green-700">
                        Achieved 4.8+ star rating for 3 consecutive months
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-900">Revenue Growth</h4>
                      <p className="text-sm text-blue-700">
                        {formatPercentage(revenueTrend.value)} increase in monthly revenue
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-purple-900">Customer Loyalty</h4>
                      <p className="text-sm text-purple-700">
                        {metrics.customers.retention.toFixed(0)}% customer retention rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Goals Progress */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Goals Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Monthly Revenue Target</span>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(metrics.revenue.thisMonth)} / {formatCurrency(5000)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((metrics.revenue.thisMonth / 5000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                      <span className="text-sm text-gray-600">
                        {metrics.performance.qualityRating.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(metrics.performance.qualityRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Order Completion Rate</span>
                      <span className="text-sm text-gray-600">
                        {metrics.orders.completionRate.toFixed(1)}% / 95%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((metrics.orders.completionRate / 95) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Analysis Tab */}
          {selectedTab === 'revenue' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                
                {/* Revenue Chart Placeholder */}
                <div className="bg-gray-50 rounded-lg p-8 mb-6">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Revenue trend chart would be displayed here
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Integration with Chart.js or Recharts for live data visualization
                      </p>
                    </div>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Revenue by Garment Type</h4>
                    <div className="space-y-3">
                      {[
                        { type: 'Suits', revenue: 2450, percentage: 45 },
                        { type: 'Dresses', revenue: 1680, percentage: 31 },
                        { type: 'Traditional Wear', revenue: 890, percentage: 16 },
                        { type: 'Alterations', revenue: 420, percentage: 8 }
                      ].map((item) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span className="text-sm text-gray-700">{item.type}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.revenue)}
                            </span>
                            <span className="text-xs text-gray-600 ml-2">
                              ({item.percentage}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Monthly Comparison</h4>
                    <div className="space-y-3">
                      {[
                        { month: 'This Month', revenue: metrics.revenue.thisMonth, change: revenueTrend.value },
                        { month: 'Last Month', revenue: metrics.revenue.lastMonth, change: 8.2 },
                        { month: '2 Months Ago', revenue: 2890, change: -3.4 },
                        { month: '3 Months Ago', revenue: 3150, change: 12.7 }
                      ].map((item) => (
                        <div key={item.month} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.month}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.revenue)}
                            </span>
                            <span className={`text-xs ml-2 ${
                              item.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatPercentage(item.change)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Insights Tab */}
          {selectedTab === 'customers' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
                <div className="space-y-4">
                  {customerInsights.slice(0, 5).map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{customer.name}</h4>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {customer.totalOrders} orders
                            </span>
                            <span className="text-xs text-gray-500">
                              LTV: {formatCurrency(customer.lifetimeValue)}
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= customer.averageRating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(customer.totalSpent)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Last order: {new Date(customer.lastOrderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Market Trends Tab */}
          {selectedTab === 'market' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trends & Recommendations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Trending Styles</h4>
                    <div className="space-y-3">
                      {marketInsights.trendingStyles.map((style, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{style.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-green-600">
                              +{style.growth}%
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${(style.demand / 100) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Competitive Position</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Price</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">
                            {formatCurrency(marketInsights.competitorAnalysis.averagePrice)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            marketInsights.competitorAnalysis.yourPosition === 'above' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {marketInsights.competitorAnalysis.yourPosition}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Quality Rating</span>
                        <span className="text-sm text-gray-900">
                          {marketInsights.competitorAnalysis.averageRating.toFixed(1)}/5.0
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Delivery Time</span>
                        <span className="text-sm text-gray-900">
                          {marketInsights.competitorAnalysis.averageDeliveryTime} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Business Recommendations</h4>
                  <div className="space-y-4">
                    {marketInsights.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-medium text-gray-900">{rec.title}</h5>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                rec.impact === 'high' ? 'bg-red-100 text-red-700' :
                                rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {rec.impact} impact
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                rec.effort === 'high' ? 'bg-red-100 text-red-700' :
                                rec.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {rec.effort} effort
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{rec.description}</p>
                          </div>
                          <button className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Apply
                          </button>
                        </div>
                      </div>
                    ))}
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