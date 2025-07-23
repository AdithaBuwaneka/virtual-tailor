// components/payment/PaymentSettings.tsx - Payment Configuration
import React, { useState } from 'react';
import { 
  CreditCard, 
  Globe, 
  Shield, 
  DollarSign,
  Save,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

export interface PaymentConfig {
  platformFeeRate: number;
  stripeFeeRate: number;
  stripeFeeFixed: number;
  escrowHoldDays: number;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  minimumPayoutAmount: number;
  supportedCurrencies: string[];
  fraudDetection: {
    enabled: boolean;
    maxFailedAttempts: number;
    highValueThreshold: number;
    velocityChecks: boolean;
  };
  refundPolicy: {
    allowRefunds: boolean;
    refundTimeLimit: number; // days
    partialRefundsAllowed: boolean;
    autoRefundThreshold: number;
  };
}

interface PaymentSettingsProps {
  config: PaymentConfig;
  onUpdateConfig: (config: PaymentConfig) => void;
}

export const PaymentSettings: React.FC<PaymentSettingsProps> = ({
  config,
  onUpdateConfig
}) => {
  const [localConfig, setLocalConfig] = useState<PaymentConfig>(config);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'fees' | 'currencies' | 'security' | 'refunds'>('fees');

  const handleConfigChange = (
    section: keyof PaymentConfig,
    field: string,
    value: unknown
  ) => {
    if (section === 'payoutSchedule') {
      setLocalConfig(prev => ({ ...prev, payoutSchedule: value as 'daily' | 'weekly' | 'monthly' }));
    } else if (section === 'fraudDetection' && typeof field === 'string') {
      setLocalConfig(prev => ({
        ...prev,
        fraudDetection: { ...prev.fraudDetection, [field]: value }
      }));
    } else if (section === 'refundPolicy' && typeof field === 'string') {
      setLocalConfig(prev => ({
        ...prev,
        refundPolicy: { ...prev.refundPolicy, [field]: value }
      }));
    } else {
      setLocalConfig(prev => ({ ...prev, [section]: value }));
    }
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdateConfig(localConfig);
    setHasChanges(false);
  };

  const addCurrency = (currency: string) => {
    const newCurrencies = [...localConfig.supportedCurrencies, currency];
    setLocalConfig(prev => ({ ...prev, supportedCurrencies: newCurrencies }));
    setHasChanges(true);
  };

  const removeCurrency = (currency: string) => {
    const newCurrencies = localConfig.supportedCurrencies.filter(c => c !== currency);
    setLocalConfig(prev => ({ ...prev, supportedCurrencies: newCurrencies }));
    setHasChanges(true);
  };

  const tabs = [
    { id: 'fees', label: 'Fees & Payouts', icon: DollarSign },
    { id: 'currencies', label: 'Currencies', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'refunds', label: 'Refunds', icon: CreditCard }
  ];

  const availableCurrencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'INR', name: 'Indian Rupee' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
          <p className="text-gray-600 mt-2">Configure payment processing and policies</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      {/* Tabs */}
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
          {/* Fees & Payouts Tab */}
          {selectedTab === 'fees' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Fee Rate (%)
                    </label>
                    <input
                      type="number"
                      value={localConfig.platformFeeRate * 100}
                      onChange={(e) => handleConfigChange('platformFeeRate', '', parseFloat(e.target.value) / 100)}
                      step="0.1"
                      min="0"
                      max="20"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Fee charged to customers on top of order total
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stripe Fee Rate (%)
                    </label>
                    <input
                      type="number"
                      value={localConfig.stripeFeeRate * 100}
                      onChange={(e) => handleConfigChange('stripeFeeRate', '', parseFloat(e.target.value) / 100)}
                      step="0.1"
                      min="0"
                      max="10"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stripe Fixed Fee ($)
                    </label>
                    <input
                      type="number"
                      value={localConfig.stripeFeeFixed}
                      onChange={(e) => handleConfigChange('stripeFeeFixed', '', parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Escrow Hold Period (days)
                    </label>
                    <input
                      type="number"
                      value={localConfig.escrowHoldDays}
                      onChange={(e) => handleConfigChange('escrowHoldDays', '', parseInt(e.target.value))}
                      min="1"
                      max="90"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Days to hold funds before automatic release
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payout Schedule
                    </label>
                    <select
                      value={localConfig.payoutSchedule}
                      onChange={(e) => handleConfigChange('payoutSchedule', '', e.target.value as 'daily' | 'weekly' | 'monthly')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Payout Amount ($)
                    </label>
                    <input
                      type="number"
                      value={localConfig.minimumPayoutAmount}
                      onChange={(e) => handleConfigChange('minimumPayoutAmount', '', parseFloat(e.target.value))}
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Currencies Tab */}
          {selectedTab === 'currencies' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Currencies</h3>
                <p className="text-gray-600 mb-6">
                  Configure which currencies customers can pay with and tailors can receive payouts in.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Active Currencies</h4>
                    <div className="space-y-2">
                      {localConfig.supportedCurrencies.map((currency) => {
                        const currencyInfo = availableCurrencies.find(c => c.code === currency);
                        return (
                          <div key={currency} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-900">{currency}</span>
                              <span className="text-gray-600 ml-2">- {currencyInfo?.name}</span>
                            </div>
                            {currency !== 'USD' && ( // Don't allow removing USD
                              <button
                                onClick={() => removeCurrency(currency)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Available Currencies</h4>
                    <div className="space-y-2">
                      {availableCurrencies
                        .filter(c => !localConfig.supportedCurrencies.includes(c.code))
                        .map((currency) => (
                          <div key={currency.code} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-900">{currency.code}</span>
                              <span className="text-gray-600 ml-2">- {currency.name}</span>
                            </div>
                            <button
                              onClick={() => addCurrency(currency.code)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {selectedTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud Detection</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Enable Fraud Detection</h4>
                      <p className="text-sm text-gray-600">
                        Automatically detect and prevent fraudulent transactions
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.fraudDetection.enabled}
                        onChange={(e) => handleConfigChange('fraudDetection', 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {localConfig.fraudDetection.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6 border-l-2 border-blue-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Failed Attempts
                        </label>
                        <input
                          type="number"
                          value={localConfig.fraudDetection.maxFailedAttempts}
                          onChange={(e) => handleConfigChange('fraudDetection', 'maxFailedAttempts', parseInt(e.target.value))}
                          min="1"
                          max="10"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Block customer after this many failed payment attempts
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          High Value Threshold ($)
                        </label>
                        <input
                          type="number"
                          value={localConfig.fraudDetection.highValueThreshold}
                          onChange={(e) => handleConfigChange('fraudDetection', 'highValueThreshold', parseFloat(e.target.value))}
                          min="100"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Flag transactions above this amount for review
                        </p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Velocity Checks</h4>
                            <p className="text-sm text-gray-600">
                              Monitor for unusually high transaction volumes
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localConfig.fraudDetection.velocityChecks}
                              onChange={(e) => handleConfigChange('fraudDetection', 'velocityChecks', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Refunds Tab */}
          {selectedTab === 'refunds' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Policy</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Allow Refunds</h4>
                      <p className="text-sm text-gray-600">
                        Enable customers to request refunds for their orders
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.refundPolicy.allowRefunds}
                        onChange={(e) => handleConfigChange('refundPolicy', 'allowRefunds', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {localConfig.refundPolicy.allowRefunds && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6 border-l-2 border-green-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Refund Time Limit (days)
                        </label>
                        <input
                          type="number"
                          value={localConfig.refundPolicy.refundTimeLimit}
                          onChange={(e) => handleConfigChange('refundPolicy', 'refundTimeLimit', parseInt(e.target.value))}
                          min="1"
                          max="365"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Maximum days after purchase to request refund
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Auto-Refund Threshold ($)
                        </label>
                        <input
                          type="number"
                          value={localConfig.refundPolicy.autoRefundThreshold}
                          onChange={(e) => handleConfigChange('refundPolicy', 'autoRefundThreshold', parseFloat(e.target.value))}
                          min="0"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Automatically approve refunds below this amount
                        </p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Allow Partial Refunds</h4>
                            <p className="text-sm text-gray-600">
                              Enable partial refunds for customization fees, etc.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={localConfig.refundPolicy.partialRefundsAllowed}
                              onChange={(e) => handleConfigChange('refundPolicy', 'partialRefundsAllowed', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Notification */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>You have unsaved changes</span>
            <button
              onClick={handleSave}
              className="ml-4 px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};