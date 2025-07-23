// components/customer/OrderTracking.tsx - Order Tracking Timeline Component
import React from 'react';
import { CheckCircle, Clock, Truck, MapPin, Camera, MessageCircle } from 'lucide-react';
import type { OrderTracking, OrderMilestone } from '../../types/order';

interface OrderTrackingProps {
  tracking: OrderTracking;
  onRequestModification?: () => void;
  onContactTailor?: () => void;
}

export const OrderTrackingComponent: React.FC<OrderTrackingProps> = ({
  tracking,
  onRequestModification,
  onContactTailor
}) => {
  const getStatusIcon = (milestone: OrderMilestone) => {
    if (milestone.isCompleted) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
    if (milestone.isCurrent) {
      return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
    }
    return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
  };
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return 'TBD';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimelineColor = (milestone: OrderMilestone) => {
    if (milestone.isCompleted) return 'border-green-600';
    if (milestone.isCurrent) return 'border-blue-600';
    return 'border-gray-300';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{tracking.orderId.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600">
              Estimated completion: {formatDate(tracking.estimatedCompletion)}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onContactTailor}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Tailor
            </button>
            <button
              onClick={onRequestModification}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Request Changes
            </button>
          </div>
        </div>        {/* Current Status Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="font-medium text-blue-900">
              {tracking.milestones?.find(m => m.isCurrent)?.title || 'Processing'}
            </span>
          </div>
        </div>
      </div>      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Progress</h2>
        
        <div className="relative">
          {tracking.milestones?.map((milestone, index) => (
            <div key={milestone.id} className="relative flex items-start gap-4 pb-8">
              {/* Timeline Line */}
              {index < (tracking.milestones?.length || 0) - 1 && (
                <div 
                  className={`absolute left-3 top-8 w-0.5 h-full ${getTimelineColor(milestone)}`}
                />
              )}
              
              {/* Icon */}
              <div className="flex-shrink-0">
                {getStatusIcon(milestone)}
              </div>
              
              {/* Content */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${milestone.isCompleted ? 'text-green-700' : milestone.isCurrent ? 'text-blue-700' : 'text-gray-500'}`}>
                    {milestone.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {milestone.completedAt ? formatDate(milestone.completedAt) : formatDate(milestone.estimatedDate)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>      {/* Progress Updates */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Updates</h2>
        
        <div className="space-y-4">
          {tracking.progressUpdates.map((update) => (
            <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{update.title || 'Update'}</h4>
                <span className="text-sm text-gray-500">
                  {update.createdAt ? update.createdAt.toLocaleDateString() : update.timestamp || 'Unknown date'}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-3">{update.description || update.message}</p>
              
              {/* Progress Images */}
              {update.images && update.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {update.images.map((image, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={image}
                        alt={`Progress update ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all">
                        <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {update.createdBy && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">by {update.createdBy.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    update.createdBy.role === 'tailor' ? 'bg-purple-100 text-purple-700' :
                    update.createdBy.role === 'customer' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {update.createdBy.role}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Information */}
      {tracking.trackingNumber && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <Truck className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">
                {tracking.shippingCarrier} - {tracking.trackingNumber}
              </p>
              <p className="text-sm text-gray-600">Track your package</p>
            </div>
          </div>

          {tracking.shippingUpdates && (
            <div className="space-y-3">
              {tracking.shippingUpdates.map((update) => (
                <div key={update.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-600 mt-1" />
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-900">{update.status}</p>
                    <p className="text-sm text-gray-600">{update.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {update.location} • {update.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};