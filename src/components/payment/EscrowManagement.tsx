// components/payment/EscrowManagement.tsx - Escrow System Component
import React, { useState } from 'react';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Lock,
  Unlock
} from 'lucide-react';
import { EscrowStatus } from '../../types/payment';
import type { EscrowAccount } from '../../types/payment';

interface EscrowManagementProps {
  escrowAccounts: EscrowAccount[];
  onReleaseEscrow: (escrowId: string) => void;
  onDisputeEscrow: (escrowId: string, reason: string) => void;
  onRefundEscrow?: (escrowId: string, reason: string) => void;
}

export const EscrowManagement: React.FC<EscrowManagementProps> = ({  escrowAccounts,
  onReleaseEscrow,
  onDisputeEscrow,
  onRefundEscrow
}) => {
  const [selectedEscrow, setSelectedEscrow] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const getStatusColor = (status: EscrowStatus) => {
    switch (status) {
      case EscrowStatus.HELD: return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case EscrowStatus.RELEASED: return 'text-green-700 bg-green-100 border-green-200';
      case EscrowStatus.DISPUTED: return 'text-red-700 bg-red-100 border-red-200';
      case EscrowStatus.REFUNDED: return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: EscrowStatus) => {
    switch (status) {
      case EscrowStatus.HELD: return <Lock className="w-4 h-4" />;
      case EscrowStatus.RELEASED: return <Unlock className="w-4 h-4" />;
      case EscrowStatus.DISPUTED: return <AlertTriangle className="w-4 h-4" />;
      case EscrowStatus.REFUNDED: return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const totalHeld = escrowAccounts
    .filter(acc => acc.status === EscrowStatus.HELD)
    .reduce((sum, acc) => sum + acc.amount, 0);
  const totalReleased = escrowAccounts
    .filter(acc => acc.status === EscrowStatus.RELEASED)
    .reduce((sum, acc) => sum + (acc.releasedAmount ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Escrow Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalHeld)}
              </p>
              <p className="text-sm text-gray-600">Funds in Escrow</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalReleased)}
              </p>
              <p className="text-sm text-gray-600">Released to Tailors</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {escrowAccounts.filter(acc => acc.status === EscrowStatus.HELD).length}
              </p>
              <p className="text-sm text-gray-600">Pending Release</p>
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Accounts List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Escrow Accounts</h2>
          <p className="text-gray-600 text-sm mt-1">
            Funds held securely until order completion
          </p>
        </div>

        <div className="divide-y">
          {escrowAccounts.map((escrow) => (
            <div key={escrow.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-medium text-gray-900">
                      Order #{escrow.orderId.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(escrow.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(escrow.status)}
                        {escrow.status.toUpperCase()}
                      </div>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(escrow.amount, escrow.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tailor Amount</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(escrow.tailorAmount, escrow.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Platform Fee</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(escrow.platformFee, escrow.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {escrow.status === EscrowStatus.HELD ? 'Release Date' : 'Processed Date'}
                      </p>
                      <p className="font-medium text-gray-900">
                        {(escrow.releasedAt || escrow.holdUntil).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {escrow.status === EscrowStatus.HELD && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          Funds will be automatically released on {escrow.holdUntil.toLocaleDateString()} 
                          or when order is marked as delivered
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {escrow.status === EscrowStatus.HELD && (
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => onReleaseEscrow(escrow.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Unlock className="w-4 h-4" />
                      Release
                    </button>                    <button
                      onClick={() => setSelectedEscrow(escrow.id)}
                      className="flex items-center gap-2 px-3 py-1.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Dispute
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEscrow(escrow.id);
                        setShowRefundModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Refund
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {escrowAccounts.length === 0 && (
            <div className="p-12 text-center">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No escrow accounts found</p>
            </div>
          )}
        </div>
      </div>

      {/* Dispute Modal */}
      {selectedEscrow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dispute Escrow Account
              </h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for disputing this escrow account. This will freeze the funds pending investigation.
              </p>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedEscrow(null);
                    setDisputeReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (disputeReason.trim()) {
                      onDisputeEscrow(selectedEscrow, disputeReason);
                      setSelectedEscrow(null);
                      setDisputeReason('');
                    }
                  }}
                  disabled={!disputeReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Dispute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Refund Escrow Account
              </h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for refunding this escrow account. The funds will be returned to the buyer.
              </p>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Describe the reason for refund..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {                      if (refundReason.trim() && typeof onRefundEscrow === 'function') {
                      onRefundEscrow(selectedEscrow || '', refundReason);
                      setShowRefundModal(false);
                      setRefundReason('');
                    }
                  }}
                  disabled={!refundReason.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
