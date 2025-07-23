// components/tailor/BusinessOperationsManagement.tsx - Main Operations Dashboard
import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  Calendar, 
  BarChart3,
  AlertTriangle,
  Plus,
  Search,
  Download,
  Settings,
  Play,
  Pause,
  Square,
  Timer,
  CheckCircle,
  Target,
  Zap,
  FileText,
  DollarSign
} from 'lucide-react';
import type { 
  InventoryItem, 
  TimeEntry, 
  ProductivityMetrics, 
  CapacityPlan, 
  AutomatedReport 
} from '../../types/businessOperations';

interface BusinessOperationsManagementProps {
  inventoryItems: InventoryItem[];
  timeEntries: TimeEntry[];
  productivityMetrics: ProductivityMetrics;
  capacityPlan: CapacityPlan;
  automatedReports: AutomatedReport[];
  onAddInventoryItem: () => void;
  onStartTimeEntry: (task: Partial<TimeEntry>) => void;
  onEndTimeEntry: (entryId: string) => void;
  onUpdateCapacity: (plan: Partial<CapacityPlan>) => void;
  onCreateReport: (report: Partial<AutomatedReport>) => void;
}

export const BusinessOperationsManagement: React.FC<BusinessOperationsManagementProps> = ({
  inventoryItems,
  timeEntries,
  productivityMetrics,
  capacityPlan,
  automatedReports,  onAddInventoryItem,
  onStartTimeEntry,
  onEndTimeEntry,
  // onUpdateCapacity not used
  onCreateReport
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'inventory' | 'time' | 'capacity' | 'reports'>('overview');  const activeTimeEntry = timeEntries.find(entry => entry.status === 'active') || null;
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getInventoryStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'low_stock': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'out_of_stock': return 'text-red-700 bg-red-100 border-red-200';
      case 'backordered': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'active': return 'text-green-700 bg-green-100 border-green-200';
      case 'discontinued': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const lowStockItems = inventoryItems.filter(item => 
    item.currentStock <= item.minimumStock && item.status !== 'out_of_stock'
  );
  const outOfStockItems = inventoryItems.filter(item => 
    item.currentStock === 0 || item.status === 'out_of_stock'
  );

  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = inventoryFilter === 'all' || 
                         (inventoryFilter === 'low_stock' && item.currentStock <= item.minimumStock) ||
                         (inventoryFilter === 'out_of_stock' && item.currentStock === 0);
    return matchesSearch && matchesFilter;
  });

  const todayTimeEntries = timeEntries.filter(entry => {
    const today = new Date();
    const entryDate = new Date(entry.startTime);
    return entryDate.toDateString() === today.toDateString();
  });

  const todayHours = todayTimeEntries.reduce((sum, entry) => sum + entry.totalMinutes, 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'time', label: 'Time Tracking', icon: Clock },
    { id: 'capacity', label: 'Capacity Planning', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Operations</h1>
          <p className="text-gray-600 mt-2">Manage inventory, track time, and optimize your workflow</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatHours(todayHours)}
              </p>
              <p className="text-sm text-gray-600">Today's Hours</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
              <p className="text-sm text-gray-600">Inventory Items</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
              <p className="text-sm text-gray-600">Low Stock Alerts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {capacityPlan.utilizationRate.toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">Capacity Utilization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Time Entry Widget */}
      {activeTimeEntry && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-medium text-blue-900">Currently Working On</h3>
                <p className="text-sm text-blue-700">{activeTimeEntry.taskDescription}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-bold text-blue-900">
                  {formatHours(activeTimeEntry.totalMinutes)}
                </p>
                <p className="text-xs text-blue-700">
                  Started: {activeTimeEntry.startTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  title="Pause"
                >
                  <Pause className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onEndTimeEntry(activeTimeEntry.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Stop"
                >
                  <Square className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Productivity Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-700">Total Hours This Month</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatHours(productivityMetrics.totalHours * 60)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-green-700">Revenue This Month</p>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(productivityMetrics.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-purple-700">Efficiency Score</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {(productivityMetrics.averageEfficiency * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts & Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Action Items</h3>
                <div className="space-y-3">
                  {outOfStockItems.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <div>
                        <h4 className="font-medium text-red-900">
                          {outOfStockItems.length} items out of stock
                        </h4>
                        <p className="text-sm text-red-700">
                          Immediate restocking required: {outOfStockItems.slice(0, 3).map(item => item.name).join(', ')}
                          {outOfStockItems.length > 3 && ` and ${outOfStockItems.length - 3} more`}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {lowStockItems.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-900">
                          {lowStockItems.length} items low on stock
                        </h4>
                        <p className="text-sm text-yellow-700">
                          Consider reordering: {lowStockItems.slice(0, 3).map(item => item.name).join(', ')}
                          {lowStockItems.length > 3 && ` and ${lowStockItems.length - 3} more`}
                        </p>
                      </div>
                    </div>
                  )}

                  {capacityPlan.utilizationRate > 90 && (
                    <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <Target className="w-6 h-6 text-orange-600" />
                      <div>
                        <h4 className="font-medium text-orange-900">High capacity utilization</h4>
                        <p className="text-sm text-orange-700">
                          Consider adjusting schedule or declining new orders to maintain quality
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {lowStockItems.length === 0 && outOfStockItems.length === 0 && capacityPlan.utilizationRate <= 90 && (
                    <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-medium text-green-900">All systems running smoothly</h4>
                        <p className="text-sm text-green-700">
                          No critical alerts. Great job managing your business operations!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      const taskDescription = prompt('What are you working on?');
                      if (taskDescription) {
                        onStartTimeEntry({
                          taskDescription,
                          taskType: 'sewing',
                          startTime: new Date(),
                          hourlyRate: 50
                        });
                      }
                    }}
                    className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Play className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Start Time Entry</span>
                  </button>
                  
                  <button
                    onClick={onAddInventoryItem}
                    className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Add Inventory</span>
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
                    <Calendar className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Schedule Task</span>
                  </button>
                  
                  <button
                    onClick={() => onCreateReport({ 
                      name: 'Weekly Summary',
                      reportType: 'productivity',
                      frequency: 'weekly'
                    })}
                    className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors"
                  >
                    <FileText className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Generate Report</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {selectedTab === 'inventory' && (
            <div className="space-y-6">
              {/* Inventory Controls */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={inventoryFilter}
                    onChange={(e) => setInventoryFilter(e.target.value as typeof inventoryFilter)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Items</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                
                <button
                  onClick={onAddInventoryItem}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              {/* Inventory Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInventory.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.category} • {item.subcategory}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getInventoryStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Stock:</span>
                        <span className="font-medium text-gray-900">
                          {item.currentStock} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium text-gray-900">
                          {item.availableQuantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cost per unit:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(item.costPerUnit)}
                        </span>
                      </div>
                    </div>

                    {/* Stock Level Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Stock Level</span>
                        <span>{((item.currentStock / item.maxStock) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            item.currentStock <= item.minimumStock ? 'bg-red-500' :
                            item.currentStock <= item.reorderPoint ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Use Stock
                      </button>
                      <button className="flex-1 text-sm border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredInventory.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || inventoryFilter !== 'all'
                      ? 'No items match your current filters.'
                      : 'Start tracking your materials and supplies by adding your first inventory item.'
                    }
                  </p>
                  {!searchTerm && inventoryFilter === 'all' && (
                    <button
                      onClick={onAddInventoryItem}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Item
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Time Tracking Tab */}
          {selectedTab === 'time' && (
            <div className="space-y-6">
              {/* Time Entry Controls */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Time Entries</h3>
                <button
                  onClick={() => {
                    const taskDescription = prompt('What are you working on?');
                    if (taskDescription) {
                      onStartTimeEntry({
                        taskDescription,
                        taskType: 'sewing',
                        startTime: new Date(),
                        hourlyRate: 50
                      });
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Start Timer
                </button>
              </div>

              {/* Today's Time Entries */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Today's Work</h4>
                <div className="space-y-3">
                  {todayTimeEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          entry.status === 'active' ? 'bg-green-500 animate-pulse' :
                          entry.status === 'completed' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}></div>
                        <div>
                          <h5 className="font-medium text-gray-900">{entry.taskDescription}</h5>
                          <p className="text-sm text-gray-600">
                            {entry.taskType.replace('_', ' ')} • 
                            {entry.startTime.toLocaleTimeString()} - 
                            {entry.endTime ? entry.endTime.toLocaleTimeString() : 'Active'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatHours(entry.totalMinutes)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(entry.totalCost)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {todayTimeEntries.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Timer className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No time entries for today</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Task Type Breakdown */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Task Breakdown This Month</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {productivityMetrics.taskBreakdown.map((task, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 capitalize">
                          {task.taskType.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">{task.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Hours:</span>
                          <span className="text-gray-900">{task.hours.toFixed(1)}h</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Revenue:</span>
                          <span className="text-gray-900">{formatCurrency(task.revenue)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Capacity Planning Tab */}
          {selectedTab === 'capacity' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Capacity Planning</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Settings className="w-4 h-4" />
                  Adjust Capacity
                </button>
              </div>

              {/* Capacity Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Current Utilization</h4>
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto">
                      <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path
                          className="text-gray-200"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="text-blue-600"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${capacityPlan.utilizationRate}, ${100 - capacityPlan.utilizationRate}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {capacityPlan.utilizationRate.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Available Hours</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Hours:</span>
                      <span className="font-medium">{capacityPlan.allocatedHours + capacityPlan.availableHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allocated:</span>
                      <span className="font-medium">{capacityPlan.allocatedHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-medium text-green-600">{capacityPlan.availableHours}h</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Active Orders</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Orders:</span>
                      <span className="font-medium">{capacityPlan.bookings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Concurrent:</span>
                      <span className="font-medium">{capacityPlan.maxConcurrentOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className={`font-medium ${
                        capacityPlan.bookings.length >= capacityPlan.maxConcurrentOrders 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {capacityPlan.maxConcurrentOrders - capacityPlan.bookings.length} available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Bookings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Current Bookings</h4>
                <div className="space-y-3">
                  {capacityPlan.bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{booking.orderTitle}</h5>
                        <p className="text-sm text-gray-600">
                          {booking.customerName} • {booking.estimatedHours}h estimated
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          booking.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          booking.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {booking.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}

                  {capacityPlan.bookings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No current bookings</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {selectedTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Automated Reports</h3>
                <button
                  onClick={() => onCreateReport({ 
                    name: 'New Report',
                    reportType: 'financial',
                    frequency: 'weekly'
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {automatedReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{report.name}</h4>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {report.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className="text-gray-900 capitalize">{report.reportType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="text-gray-900 capitalize">{report.frequency}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Recipients:</span>
                        <span className="text-gray-900">{report.recipients.length} email(s)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Next Send:</span>
                        <span className="text-gray-900">
                          {report.nextSendDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Edit
                      </button>
                      <button className="flex-1 text-sm border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        Send Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {automatedReports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No automated reports</h3>
                  <p className="text-gray-600 mb-6">
                    Set up automated reports to stay informed about your business performance.
                  </p>
                  <button
                    onClick={() => onCreateReport({ 
                      name: 'Weekly Summary',
                      reportType: 'productivity',
                      frequency: 'weekly'
                    })}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Report
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};