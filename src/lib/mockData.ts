import { faker } from '@faker-js/faker';

export interface Call {
  id: string;
  phoneNumber: string;
  duration: number;
  status: 'success' | 'failed' | 'pending';
  type: 'inbound' | 'outbound';
  timestamp: Date;
  notes?: string;
  cost: number;
  userId: string;
}

export interface Analytics {
  totalCallMinutes: number;
  totalCallMinutesTrend: { value: number; label: string };
  numberOfCalls: number;
  numberOfCallsTrend: { value: number; label: string };
  totalSpent: number;
  totalSpentTrend: { value: number; label: string };
  avgCostPerCall: number;
  avgCostPerCallTrend: { value: number; label: string };
  callDistribution: { name: string; value: number; color: string; trend: number; count: number }[];
  costAnalysis: { category: string; amount: number }[];
  monthlyCallData: { date: string; totalCalls: number; totalCost: number; calls: { callId: string; cost: number; duration: number; timestamp: string; status: 'success' | 'failed' | 'pending'; type: 'inbound' | 'outbound' }[] }[];
  recentCalls: Call[];
  regionalData: { name: string; value: number; color: string; trend: number; count: number }[];
}

// Generate mock calls
const generateMockCalls = (count: number): Call[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    timestamp: faker.date.recent(),
    phoneNumber: faker.phone.number(),
    duration: faker.number.int({ min: 30, max: 600 }),
    status: faker.helpers.arrayElement(['success', 'failed', 'pending'] as const),
    type: faker.helpers.arrayElement(['inbound', 'outbound'] as const),
    notes: faker.helpers.maybe(() => faker.lorem.sentence()),
    cost: Number(faker.finance.amount({ min: 1, max: 50, dec: 2 })),
    userId: faker.string.uuid(),
  }));
};

// Generate mock analytics
const generateMockAnalytics = (): Analytics => {
  const calls = generateMockCalls(100);
  const totalCalls = calls.length;
  const avgDuration = calls.reduce((sum, call) => sum + call.duration, 0) / totalCalls;
  const totalCost = calls.reduce((sum, call) => sum + call.cost, 0);

  // Calculate call distribution
  const statusCounts = calls.reduce((acc, call) => {
    acc[call.status] = (acc[call.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const callDistribution = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    value: (count / totalCalls) * 100,
    color: name === 'success' ? '#10B981' : name === 'failed' ? '#EF4444' : '#F59E0B',
    trend: faker.number.int({ min: -10, max: 10 }),
    count,
  }));

  // Generate monthly data with realistic trends
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseCallVolume = faker.number.int({ min: 300, max: 400 });
  const monthlyGrowth = faker.number.int({ min: 5, max: 15 });

  const monthlyCallData = months.map((month, index) => {
    const growth = 1 + (monthlyGrowth / 100) * index;
    const calls = Math.floor(baseCallVolume * growth);
    const avgCostPerCall = faker.number.float({ min: 8, max: 12, multipleOf: 0.01 });
    return {
      date: `${month} 2024`,
      totalCalls: calls,
      totalCost: calls * avgCostPerCall,
      // calls: calls.map(() => ({
      //   callId: faker.string.uuid(),
      //   cost: avgCostPerCall,
      //   duration: faker.number.int({ min: 120, max: 600 }),
      //   timestamp: faker.date.recent().toISOString(),
      //   status: faker.helpers.arrayElement(['success', 'failed', 'pending']),
      //   type: faker.helpers.arrayElement(['inbound', 'outbound']),
      // })),
    };
  });

  const costAnalysis = months.map((month, index) => ({
    category: `${month} 2024`,
    amount: monthlyCallData[index].totalCost,
  }));

  // Generate regional data
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa'];
  const regionalData = regions.map(region => ({
    name: region,
    value: faker.number.int({ min: 100, max: 1000 }),
    color: faker.helpers.arrayElement(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']),
    trend: faker.number.int({ min: -10, max: 10 }),
    count: faker.number.int({ min: 50, max: 200 }),
  }));

  // Calculate realistic trends
  const previousTotalMinutes = avgDuration * totalCalls * 0.9;
  const previousTotalCalls = totalCalls * 0.9;
  const previousTotalSpent = totalCost * 0.85;
  const previousAvgCost = previousTotalSpent / previousTotalCalls;

  return {
    totalCallMinutes: avgDuration * totalCalls,
    totalCallMinutesTrend: { value: ((avgDuration * totalCalls - previousTotalMinutes) / previousTotalMinutes) * 100, label: 'vs last period' },
    numberOfCalls: totalCalls,
    numberOfCallsTrend: { value: ((totalCalls - previousTotalCalls) / previousTotalCalls) * 100, label: 'vs last period' },
    totalSpent: totalCost,
    totalSpentTrend: { value: ((totalCost - previousTotalSpent) / previousTotalSpent) * 100, label: 'vs last period' },
    avgCostPerCall: totalCost / totalCalls,
    avgCostPerCallTrend: { value: ((totalCost / totalCalls - previousAvgCost) / previousAvgCost) * 100, label: 'vs last period' },
    callDistribution,
    costAnalysis,
    monthlyCallData,
    recentCalls: calls.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10),
    regionalData,
  };
};

// Reports mock data
export const reportsData = [
  {
    name: "Daily Performance Report",
    type: "Performance",
    date: new Date(2024, 0, 15),
    status: "completed"
  },
  {
    name: "Weekly Analytics Summary",
    type: "Analytics",
    date: new Date(2024, 0, 14),
    status: "completed"
  },
  {
    name: "Monthly User Activity",
    type: "User Activity",
    date: new Date(2024, 0, 13),
    status: "in_progress"
  },
  {
    name: "Regional Analysis Q4",
    type: "Regional",
    date: new Date(2024, 0, 12),
    status: "completed"
  },
  {
    name: "Cost Analysis Report",
    type: "Financial",
    date: new Date(2024, 0, 11),
    status: "completed"
  }
];

export const scheduledReports = [
  {
    name: "Daily Performance Summary",
    nextRun: new Date(2024, 0, 16),
    frequency: "daily"
  },
  {
    name: "Weekly Analytics Report",
    nextRun: new Date(2024, 0, 21),
    frequency: "weekly"
  },
  {
    name: "Monthly Business Review",
    nextRun: new Date(2024, 1, 1),
    frequency: "monthly"
  }
];

// Mock data service
class MockDataService {
  getCallHistory() {
    throw new Error("Method not implemented.");
  }
  private calls: Call[] = generateMockCalls(100);
  private analytics: Analytics = generateMockAnalytics();

  async getCalls(): Promise<Call[]> {
    return Promise.resolve(this.calls);
  }

  async getAnalytics(): Promise<Analytics> {
    return Promise.resolve(this.analytics);
  }

  async addCall(callData: Omit<Call, 'id' | 'timestamp' | 'cost'>): Promise<Call> {
    const newCall: Call = {
      id: faker.string.uuid(),
      timestamp: new Date(),
      cost: this.calculateCallCost(callData.duration),
      ...callData
    };
    this.calls.unshift(newCall);
    return Promise.resolve(newCall);
  }

  private calculateCallCost(duration: number): number {
    const ratePerMinute = 0.015;
    return Number((duration * ratePerMinute).toFixed(2));
  }
}

export const mockDataService = new MockDataService();