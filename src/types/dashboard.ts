export interface MonthlyStats {
  totalCalls: number;
  averageDuration: number;
  totalCost: number;
}

export interface MonthlyData {
  [key: string]: MonthlyStats;
}

export interface Analytics {
  monthlyData: MonthlyData;
  completedCalls: number;
  failedCalls: number;
  ongoingCalls: number;
  recentCalls: Array<{
    id: string;
    phoneNumber: string;
    status: string;
    startTime: string;
    duration: number;
    cost: number;
    endedReason?: string;
  }>;
  totalCallMinutes: number;
  totalCallMinutesTrend: number;
  numberOfCalls: number;
  numberOfCallsTrend: number;
  totalSpent: number;
  totalSpentTrend: number;
  avgCostPerCall: number;
  avgCostPerCallTrend: number;
}
