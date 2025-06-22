export interface PlatformMetrics {
  totalUsers: number;
  totalTailors: number;
  totalCustomers: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  monthlyGrowth: number;
  averageOrderValue: number;
  customerSatisfaction: number;
  platformUptime: number;
}

export interface QualityIssue {
  id: string;
  orderId: string;
  customer: string;
  tailor: string;
  issueType: string;
  severity: 'low' | 'medium' | 'high';
  status: 'investigating' | 'resolved' | 'escalated';
  reportedDate: string;
  description: string;
  customerRating: number;
  category: string;
  priority: string;
  resolvedDate?: string;
  resolution?: string;
  images?: string[];
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  responseTime: number;
  errorRate: number;
  throughput: number;
  activeUsers: number;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  suffix?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export interface SystemAlert {
  id: number;
  type: 'warning' | 'info' | 'error' | 'success';
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  service: string;
  resolved: boolean;
}

export interface AlertProps {
  alert: SystemAlert;
}

export interface SystemStatusData {
  status: 'healthy' | 'warning' | 'error';
  responseTime: string;
  uptime: string;
  [key: string]: string | number;
}

export interface SystemStatusCardProps {
  name: string;
  data: SystemStatusData;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface StatusCardProps {
  title: string;
  status: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  details?: Record<string, unknown>;
  alert?: boolean;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  joinDate: string;
  lastActive: string;
  orders: number;
  totalSpent?: number;
  totalEarned?: number;
  rating?: number;
  location: string;
  phone: string;
  verified: boolean;
  specialties?: string[];
  businessName?: string;
}

export interface UserCardProps {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
  onSuspend: (user: AdminUser) => void;
  onVerify: (user: AdminUser) => void;
}

export interface AdminVerification {
  id: number;
  name: string;
  email: string;
  role: string;
  submitDate: string;
  documents: string[];
  specialties: string[];
  businessName: string;
  location: string;
}

export interface VerificationCardProps {
  verification: AdminVerification;
  onApprove: (verification: AdminVerification) => void;
  onReject: (verification: AdminVerification) => void;
}

export interface TailorRankingCardProps {
  tailor: {
    id: number;
    name: string;
    orders: number;
    revenue: number;
    rating: number;
    completionRate: number;
    avgDelivery: number;
    location: string;
  };
  rank: number;
}

export interface RecentOrderCardProps {
  order: {
    id: string;
    customer: string;
    tailor: string;
    garmentType: string;
    value: number;
    status: string;
    orderDate: string;
    estimatedDelivery?: string;
    deliveredDate?: string;
    location: string;
  };
}

export interface QualityIssueCardProps {
  issue: QualityIssue;
  onResolve: (issue: QualityIssue) => void;
  onEscalate: (issue: QualityIssue) => void;
}

export interface AdminDispute {
  id: string;
  orderId: string;
  customer: string;
  tailor: string;
  disputeType: string;
  amount: number;
  status: string;
  openedDate: string;
  reason: string;
  evidence?: string[];
  customerClaim?: string;
  tailorResponse?: string;
  resolution?: string;
  mediatorNotes?: string;
}

export interface DisputeCardProps {
  dispute: AdminDispute;
  onMediate: (dispute: AdminDispute) => void;
  onResolve: (dispute: AdminDispute) => void;
}

export interface AIInsightCardProps {
  insight: {
    category: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
    issues: number;
    improvement: string;
  };
}

export interface APIEndpointData {
  endpoint: string;
  requests: number;
  avgResponse: number;
  errorRate: number;
  status: 'healthy' | 'warning' | 'error';
}

export interface APIEndpointCardProps {
  endpoint: APIEndpointData;
}