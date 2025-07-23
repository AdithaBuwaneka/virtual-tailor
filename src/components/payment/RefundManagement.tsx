
// components/payment/RefundManagement.tsx - Refund and Dispute Management
import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  FileText,
  MessageCircle,
  RefreshCw,
  X
} from 'lucide-react';

interface RefundRequest {
  id: string;
  orderId: string;
  customerId: string;
  tailorId: string;
  amount: number;
  requestedAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  type: 'full' | 'partial';
  requestedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
  customerEmail: string;
  customerName: string;
  evidence?: string[];
}

interface RefundManagementProps {
  refundRequests: RefundRequest[];
  onApproveRefund: (refundId: string, amount: number, notes?: string) => void;
  onRejectRefund: (refundId: string, reason: string) => void;
  onProcessRefund: (refundId: string) => void;
}

export const RefundManagement: React.FC<RefundManagementProps> = ({
  refundRequests,
  onApproveRefund,
  onRejectRefund
}) => {
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: RefundRequest['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'approved': return 'text-green-700 bg-green-100 border-green-200';
      case 'rejected': return 'text-red-700 bg-red-100 border-red-200';
      case 'processed': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: RefundRequest['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'processed': return <RefreshCw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleApprove = () => {
    if (selectedRefund && refundAmount) {
      onApproveRefund(selectedRefund.id, parseFloat(refundAmount), adminNotes);
      setSelectedRefund(null);
      setActionType(null);
      setRefundAmount('');
      setAdminNotes('');
    }
  };

  const handleReject = () => {
    if (selectedRefund && rejectionReason) {
      onRejectRefund(selectedRefund.id, rejectionReason);
      setSelectedRefund(null);
      setActionType(null);
      setRejectionReason('');
    }
  };
  const pendingRefunds = refundRequests.filter(r => r.status === 'pending');
  const approvedRefunds = refundRequests.filter(r => r.status === 'approved');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Refund Management</h1>
          <p className="text-gray-600 mt-2">Review and process customer refund requests</p>
        </div>
        <div className="flex gap-3">
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
            {pendingRefunds.length} Pending Review
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            {approvedRefunds.length} Approved
          </span>
        </div>
      </div>

      {/* Pending Refunds */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Pending Review</h2>
          <p className="text-gray-600 text-sm mt-1">
            Refund requests awaiting admin approval
          </p>
        </div>

        <div className="divide-y">
          {pendingRefunds.map((refund) => (
            <div key={refund.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-medium text-gray-900">
                      Refund Request #{refund.id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(refund.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(refund.status)}
                        {refund.status.toUpperCase()}
                      </div>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      refund.type === 'full' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {refund.type.toUpperCase()} REFUND
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-medium text-gray-900">{refund.customerName}</p>
                      <p className="text-sm text-gray-600">{refund.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order</p>
                      <p className="font-medium text-gray-900">
                        #{refund.orderId.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Requested Amount</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(refund.requestedAmount)}
                      </p>
                      <p className="text-xs text-gray-600">
                        of {formatCurrency(refund.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Requested Date</p>
                      <p className="font-medium text-gray-900">
                        {refund.requestedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Reason for Refund:</h4>
                    <p className="text-gray-700 text-sm">{refund.reason}</p>
                  </div>

                  {refund.evidence && refund.evidence.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Evidence:</h4>
                      <div className="flex gap-2">                        {refund.evidence.map((_, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                            <FileText className="w-4 h-4" />
                            Evidence {index + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedRefund(refund);
                      setActionType('approve');
                      setRefundAmount(refund.requestedAmount.toString());
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRefund(refund);
                      setActionType('reject');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <MessageCircle className="w-4 h-4" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingRefunds.length === 0 && (
            <div className="p-12 text-center">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No pending refund requests</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modals */}
      {selectedRefund && actionType === 'approve' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Approve Refund Request
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      max={selectedRefund.amount}
                      step="0.01"
                      className="pl-8 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Maximum: {formatCurrency(selectedRefund.amount)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal notes about this refund..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedRefund(null);
                    setActionType(null);
                    setRefundAmount('');
                    setAdminNotes('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={!refundAmount || parseFloat(refundAmount) <= 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRefund && actionType === 'reject' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reject Refund Request
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this refund request is being rejected..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedRefund(null);
                    setActionType(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};