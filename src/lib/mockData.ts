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
  calls: never[];
  results: Array<{
    date: string;
    calls: number;
    cost: number;
  }>;
  totalCallMinutes: number;
  totalCallMinutesTrend: number;
  numberOfCalls: number;
  numberOfCallsTrend: number;
  totalSpent: number;
  totalSpentTrend: number;
  avgCostPerCall: number;
  avgCostPerCallTrend: number;
  monthlyTrend: Array<{
    date: string;
    calls: number;
    cost: number;
  }>;
  callDistribution: Array<{
    value: number;
    name: string;
    count: number;
    color: string;
    trend: string;
  }>;
  recentCalls: Array<{
    timestamp: string | number | Date;
    id: string;
    phoneNumber: string;
    type: string;
    status: string;
    duration: number;
    cost: number;
    date: string;
  }>;
  monthlyCallData: Array<{
    date: string;
    totalCalls: number;
    totalCost: number;
    calls: Array<{
      callId: string;
      cost: number;
      duration: number;
      timestamp: string;
      status: string;
      type: string;
    }>;
  }>;
  costAnalysis: Array<{
    name: string;
    value: number;
    date?: string;
  }>;
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
function generateMockAnalytics(): Analytics {
  const mockCalls = generateMockCalls(100);
  const now = new Date();
  
  return {
    calls: [],
    results: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      calls: Math.floor(Math.random() * 50),
      cost: Math.random() * 1000
    })),
    totalCallMinutes: 1234,
    totalCallMinutesTrend: 5.2,
    numberOfCalls: 567,
    numberOfCallsTrend: 3.1,
    totalSpent: 9876.54,
    totalSpentTrend: -2.3,
    avgCostPerCall: 17.42,
    avgCostPerCallTrend: 1.1,
    monthlyTrend: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(now.getFullYear(), now.getMonth() - i, 1).toISOString().split('T')[0],
      calls: Math.floor(Math.random() * 1000),
      cost: Math.random() * 5000
    })),
    callDistribution: [
      { value: 45, name: 'Success', count: 450, color: '#4CAF50', trend: '+5%' },
      { value: 35, name: 'Failed', count: 350, color: '#F44336', trend: '-2%' },
      { value: 20, name: 'Pending', count: 200, color: '#FFC107', trend: '+1%' }
    ],
    recentCalls: mockCalls.slice(0, 10).map(call => ({
      timestamp: call.timestamp,
      id: call.id,
      phoneNumber: call.phoneNumber,
      type: call.type,
      status: call.status,
      duration: call.duration,
      cost: call.cost,
      date: call.timestamp.toISOString().split('T')[0]
    })),
    monthlyCallData: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(now.getFullYear(), now.getMonth() - i, 1).toISOString().split('T')[0],
      totalCalls: Math.floor(Math.random() * 1000),
      totalCost: Math.random() * 5000,
      calls: mockCalls.slice(0, 5).map(call => ({
        callId: call.id,
        cost: call.cost,
        duration: call.duration,
        timestamp: call.timestamp.toISOString(),
        status: call.status,
        type: call.type
      }))
    })),
    costAnalysis: [
      { name: 'Voice', value: 40, date: '2022-01-01' },
      { name: 'Processing', value: 30 },
      { name: 'Storage', value: 30 }
    ]
  };
}

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