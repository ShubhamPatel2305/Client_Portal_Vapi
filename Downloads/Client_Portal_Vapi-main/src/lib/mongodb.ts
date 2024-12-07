import { faker } from '@faker-js/faker';

// Types
export interface Call {
  _id: string;
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
  _id: string;
  date: Date;
  metrics: {
    totalCalls: number;
    avgDuration: number;
    successRate: number;
    costPerCall: number;
  };
  trends: {
    hourly: Array<{ hour: number; calls: number }>;
    daily: Array<{ date: Date; calls: number }>;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  lastActive: Date;
}

// Mock data generator
class MockDB {
  private calls: Call[] = [];
  private analytics: Analytics[] = [];
  private users: User[] = [];

  constructor() {
    this.generateMockData();
  }

  private generateMockData() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    // Generate calls
    this.calls = Array.from({ length: 100 }, () => ({
      _id: faker.string.uuid(),
      phoneNumber: faker.phone.number(),
      duration: faker.number.int({ min: 30, max: 600 }),
      status: faker.helpers.arrayElement(['success', 'failed', 'pending']),
      type: faker.helpers.arrayElement(['inbound', 'outbound']),
      timestamp: faker.date.between({ from: thirtyDaysAgo, to: now }),
      notes: faker.helpers.maybe(() => faker.lorem.sentence()),
      cost: faker.number.float({ min: 0.5, max: 10, precision: 0.01 }),
      userId: faker.string.uuid()
    }));

    // Generate analytics
    this.analytics = [{
      _id: faker.string.uuid(),
      date: now,
      metrics: {
        totalCalls: this.calls.length,
        avgDuration: this.calls.reduce((acc, call) => acc + call.duration, 0) / this.calls.length,
        successRate: (this.calls.filter(call => call.status === 'success').length / this.calls.length) * 100,
        costPerCall: this.calls.reduce((acc, call) => acc + call.cost, 0) / this.calls.length
      },
      trends: {
        hourly: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          calls: faker.number.int({ min: 5, max: 50 })
        })),
        daily: Array.from({ length: 7 }, () => ({
          date: faker.date.between({ from: sevenDaysAgo, to: now }),
          calls: faker.number.int({ min: 50, max: 200 })
        }))
      }
    }];

    // Generate users
    this.users = Array.from({ length: 10 }, () => ({
      _id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['admin', 'user', 'manager']),
      lastActive: faker.date.between({ from: thirtyDaysAgo, to: now })
    }));
  }

  async getCalls(): Promise<Call[]> {
    return Promise.resolve([...this.calls]);
  }

  async getAnalytics(): Promise<Analytics | null> {
    return Promise.resolve(this.analytics[0]);
  }

  async getUsers(): Promise<User[]> {
    return Promise.resolve([...this.users]);
  }

  async addCall(call: Omit<Call, '_id'>): Promise<Call> {
    const newCall = {
      _id: faker.string.uuid(),
      ...call
    };
    this.calls.unshift(newCall);
    return Promise.resolve(newCall);
  }

  async updateAnalytics(analytics: Omit<Analytics, '_id'>): Promise<Analytics> {
    const newAnalytics = {
      _id: faker.string.uuid(),
      ...analytics
    };
    this.analytics = [newAnalytics];
    return Promise.resolve(newAnalytics);
  }
}

export const mongodb = new MockDB();