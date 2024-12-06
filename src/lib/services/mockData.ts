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
  totalCalls: number;
  avgDuration: number;
  successRate: number;
  costPerCall: number;
  trends: {
    hourly: Array<{ hour: number; calls: number }>;
    daily: Array<{ date: Date; calls: number }>;
  };
}

class MockDataService {
  private calls: Call[] = [];
  private analytics: Analytics;

  constructor() {
    this.generateMockData();
  }

  private generateMockData() {
    // Generate mock calls
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    this.calls = Array.from({ length: 100 }, () => ({
      id: faker.string.uuid(),
      phoneNumber: faker.phone.number(),
      duration: faker.number.int({ min: 30, max: 600 }),
      status: faker.helpers.arrayElement(['success', 'failed', 'pending']),
      type: faker.helpers.arrayElement(['inbound', 'outbound']),
      timestamp: faker.date.between({ from: thirtyDaysAgo, to: now }),
      notes: faker.helpers.maybe(() => faker.lorem.sentence()),
      cost: faker.number.float({ min: 0.5, max: 10, precision: 0.01 }),
      userId: faker.string.uuid()
    }));

    // Generate mock analytics
    this.analytics = {
      totalCalls: this.calls.length,
      avgDuration: this.calls.reduce((acc, call) => acc + call.duration, 0) / this.calls.length,
      successRate: (this.calls.filter(call => call.status === 'success').length / this.calls.length) * 100,
      costPerCall: this.calls.reduce((acc, call) => acc + call.cost, 0) / this.calls.length,
      trends: {
        hourly: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          calls: faker.number.int({ min: 5, max: 50 })
        })),
        daily: Array.from({ length: 30 }, () => ({
          date: faker.date.between({ from: thirtyDaysAgo, to: now }),
          calls: faker.number.int({ min: 50, max: 200 })
        }))
      }
    };
  }

  async getCalls(): Promise<Call[]> {
    return Promise.resolve([...this.calls]);
  }

  async getAnalytics(): Promise<Analytics> {
    return Promise.resolve({ ...this.analytics });
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
    const COST_PER_MINUTE = 0.015;
    return Number((duration * COST_PER_MINUTE).toFixed(2));
  }
}

export const mockDataService = new MockDataService();