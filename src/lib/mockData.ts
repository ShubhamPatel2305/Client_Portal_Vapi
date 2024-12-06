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
  callDistribution: { name: string; value: number }[];
  costAnalysis: { date: string; value: number }[];
  monthlyCallData: { date: string; value: number }[];
  recentCalls: Call[];
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
    cost: Number(faker.finance.amount(1, 50, 2)),
    userId: faker.string.uuid(),
  }));
};

// Generate mock analytics
const generateMockAnalytics = (): Analytics => {
  const calls = generateMockCalls(50);
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
  }));

  // Generate monthly data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlyCallData = months.map(month => ({
    date: `${month} 2024`,
    value: faker.number.int({ min: 100, max: 500 }),
  }));

  const costAnalysis = months.map(month => ({
    date: `${month} 2024`,
    value: faker.number.int({ min: 1000, max: 5000 }),
  }));

  return {
    totalCallMinutes: avgDuration * totalCalls,
    totalCallMinutesTrend: { value: faker.number.int({ min: -20, max: 20 }), label: 'vs last period' },
    numberOfCalls: totalCalls,
    numberOfCallsTrend: { value: faker.number.int({ min: -10, max: 10 }), label: 'vs last period' },
    totalSpent: totalCost,
    totalSpentTrend: { value: faker.number.int({ min: -15, max: 15 }), label: 'vs last period' },
    avgCostPerCall: totalCost / totalCalls,
    avgCostPerCallTrend: { value: faker.number.int({ min: -15, max: 15 }), label: 'vs last period' },
    callDistribution,
    costAnalysis,
    monthlyCallData,
    recentCalls: calls,
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