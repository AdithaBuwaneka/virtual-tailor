// src/pages/tailor/Dashboard.tsx
import React, { useState, useEffect } from 'react'
import { BusinessAnalyticsDashboard } from '@/components/tailor/BusinessAnalyticsDashboard'
import { CustomerRelationshipManagement } from '@/components/tailor/CustomerRelationshipManagement'
import { OrderQueue } from '@/components/tailor/OrderQueue'
import { useTailorBusinessStore } from '@/store/tailorBusinessStore'
import { useOrderStore } from '@/store/orderStore'
import { useAuthStore } from '@/store/authStore'
import { initializeMockTailorBusinessData } from '@/data/mockTailorBusinessData'

const TailorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  
  const { 
    businessMetrics, 
    customerProfiles,
    marketInsights,
    customerSegments,
    communicationRecords = []
  } = useTailorBusinessStore()

  const {
    getTailorOrders,
    acceptOrder,
    rejectOrder
  } = useOrderStore()
  
  const { user } = useAuthStore()

  useEffect(() => {
    // Initialize mock data if not already loaded
    if (!businessMetrics) {
      initializeMockTailorBusinessData()
    }
  }, [businessMetrics])

  if (!businessMetrics || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    )
  }
  
  // Get orders for the current tailor
  const tailorOrders = getTailorOrders(user.id)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Custom tab navigation */}
      <div className="w-full mb-8">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-4 font-medium ${activeTab === 'overview' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-2 px-4 font-medium ${activeTab === 'analytics' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Business Analytics
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 px-4 font-medium ${activeTab === 'orders' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-2 px-4 font-medium ${activeTab === 'customers' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Customers
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">Tailor Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your business and create beautiful custom garments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="measurement-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">New Orders</h3>
              <div className="text-3xl font-bold text-primary-600 mb-2">3</div>
              <p className="text-gray-600 text-sm">Pending acceptance</p>
            </div>

            <div className="measurement-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">In Progress</h3>
              <div className="text-3xl font-bold text-tailor-600 mb-2">7</div>
              <p className="text-gray-600 text-sm">Active projects</p>
            </div>

            <div className="measurement-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">24</div>
              <p className="text-gray-600 text-sm">This month</p>
            </div>

            <div className="measurement-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Earnings</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">$2,400</div>
              <p className="text-gray-600 text-sm">This month</p>
            </div>
          </div>

          <div className="measurement-card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent AI Measurement Predictions</h2>
            <p className="text-gray-600 mb-4">Review and verify AI-generated measurements for your customers</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Customer #1234 - Traditional Shirt</h4>
                  <p className="text-sm text-gray-600">AI Confidence: 94% • Ready for verification</p>
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Customer #1235 - Formal Suit</h4>
                  <p className="text-sm text-gray-600">AI Confidence: 97% • Ready for verification</p>
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div>
          {businessMetrics && (
            <BusinessAnalyticsDashboard
              metrics={businessMetrics}
              customerInsights={customerProfiles.map(customer => ({
                id: customer.id,
                name: customer.personalInfo.name,
                email: customer.personalInfo.email,
                avatar: customer.personalInfo.avatar,
                totalOrders: customer.businessMetrics.totalOrders,
                totalSpent: customer.businessMetrics.totalSpent,
                lastOrderDate: customer.businessMetrics.lastOrderDate || new Date(),
                averageRating: 4.5, // Default value since satisfaction isn't directly available
                preferences: {
                  garmentTypes: customer.preferences?.garmentTypes || [],
                  styles: customer.preferences?.preferredStyles || [],
                  priceRange: { min: 0, max: customer.businessMetrics.averageOrderValue * 2 },
                  timeline: 30
                },
                lifetimeValue: customer.businessMetrics.lifetimeValue,
                riskLevel: customer.businessMetrics.churnRisk,
                notes: []  // Empty array as placeholder
              }))}
              marketInsights={marketInsights}
            />
          )}
        </div>
      )}
      
      {activeTab === 'orders' && (
        <OrderQueue
          orders={tailorOrders}
          onAcceptOrder={(orderId) => acceptOrder(orderId)}
          onRejectOrder={(orderId, reason) => rejectOrder(orderId, reason)}
          onViewDetails={(orderId) => {
            // Would typically navigate to a detail page
            console.log(`View order details for ${orderId}`)
          }}
          onContactCustomer={(customerId) => {
            // Would typically open a chat/messaging interface
            console.log(`Contact customer ${customerId}`)
          }}
        />
      )}
      
      {activeTab === 'customers' && (
        <CustomerRelationshipManagement
          customers={customerProfiles}
          communications={communicationRecords}
          segments={customerSegments}
          onViewCustomer={(customerId) => {
            // Would typically navigate to customer details
            console.log(`View customer details for ${customerId}`)
          }}
          onEditCustomer={(customerId) => {
            // Would typically open an edit form
            console.log(`Edit customer ${customerId}`)
          }}
          onAddNote={(customerId, note) => {
            // Would add a note to customer
            console.log(`Add note for ${customerId}: ${note}`)
          }}
          onScheduleFollowUp={(customerId, date, note) => {
            // Would schedule a follow-up
            console.log(`Schedule follow-up for ${customerId} on ${date}: ${note}`)
          }}
          onCreateSegment={(segment) => {
            // Would create a new customer segment
            console.log('Create segment:', segment)
          }}
        />
      )}
    </div>
  )
}

export default TailorDashboard