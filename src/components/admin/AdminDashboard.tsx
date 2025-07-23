import { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
  Users, Shield, ShoppingBag, Server,
  AlertTriangle, CheckCircle, Clock, Eye,
  Brain, Target, Zap, 
  BarChart3,
  Download, RefreshCw, Bell,
  Database, Activity, TrendingUp, TrendingDown, DollarSign
} from 'lucide-react';
import type { 
  MetricCardProps, 
  SystemStatusCardProps,
  SystemAlert
} from '../../types/admin';

// Import the additional admin components
const AdminUserManagement = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
      <p className="text-gray-600 mb-4">Comprehensive user verification, tailor onboarding, and customer support tools</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900">1,247 Total Users</h4>
          <p className="text-sm text-blue-700">156 Tailors, 1,091 Customers</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900">89% Verified</h4>
          <p className="text-sm text-green-700">High verification rate</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-900">12 Pending</h4>
          <p className="text-sm text-yellow-700">Awaiting approval</p>
        </div>
      </div>
    </div>
  );
};

const AdminOrderAnalytics = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <ShoppingBag className="w-16 h-16 text-green-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Analytics</h3>
      <p className="text-gray-600 mb-4">Advanced order analytics, completion tracking, and quality metrics</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900">2,610 Total Orders</h4>
          <p className="text-sm text-green-700">82.6% completion rate</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900">$587,250 Revenue</h4>
          <p className="text-sm text-blue-700">24.3% growth</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-900">18.5 Days Avg</h4>
          <p className="text-sm text-purple-700">Delivery time</p>
        </div>
      </div>
    </div>
  );
};

const AdminQualityControl = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Control</h3>
      <p className="text-gray-600 mb-4">Automated quality assurance, dispute resolution, and content moderation</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-4 bg-red-50 rounded-lg">
          <h4 className="font-semibold text-red-900">23 Active Issues</h4>
          <p className="text-sm text-red-700">Requiring attention</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900">4.7 Avg Rating</h4>
          <p className="text-sm text-green-700">Customer satisfaction</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-900">2.3h Response</h4>
          <p className="text-sm text-yellow-700">Average resolution time</p>
        </div>
      </div>
    </div>
  );
};

const AdminSystemHealth = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <Server className="w-16 h-16 text-purple-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">System Health</h3>
      <p className="text-gray-600 mb-4">Infrastructure monitoring, performance optimization, and security oversight</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900">99.94% Uptime</h4>
          <p className="text-sm text-green-700">Excellent reliability</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900">127ms Response</h4>
          <p className="text-sm text-blue-700">Fast performance</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-900">1,423 Active Users</h4>
          <p className="text-sm text-purple-700">Current load</p>
        </div>
      </div>
    </div>
  );
};

// Mock admin data
const platformMetrics = {
  totalUsers: 1247,
  totalTailors: 156,
  totalCustomers: 1091,
  activeOrders: 342,
  completedOrders: 2156,
  totalRevenue: 487250,
  monthlyGrowth: 38.6,
  averageOrderValue: 226,
  customerSatisfaction: 4.8,
  platformUptime: 99.94
};

const aiMetrics = {
  measurementAccuracy: 95.7,
  predictionConfidence: 92.3,
  userAdjustmentRate: 12.4,
  modelPerformance: 98.1,
  processingSpeed: 1.2,
  dailyPredictions: 156,
  accuracyTrend: 'up'
};

const revenueData = [
  { month: 'Jan', revenue: 32500, orders: 145, growth: 15.2 },
  { month: 'Feb', revenue: 38900, orders: 172, growth: 19.7 },
  { month: 'Mar', revenue: 42300, orders: 189, growth: 8.7 },
  { month: 'Apr', revenue: 51200, orders: 223, growth: 21.1 },
  { month: 'May', revenue: 48750, orders: 218, growth: -4.8 },
  { month: 'Jun', revenue: 56800, orders: 251, growth: 16.5 }
];

const userGrowthData = [
  { month: 'Jan', customers: 892, tailors: 134, active: 756 },
  { month: 'Feb', customers: 934, tailors: 141, active: 823 },
  { month: 'Mar', customers: 987, tailors: 148, active: 891 },
  { month: 'Apr', customers: 1034, tailors: 152, active: 934 },
  { month: 'May', customers: 1078, tailors: 155, active: 967 },
  { month: 'Jun', customers: 1091, tailors: 156, active: 1002 }
];

const orderStatusData = [
  { name: 'Completed', value: 2156, color: '#10B981' },
  { name: 'In Progress', value: 342, color: '#3B82F6' },
  { name: 'Pending', value: 89, color: '#F59E0B' },
  { name: 'Cancelled', value: 23, color: '#EF4444' }
];

const aiAccuracyData = [
  { measurement: 'Height', accuracy: 98.2, confidence: 99.1 },
  { measurement: 'Chest', accuracy: 96.8, confidence: 95.4 },
  { measurement: 'Waist', accuracy: 95.1, confidence: 93.7 },
  { measurement: 'Hip', accuracy: 94.3, confidence: 91.2 },
  { measurement: 'Shoulder', accuracy: 93.7, confidence: 89.8 },
  { measurement: 'Arm Length', accuracy: 92.4, confidence: 88.5 }
];

const recentAlerts = [
  { id: 1, type: 'warning' as const, message: 'High order volume detected - consider scaling', timestamp: '2 min ago', severity: 'medium' as const, service: 'Order Processing', resolved: false },
  { id: 2, type: 'info' as const, message: 'AI model updated to v2.1.4', timestamp: '15 min ago', severity: 'low' as const, service: 'AI System', resolved: true },
  { id: 3, type: 'success' as const, message: 'Payment processing uptime: 100% (7 days)', timestamp: '1 hour ago', severity: 'low' as const, service: 'Payment Gateway', resolved: true },
  { id: 4, type: 'warning' as const, message: 'Tailor verification queue: 12 pending', timestamp: '2 hours ago', severity: 'medium' as const, service: 'User Management', resolved: false }
];

const systemHealth = {
  database: { status: 'healthy' as const, responseTime: '12ms', uptime: '99.99%' },
  api: { status: 'healthy' as const, responseTime: '45ms', uptime: '99.94%' },
  ai: { status: 'healthy' as const, responseTime: '1.2s', uptime: '99.87%' },
  payments: { status: 'healthy' as const, responseTime: '234ms', uptime: '100%' },
  storage: { status: 'warning' as const, responseTime: '89ms', uptime: '99.12%' }
};

const MetricCard = ({ title, value, change, icon: Icon, trend, subtitle }: MetricCardProps) => {
  const isPositive = trend === 'up' || (change !== undefined && change > 0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-blue-100'}`}>
            <Icon className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

const AlertItem = ({ alert }: { alert: SystemAlert }) => {
  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'info': return <Eye className="w-4 h-4 text-blue-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`border-l-4 ${getSeverityColor(alert.severity)} p-3 rounded-r-lg`}>
      <div className="flex items-start space-x-3">
        {getAlertIcon(alert.type)}
        <div className="flex-1">
          <p className="text-sm text-gray-800">{alert.message}</p>
          <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const SystemStatusCard = ({ name, data, icon: Icon }: SystemStatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">{name}</span>        </div>        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
          {data.status}
        </div>
      </div>
      <div className="space-y-2">        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Response Time</span>
          <span className="text-xs font-medium">{data.responseTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Uptime</span>
          <span className="text-xs font-medium">{data.uptime}</span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'ai-monitoring', name: 'AI Monitoring', icon: Brain },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'orders', name: 'Order Analytics', icon: ShoppingBag },
    { id: 'quality', name: 'Quality Control', icon: Shield },
    { id: 'system', name: 'System Health', icon: Server }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${(platformMetrics.totalRevenue / 1000).toFixed(1)}k`}
          change={platformMetrics.monthlyGrowth}
          icon={DollarSign}
          trend="up"
          subtitle="This month"
        />
        <MetricCard
          title="Active Users"
          value={platformMetrics.totalUsers.toLocaleString()}
          change={15.2}
          icon={Users}
          trend="up"
          subtitle={`${platformMetrics.totalTailors} tailors`}
        />
        <MetricCard
          title="Active Orders"
          value={platformMetrics.activeOrders}
          change={8.7}
          icon={ShoppingBag}
          trend="up"
          subtitle="In progress"
        />
        <MetricCard
          title="AI Accuracy"
          value={`${aiMetrics.measurementAccuracy}%`}
          change={2.1}
          icon={Brain}
          trend="up"
          subtitle="Measurement prediction"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+38.6% growth</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <div className="flex items-center space-x-1 text-sm text-blue-600">
              <Users className="w-4 h-4" />
              <span>1,247 total users</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="customers" stroke="#3B82F6" strokeWidth={2} name="Customers" />
              <Line type="monotone" dataKey="tailors" stroke="#10B981" strokeWidth={2} name="Tailors" />
              <Line type="monotone" dataKey="active" stroke="#F59E0B" strokeWidth={2} name="Active Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Orders']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* System Health Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <Activity className="w-4 h-4" />
              <span>99.94% uptime</span>
            </div>
          </div>
          <div className="space-y-3">
            <SystemStatusCard name="Database" data={systemHealth.database} icon={Database} />
            <SystemStatusCard name="API" data={systemHealth.api} icon={Server} />
            <SystemStatusCard name="AI Service" data={systemHealth.ai} icon={Brain} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIMonitoring = () => (
    <div className="space-y-6">
      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Prediction Accuracy"
          value={`${aiMetrics.measurementAccuracy}%`}
          change={2.1}
          icon={Target}
          trend="up"
          subtitle="Overall accuracy"
        />
        <MetricCard
          title="Confidence Score"
          value={`${aiMetrics.predictionConfidence}%`}
          change={1.3}
          icon={Brain}
          trend="up"
          subtitle="Average confidence"
        />
        <MetricCard
          title="Processing Speed"
          value={`${aiMetrics.processingSpeed}s`}
          change={-5.2}
          icon={Zap}
          trend="up"
          subtitle="Average response time"
        />
        <MetricCard
          title="Daily Predictions"
          value={aiMetrics.dailyPredictions}
          change={12.4}
          icon={Activity}
          trend="up"
          subtitle="Today"
        />
      </div>

      {/* AI Accuracy by Measurement Type */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Accuracy by Measurement Type</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={aiAccuracyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="measurement" />
            <YAxis domain={[85, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
            <Legend />
            <Bar dataKey="accuracy" fill="#3B82F6" name="Prediction Accuracy" />
            <Bar dataKey="confidence" fill="#10B981" name="Confidence Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Model Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Production Model v2.1.4</p>
                <p className="text-sm text-green-700">Accuracy: 95.7% | Deployed: 2 days ago</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Staging Model v2.2.0</p>
                <p className="text-sm text-blue-700">Testing: 96.2% accuracy | Ready for deployment</p>
              </div>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Deploy v2.2.0
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Rollback
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Data Quality</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Training Samples</span>
              <span className="font-semibold">47,250</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Validation Accuracy</span>
              <span className="font-semibold text-green-600">96.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Data Quality Score</span>
              <span className="font-semibold text-blue-600">94.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Training</span>
              <span className="font-semibold">3 days ago</span>
            </div>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Trigger Retraining
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className={`p-2 text-gray-600 hover:text-gray-900 transition-colors ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'ai-monitoring' && renderAIMonitoring()}
        {activeTab === 'users' && <AdminUserManagement />}
        {activeTab === 'orders' && <AdminOrderAnalytics />}
        {activeTab === 'quality' && <AdminQualityControl />}
        {activeTab === 'system' && <AdminSystemHealth />}
      </div>
    </div>
  );
};

export default AdminDashboard;