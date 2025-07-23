import { useState } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, Eye, Flag,
  Star, Clock, Camera,
  MoreHorizontal, Search,
  Download, Target, TrendingUp,
  Brain
} from 'lucide-react';
import type { QualityIssueCardProps, DisputeCardProps, AIInsightCardProps, MetricCardProps } from '@/types/admin';

// Mock quality control data
const qualityMetrics = {
  totalReviews: 2156,
  averageRating: 4.7,
  qualityIssues: 23,
  disputesResolved: 89,
  customerSatisfaction: 94.2,
  tailorCompliance: 96.8,
  responseTime: 2.3,
  escalationRate: 1.8
};

const qualityIssues = [
  {
    id: 'QI-001',
    orderId: 'ORD-2024-001234',
    customer: 'Sarah Johnson',
    tailor: 'Ahmed Hassan',
    issueType: 'Size Mismatch',
    severity: 'medium' as const,
    status: 'investigating' as const,
    reportedDate: '2024-06-09',
    description: 'Customer reports that the dress is too tight around the waist area despite providing accurate measurements.',
    images: ['measurement_issue_1.jpg', 'measurement_issue_2.jpg'],
    customerRating: 2,
    category: 'measurement',
    priority: 'high'
  },
  {
    id: 'QI-002',
    orderId: 'ORD-2024-001189',
    customer: 'Michael Chen',
    tailor: 'Maria Gonzalez',
    issueType: 'Material Quality',
    severity: 'low' as const,
    status: 'resolved' as const,
    reportedDate: '2024-06-07',
    resolvedDate: '2024-06-09',
    description: 'Customer concerned about fabric texture being different from sample.',
    resolution: 'Tailor provided detailed explanation of fabric variation. Customer satisfied with response.',
    customerRating: 4,
    category: 'materials',
    priority: 'medium'
  },
  {
    id: 'QI-003',
    orderId: 'ORD-2024-001198',
    customer: 'Emma Thompson',
    tailor: 'David Kim',
    issueType: 'Delayed Delivery',
    severity: 'high' as const,
    status: 'escalated' as const,
    reportedDate: '2024-06-05',
    description: 'Order is 5 days past promised delivery date with no communication from tailor.',
    customerRating: 1,
    category: 'delivery',
    priority: 'urgent'
  }
];

const disputes = [
  {
    id: 'DSP-001',
    orderId: 'ORD-2024-001156',
    customer: 'James Wilson',
    tailor: 'Priya Sharma',
    disputeType: 'Refund Request',
    amount: 450,
    status: 'pending_review',
    openedDate: '2024-06-08',
    reason: 'Significant deviation from agreed design specifications',
    evidence: ['original_design.pdf', 'received_product.jpg'],
    customerClaim: 'The received garment does not match the agreed design and specifications.',
    tailorResponse: 'Customer made multiple design changes during production which led to the final result.'
  },
  {
    id: 'DSP-002',
    orderId: 'ORD-2024-001178',
    customer: 'Lisa Rodriguez',
    tailor: 'Giovanni Rossi',
    disputeType: 'Quality Complaint',
    amount: 320,
    status: 'mediation',
    openedDate: '2024-06-06',
    reason: 'Poor stitching quality and loose threads',
    resolution: 'Tailor agreed to fix issues at no additional cost',
    mediatorNotes: 'Both parties agreed to repair solution. Monitoring completion.'
  }
];

const flaggedContent = [
  {
    id: 'FC-001',
    type: 'Inappropriate Review',
    content: 'Review contains offensive language targeting tailor personally',
    reporter: 'System Auto-Detection',
    flaggedDate: '2024-06-09',
    severity: 'medium',
    status: 'pending_review',
    targetUser: 'angry_customer_92',
    contentId: 'REV-001234'
  },
  {
    id: 'FC-002',
    type: 'Fake Portfolio',
    content: 'Portfolio images appear to be copied from other sources',
    reporter: 'Community Report',
    flaggedDate: '2024-06-08',
    severity: 'high',
    status: 'investigating',
    targetUser: 'fake_tailor_account',
    contentId: 'PORTFOLIO-5678'
  }
];

const aiQualityInsights = [
  {
    category: 'Measurement Accuracy',
    score: 95.7,
    trend: 'up' as const,
    issues: 12,
    improvement: 'AI model confidence increased by 2.3%'
  },
  {
    category: 'Communication Quality',
    score: 88.4,
    trend: 'stable' as const,
    issues: 8,
    improvement: 'Response time improved by 15 minutes'
  },
  {
    category: 'Material Selection',
    score: 92.1,
    trend: 'up' as const,
    issues: 5,
    improvement: 'Customer satisfaction with materials up 3.2%'
  },
  {
    category: 'Delivery Compliance',
    score: 87.6,
    trend: 'down' as const,
    issues: 18,
    improvement: 'Need to address delayed deliveries'
  }
];

const QualityMetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, subtitle, color = 'blue' }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 transform rotate-180" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

const QualityIssueCard: React.FC<QualityIssueCardProps> = ({ issue, onResolve, onEscalate }) => {
  const getSeverityColor = (severity: string): string => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">{issue.id}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
              {issue.severity} priority
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
              {issue.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{issue.issueType}</p>
          <p className="text-sm text-gray-500">
            Order: {issue.orderId} | {issue.customer} → {issue.tailor}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{issue.customerRating}/5</span>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-800">{issue.description}</p>
      </div>

      {issue.resolution && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Resolution:</strong> {issue.resolution}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500">Reported: {issue.reportedDate}</span>
          {issue.resolvedDate && (
            <span className="text-xs text-gray-500">Resolved: {issue.resolvedDate}</span>
          )}
          {issue.images && (
            <div className="flex items-center space-x-1">
              <Camera className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{issue.images.length} images</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {issue.status === 'investigating' && (
            <>
              <button
                onClick={() => onResolve(issue)}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
              >
                Resolve
              </button>
              <button
                onClick={() => onEscalate(issue)}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
              >
                Escalate
              </button>
            </>
          )}
          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const DisputeCard: React.FC<DisputeCardProps> = ({ dispute, onMediate, onResolve }) => {
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'mediation': return 'bg-blue-100 text-blue-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">{dispute.id}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
              {dispute.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{dispute.disputeType}</p>
          <p className="text-sm text-gray-500">
            {dispute.customer} vs {dispute.tailor} | ${dispute.amount}
          </p>
        </div>
        <span className="text-sm font-medium text-red-600">${dispute.amount}</span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Customer Claim:</p>
          <p className="text-sm text-gray-800">{dispute.customerClaim}</p>
        </div>
        
        {dispute.tailorResponse && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Tailor Response:</p>
            <p className="text-sm text-gray-800">{dispute.tailorResponse}</p>
          </div>
        )}

        {dispute.mediatorNotes && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-600 mb-1">Mediator Notes:</p>
            <p className="text-sm text-blue-800">{dispute.mediatorNotes}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">Opened: {dispute.openedDate}</span>
        
        <div className="flex space-x-2">
          {dispute.status === 'pending_review' && (
            <button
              onClick={() => onMediate(dispute)}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Mediation
            </button>
          )}
          {dispute.status === 'mediation' && (
            <button
              onClick={() => onResolve(dispute)}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
            >
              Resolve
            </button>
          )}
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight }) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default: return <Target className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">{insight.category}</h4>
        {getTrendIcon(insight.trend)}
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Quality Score</span>
          <span className="font-semibold text-blue-600">{insight.score}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Issues</span>
          <span className="font-semibold text-gray-900">{insight.issues}</span>
        </div>
      </div>
      
      <div className="p-2 bg-gray-50 rounded text-xs text-gray-700">
        {insight.improvement}
      </div>
    </div>
  );
};

const AdminQualityControl = () => {
  const [activeTab, setActiveTab] = useState('issues');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleResolveIssue = (issue: QualityIssueCardProps['issue']) => {
    console.log('Resolve issue:', issue);
  };

  const handleEscalateIssue = (issue: QualityIssueCardProps['issue']) => {
    console.log('Escalate issue:', issue);
  };

  const handleMediateDispute = (dispute: DisputeCardProps['dispute']) => {
    console.log('Start mediation:', dispute);
  };

  const handleResolveDispute = (dispute: DisputeCardProps['dispute']) => {
    console.log('Resolve dispute:', dispute);
  };

  const tabs = [
    { id: 'issues', name: 'Quality Issues', count: qualityIssues.length },
    { id: 'disputes', name: 'Disputes', count: disputes.length },
    { id: 'flagged', name: 'Flagged Content', count: flaggedContent.length },
    { id: 'ai-insights', name: 'AI Insights', count: aiQualityInsights.length }
  ];

  const renderQualityIssues = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search issues..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="investigating">Investigating</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {qualityIssues.map((issue) => (
          <QualityIssueCard
            key={issue.id}
            issue={issue}
            onResolve={handleResolveIssue}
            onEscalate={handleEscalateIssue}
          />
        ))}
      </div>
    </div>
  );

  const renderDisputes = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800">
            <span className="font-medium">{disputes.filter(d => d.status === 'pending_review').length} disputes</span> require immediate attention
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {disputes.map((dispute) => (
          <DisputeCard
            key={dispute.id}
            dispute={dispute}
            onMediate={handleMediateDispute}
            onResolve={handleResolveDispute}
          />
        ))}
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <p className="text-blue-800">
            AI-powered quality analysis provides insights to improve platform performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiQualityInsights.map((insight, index) => (
          <AIInsightCard key={index} insight={insight} />
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Address Delivery Delays</p>
              <p className="text-sm text-red-700">18 recent delivery issues detected. Consider implementing stricter timeline monitoring.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Eye className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Review Communication Templates</p>
              <p className="text-sm text-yellow-700">Communication quality score can be improved with better standardized responses.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Measurement Accuracy Improving</p>
              <p className="text-sm text-green-700">AI model updates have significantly improved measurement prediction accuracy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QualityMetricCard
          title="Overall Rating"
          value={qualityMetrics.averageRating.toFixed(1)}
          change={1.8}
          icon={Star}
          subtitle="Customer satisfaction"
          color="green"
        />
        <QualityMetricCard
          title="Active Issues"
          value={qualityMetrics.qualityIssues}
          change={-12.5}
          icon={AlertTriangle}
          subtitle="Requiring attention"
          color="yellow"
        />
        <QualityMetricCard
          title="Disputes Resolved"
          value={qualityMetrics.disputesResolved}
          change={15.3}
          icon={Shield}
          subtitle="This month"
          color="blue"
        />
        <QualityMetricCard
          title="Response Time"
          value={`${qualityMetrics.responseTime}h`}
          change={-8.2}
          icon={Clock}
          subtitle="Average resolution"
          color="green"
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'issues' && renderQualityIssues()}
      {activeTab === 'disputes' && renderDisputes()}
      {activeTab === 'flagged' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Flag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Flagged Content</h3>
          <p className="text-gray-600">Review and moderate inappropriate content and behavior</p>
        </div>
      )}
      {activeTab === 'ai-insights' && renderAIInsights()}
    </div>
  );
};

export default AdminQualityControl;