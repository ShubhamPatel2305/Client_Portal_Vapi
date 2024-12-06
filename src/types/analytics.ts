export interface AnalyticsDataPoint {
  timestamp: string;
  callCount: number;
  avgDuration: number;
  totalCost: number;
  activeUsers: number;
}

export interface CallMetrics {
  successRate: number;
  avgResponseTime: number;
  responseTimeTrend: number;
  peakTime: string;
  performanceData: {
    timestamp: string;
    responseTime: number;
    errorRate: number;
  }[];
  errorBreakdown: {
    type: string;
    count: number;
  }[];
  typeDistribution: {
    type: string;
    value: number;
  }[];
  hourlyDistribution: {
    hour: string;
    count: number;
  }[];
}

export interface UserMetrics {
  satisfaction: number;
  satisfactionTrend: number;
  engagementData: {
    category: string;
    value: number;
  }[];
}

export interface RegionalData {
  region: string;
  value: number;
  trend: number;
}
