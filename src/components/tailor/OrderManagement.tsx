// components/tailor/OrderManagement.tsx - Detailed Order Management
import React, { useState } from 'react';
// Only import icons that are actually used
import { Camera, Upload, Save } from 'lucide-react';
import type { ProgressUpdate } from '@/types';
import type { Order } from '@/types';
import type { OrderStatus } from '../../types/order';
import { OrderStatus as OrderStatusEnum } from '../../types/order';

interface OrderManagementProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onAddProgressUpdate: (orderId: string, update: Partial<ProgressUpdate>) => void;
  onUploadImages: (files: File[]) => Promise<string[]>;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  order,
  onUpdateStatus,
  onAddProgressUpdate,
  onUploadImages
}) => {
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const statusOptions = [
    { value: OrderStatusEnum.ACCEPTED, label: 'Accepted' },
    { value: OrderStatusEnum.MATERIALS_SOURCING, label: 'Sourcing Materials' },
    { value: OrderStatusEnum.IN_PROGRESS, label: 'In Progress' },
    { value: OrderStatusEnum.QUALITY_REVIEW, label: 'Quality Review' },
    { value: OrderStatusEnum.COMPLETED, label: 'Completed' },
  ];

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    onUpdateStatus(order.id, newStatus);
  };

  const handleAddUpdate = async () => {
    if (!updateTitle.trim()) return;

    setIsUploading(true);
    try {
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await onUploadImages(selectedImages);
      }      onAddProgressUpdate(order.id, {
        type: 'progress_photo',
        title: updateTitle,
        message: updateDescription,
        images: imageUrls,
        createdBy: {
          id: 'current-tailor-id', // Would come from auth context
          name: 'Current Tailor', // Would come from auth context
          role: 'tailor'
        }
      });

      // Reset form
      setUpdateTitle('');
      setUpdateDescription('');
      setSelectedImages([]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };
  // Helper function to safely get customer name
  const getCustomerName = (order: Order): string => {    try {
      return `${order.customer.firstName} ${order.customer.lastName}`;
    } catch {
      return "Customer";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600">Customer: {getCustomerName(order)}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(order.totalPrice)}
            </p>
            <p className="text-sm text-gray-600">
              Due: {new Date(order.expectedDelivery).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Order Status</h2>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusUpdate(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    order.status === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <div className="mt-6">
              <h2 className="font-semibold text-gray-900 mb-3">Order Details</h2>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Garment:</span>
                  <span className="font-medium">{order.garmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Style:</span>
                  <span className="font-medium">{order.style}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline:</span>
                  <span className="font-medium">{order.timeline} weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className={`font-medium ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Requirements</h2>
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm h-40 overflow-y-auto">
              {order.requirements}
            </div>
            
            <div className="mt-6">
              <h2 className="font-semibold text-gray-900 mb-3">Customizations</h2>
              <div className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-2">Item</th>
                      <th className="text-right p-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="p-2">Base Price</td>
                      <td className="text-right p-2">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(order.basePrice)}
                      </td>
                    </tr>
                    {order.customizations.map((item, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-2">{item.name}</td>
                        <td className="text-right p-2">
                          +{new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(item.price)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-200 font-semibold">
                      <td className="p-2">Total</td>
                      <td className="text-right p-2">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(order.totalPrice)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Measurements */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Measurements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(order.measurements).map(([key, value]) => (
            <div key={key} className="border rounded-lg p-3">
              <div className="text-sm text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-lg font-medium">
                {typeof value === 'number' ? `${value} cm` : value}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress Updates */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Add Progress Update</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="updateTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="updateTitle"
              type="text"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              placeholder="Update title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="updateDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="updateDescription"
              value={updateDescription}
              onChange={(e) => setUpdateDescription(e.target.value)}
              placeholder="Provide details about your progress..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Photos
            </label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                <Camera className="w-5 h-5" />
                <span>Select Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {selectedImages.length > 0
                  ? `${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} selected`
                  : 'No images selected'}
              </span>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleAddUpdate}
              disabled={!updateTitle.trim() || isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Upload className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Update
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};