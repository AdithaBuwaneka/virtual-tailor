import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Server, Database, HardDrive,
  Activity, AlertTriangle, CheckCircle, XCircle, Zap,
  Globe, Shield, Eye, RefreshCw, Download,
  TrendingUp, TrendingDown, Bell, Users,
  Brain
} from 'lucide-react';
import type { StatusCardProps, SystemAlert } from '@/types/admin';

// Mock system health data
const systemOverview = {
  status: 'healthy',
  uptime: '99.94%',
  totalRequests: 2847291,
  activeUsers: 1423,
  responseTime: 127,
  errorRate: 0.12,
  throughput: 1847,
  lastIncident: '12 days ago'
};

const infrastructureHealth = {
  webServers: {
    status: 'healthy',
    count: 6,
    active: 6,
    cpu: 34,
    memory: 67,
    responseTime: 45
  },
  database: {
    status: 'healthy',
    connections: 89,
    maxConnections: 200,
    cpu: 23,
    memory: 56,
    responseTime: 12
  },
  aiService: {
    status: 'healthy',
    predictions: 156,
    accuracy: 95.7,
    cpu: 78,
    memory: 82,
    responseTime: 1.2
  },
  storage: {
    status: 'warning',
    used: 743,
    total: 1000,
    iops: 2340,
    bandwidth: 156
  },
  cdn: {
    status: 'healthy',
    cacheHitRatio: 94.2,
    bandwidth: 2.3,
    responseTime: 23,
    regions: 12
  }
};

const performanceMetrics = [
  { time: '00:00', responseTime: 120, throughput: 1200, errorRate: 0.1, activeUsers: 890 },
  { time: '04:00', responseTime: 98, throughput: 800, errorRate: 0.05, activeUsers: 456 },
  { time: '08:00', responseTime: 145, throughput: 1800, errorRate: 0.15, activeUsers: 1340 },
  { time: '12:00', responseTime: 167, throughput: 2100, errorRate: 0.18, activeUsers: 1780 },
  { time: '16:00', responseTime: 134, throughput: 1950, errorRate: 0.12, activeUsers: 1654 },
  { time: '20:00', responseTime: 112, throughput: 1600, errorRate: 0.08, activeUsers: 1234 },
];

const securityMetrics = {
  threatsBlocked: 1247,
  loginAttempts: 8934,
  failedLogins: 234,
  suspiciousActivity: 12,
  dataEncryption: 'AES-256',
  sslCertificate: 'Valid - 89 days',
  twoFactorUsers: 78.3,
  lastSecurityScan: '2 hours ago'
};

const apiEndpoints: Array<{
  endpoint: string;
  requests: number;
  avgResponse: number;
  errorRate: number;
  status: 'healthy' | 'warning' | 'error';
}> = [
  { 
    endpoint: '/api/v1/measurements/predict', 
    requests: 15647, 
    avgResponse: 1.2, 
    errorRate: 0.08,
    status: 'healthy'
  },
  { 
    endpoint: '/api/v1/orders', 
    requests: 12389, 
    avgResponse: 89, 
    errorRate: 0.12,
    status: 'healthy'
  },
  { 
    endpoint: '/api/v1/auth/login', 
    requests: 8934, 
    avgResponse: 234, 
    errorRate: 2.1,
    status: 'warning'
  },
  { 
    endpoint: '/api/v1/chat/messages', 
    requests: 23456, 
    avgResponse: 67, 
    errorRate: 0.05,
    status: 'healthy'
  },
  { 
    endpoint: '/api/v1/payments/process', 
    requests: 3456, 
    avgResponse: 567, 
    errorRate: 0.02,
    status: 'healthy'
  }
];

const systemAlerts: SystemAlert[] = [
  {
    id: 1,
    type: 'warning',
    severity: 'medium',
    message: 'Storage usage approaching 75% capacity',
    timestamp: '5 minutes ago',
    service: 'Storage',
    resolved: false
  },
  {
    id: 2,
    type: 'info',
    severity: 'low',
    message: 'Scheduled maintenance completed successfully',
    timestamp: '2 hours ago',
    service: 'Infrastructure',
    resolved: true
  },
  {
    id: 3,
    type: 'error',
    severity: 'high',
    message: 'Temporary spike in login endpoint errors',
    timestamp: '4 hours ago',
    service: 'Authentication',
    resolved: true
  },
  {
    id: 4,
    type: 'success',
    severity: 'low',
    message: 'AI model deployment completed',
    timestamp: '6 hours ago',
    service: 'AI Service',
    resolved: true
  }
];

const resourceUsage = [
  { time: '00:00', cpu: 34, memory: 67, disk: 45, network: 23 },
  { time: '04:00', cpu: 28, memory: 62, disk: 44, network: 18 },
  { time: '08:00', cpu: 45, memory: 72, disk: 47, network: 34 },
  { time: '12:00', cpu: 67, memory: 78, disk: 49, network: 56 },
  { time: '16:00', cpu: 56, memory: 74, disk: 48, network: 45 },
  { time: '20:00', cpu: 43, memory: 69, disk: 46, network: 32 },
];

const StatusCard = ({ title, status, value, icon: Icon, details, alert = false }: StatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg border ${alert ? 'border-red-200' : 'border-gray-200'} p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{value}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          <span className="capitalize">{status}</span>
        </div>
      </div>
      
      {details && (
        <div className="space-y-2">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-medium">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ title, value, change, icon: Icon, suffix = '', color = 'blue' }: {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  suffix?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}{suffix}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

const AlertCard = ({ alert }: { alert: SystemAlert }) => {
  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'info': return <Eye className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
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
    <div className={`border-l-4 ${getSeverityColor(alert.severity)} p-4 rounded-r-lg ${alert.resolved ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getAlertIcon(alert.type)}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm font-medium text-gray-900">{alert.message}</p>
              {alert.resolved && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Resolved
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{alert.service}</span>
              <span>{alert.timestamp}</span>
              <span className="capitalize">{alert.severity} severity</span>
            </div>
          </div>
        </div>
        {!alert.resolved && (
          <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
            Resolve
          </button>
        )}
      </div>
    </div>
  );
};

const APIEndpointCard = ({ endpoint }: { endpoint: {
  endpoint: string;
  requests: number;
  avgResponse: number;
  errorRate: number;
  status: 'healthy' | 'warning' | 'error';
}}) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 font-mono text-sm">{endpoint.endpoint}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(endpoint.status)}`}>
          {endpoint.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Requests</p>
          <p className="font-semibold">{endpoint.requests.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Avg Response</p>
          <p className="font-semibold">{endpoint.avgResponse}ms</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500">Error Rate</p>
          <div className="flex items-center space-x-2">
            <p className="font-semibold">{endpoint.errorRate}%</p>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${endpoint.errorRate > 1 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(endpoint.errorRate * 10, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminSystemHealth = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(true);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    if (realTimeMode) {
      const interval = setInterval(() => {
        // Simulate real-time updates
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [realTimeMode]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
          <p className="text-gray-600">Infrastructure monitoring and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={realTimeMode}
              onChange={(e) => setRealTimeMode(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Real-time updates</span>
          </label>
          <button
            onClick={handleRefresh}
            className={`p-2 text-gray-600 hover:text-gray-900 transition-colors ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Metrics</span>
          </button>
        </div>
      </div>

      {/* System Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="System Uptime"
          value={systemOverview.uptime}
          change={0.02}
          icon={Activity}
          color="green"
        />
        <MetricCard
          title="Active Users"
          value={systemOverview.activeUsers.toLocaleString()}
          change={12.5}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Response Time"
          value={systemOverview.responseTime}
          change={-8.3}
          suffix="ms"
          icon={Zap}
          color="yellow"
        />
        <MetricCard
          title="Error Rate"
          value={systemOverview.errorRate}
          change={-23.1}
          suffix="%"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusCard
          title="Web Servers"
          status={infrastructureHealth.webServers.status}
          value={`${infrastructureHealth.webServers.active}/${infrastructureHealth.webServers.count} active`}
          icon={Server}
          details={{
            'CPU Usage': `${infrastructureHealth.webServers.cpu}%`,
            'Memory Usage': `${infrastructureHealth.webServers.memory}%`,
            'Response Time': `${infrastructureHealth.webServers.responseTime}ms`
          }}
        />
        
        <StatusCard
          title="Database"
          status={infrastructureHealth.database.status}
          value={`${infrastructureHealth.database.connections} connections`}
          icon={Database}
          details={{
            'CPU Usage': `${infrastructureHealth.database.cpu}%`,
            'Memory Usage': `${infrastructureHealth.database.memory}%`,
            'Response Time': `${infrastructureHealth.database.responseTime}ms`,
            'Max Connections': infrastructureHealth.database.maxConnections
          }}
        />
        
        <StatusCard
          title="AI Service"
          status={infrastructureHealth.aiService.status}
          value={`${infrastructureHealth.aiService.predictions} predictions/day`}
          icon={Brain}
          details={{
            'Accuracy': `${infrastructureHealth.aiService.accuracy}%`,
            'CPU Usage': `${infrastructureHealth.aiService.cpu}%`,
            'Memory Usage': `${infrastructureHealth.aiService.memory}%`,
            'Response Time': `${infrastructureHealth.aiService.responseTime}s`
          }}
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time & Throughput */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#3B82F6" strokeWidth={2} name="Response Time (ms)" />
              <Line yAxisId="right" type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={2} name="Throughput (req/min)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resource Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={resourceUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, '']} />
              <Legend />
              <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="CPU" />
              <Area type="monotone" dataKey="memory" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Memory" />
              <Area type="monotone" dataKey="disk" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Disk" />
              <Area type="monotone" dataKey="network" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Network" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Storage & CDN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusCard
          title="Storage"
          status={infrastructureHealth.storage.status}
          value={`${infrastructureHealth.storage.used}GB / ${infrastructureHealth.storage.total}GB used`}
          icon={HardDrive}
          details={{
            'Usage': `${((infrastructureHealth.storage.used / infrastructureHealth.storage.total) * 100).toFixed(1)}%`,
            'IOPS': infrastructureHealth.storage.iops.toLocaleString(),
            'Bandwidth': `${infrastructureHealth.storage.bandwidth}MB/s`
          }}
          alert={infrastructureHealth.storage.status === 'warning'}
        />
        
        <StatusCard
          title="CDN"
          status={infrastructureHealth.cdn.status}
          value={`${infrastructureHealth.cdn.regions} regions active`}
          icon={Globe}
          details={{
            'Cache Hit Ratio': `${infrastructureHealth.cdn.cacheHitRatio}%`,
            'Bandwidth': `${infrastructureHealth.cdn.bandwidth}TB/month`,
            'Response Time': `${infrastructureHealth.cdn.responseTime}ms`
          }}
        />
      </div>

      {/* Security & API Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Threats Blocked</p>
                  <p className="text-sm text-green-700">Last 24 hours</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-900">{securityMetrics.threatsBlocked}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Failed Logins</p>
                <p className="font-semibold">{securityMetrics.failedLogins}</p>
              </div>
              <div>
                <p className="text-gray-500">2FA Adoption</p>
                <p className="font-semibold">{securityMetrics.twoFactorUsers}%</p>
              </div>
              <div>
                <p className="text-gray-500">SSL Certificate</p>
                <p className="font-semibold text-green-600">Valid</p>
              </div>
              <div>
                <p className="text-gray-500">Last Security Scan</p>
                <p className="font-semibold">{securityMetrics.lastSecurityScan}</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoint Health</h3>
          <div className="space-y-3">
            {apiEndpoints.slice(0, 4).map((endpoint, index) => (
              <APIEndpointCard key={index} endpoint={endpoint} />
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {systemAlerts.filter(a => !a.resolved).length} active alerts
            </span>
            <Bell className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSystemHealth;