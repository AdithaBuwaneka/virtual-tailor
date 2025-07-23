// components/payment/InvoiceGeneration.tsx - Invoice System
import React, { useState } from 'react';
import { Download, Printer, Mail, Eye, FileText } from 'lucide-react';
import { InvoiceStatus } from '../../types/payment';
import type { Invoice, InvoiceItem } from '../../types/payment';
import type { Order } from '../../types/order';

interface InvoiceGenerationProps {
  order: Order;
  onGenerateInvoice: (invoiceData: Partial<Invoice>) => void;
  onSendInvoice: (invoiceId: string, email: string) => void;
  existingInvoice?: Invoice;
}

export const InvoiceGeneration: React.FC<InvoiceGenerationProps> = ({
  order,
  onGenerateInvoice,
  onSendInvoice,
  existingInvoice
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [emailAddress, setEmailAddress] = useState(order.customer.email);

  const generateInvoiceData = (): Partial<Invoice> => {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    const items: InvoiceItem[] = [
      {
        id: '1',
        description: `${order.garmentType} - ${order.style}`,
        quantity: 1,
        unitPrice: order.basePrice,
        total: order.basePrice
      },
      ...order.customizations.map((custom, index) => ({
        id: String(index + 2),
        description: custom.name,
        quantity: 1,
        unitPrice: custom.price,
        total: custom.price
      }))
    ];

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const platformFee = subtotal * 0.05; // 5% platform fee
    const taxes = subtotal * 0.08; // 8% tax (example)
    const total = subtotal + platformFee + taxes;

    return {
      orderId: order.id,
      customerId: order.customer.id,
      tailorId: order.tailor.id,
      invoiceNumber,
      subtotal,
      platformFee,
      taxes,
      total,
      currency: 'usd',
      status: InvoiceStatus.DRAFT,
      issuedAt: new Date(),
      dueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      items
    };
  };

  const handleGenerateInvoice = () => {
    const invoiceData = generateInvoiceData();
    onGenerateInvoice(invoiceData);
  };

  const handleSendInvoice = () => {
    if (existingInvoice && emailAddress) {
      onSendInvoice(existingInvoice.id, emailAddress);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const invoiceData = existingInvoice || generateInvoiceData();

  return (
    <div className="space-y-6">
      {/* Invoice Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Invoice Management</h2>
            <p className="text-gray-600 text-sm mt-1">
              Generate and manage invoices for orders
            </p>
          </div>
          
          <div className="flex gap-3">
            {!existingInvoice ? (
              <button
                onClick={handleGenerateInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Generate Invoice
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Hide' : 'Preview'}
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </>
            )}
          </div>
        </div>

        {existingInvoice && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Invoice Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Number:</span>
                  <span className="text-gray-900 font-mono">{existingInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    existingInvoice.status === InvoiceStatus.PAID ? 'bg-green-100 text-green-700' :
                    existingInvoice.status === InvoiceStatus.SENT ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {existingInvoice.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Issued Date:</span>
                  <span className="text-gray-900">{existingInvoice.issuedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="text-gray-900">{existingInvoice.dueAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-gray-900">{formatCurrency(existingInvoice.total)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Send Invoice</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSendInvoice}
                  disabled={!emailAddress || existingInvoice.status === InvoiceStatus.SENT}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-4 h-4" />
                  Send Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Preview */}
      {showPreview && invoiceData && (
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="max-w-4xl mx-auto">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">VirtualTailor</h1>
                <p className="text-gray-600 mt-2">Custom Tailoring Platform</p>
                <p className="text-sm text-gray-500">
                  123 Fashion Street, Design City, DC 12345<br />
                  Email: invoices@virtualtailor.com<br />
                  Phone: (555) 123-4567
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                <p className="text-lg font-mono text-gray-700 mt-2">
                  {invoiceData.invoiceNumber}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Date: {invoiceData.issuedAt?.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Due: {invoiceData.dueAt?.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
                <div className="text-gray-700">
                  <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                  <p>{order.customer.email}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Service Provider:</h3>
                <div className="text-gray-700">
                  <p className="font-medium">{order.tailor.businessName}</p>
                  <p>via VirtualTailor Platform</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">{formatCurrency(invoiceData.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee:</span>
                    <span className="text-gray-900">{formatCurrency(invoiceData.platformFee || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-900">{formatCurrency(invoiceData.taxes || 0)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">{formatCurrency(invoiceData.total || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-sm text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Payment Terms:</h4>
                  <p>Payment is due within 30 days of invoice date. Late payments may incur additional fees.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Questions?</h4>
                  <p>Contact us at support@virtualtailor.com or (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};