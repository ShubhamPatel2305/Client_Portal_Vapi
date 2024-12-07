import { MongoClient, Db } from 'mongodb';

// Simulated data for development
export const mockData = {
  calls: [
    { id: 1, duration: 320, cost: 4.80, status: 'completed', timestamp: new Date() },
    { id: 2, duration: 180, cost: 2.70, status: 'completed', timestamp: new Date() },
    { id: 3, duration: 240, cost: 3.60, status: 'failed', timestamp: new Date() }
  ],
  usage: {
    current: 3800,
    limit: 5000,
    lastUpdated: new Date()
  },
  billing: {
    currentPlan: 'pro',
    nextBilling: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    lastPayment: {
      amount: 79.00,
      date: new Date(),
      status: 'paid'
    }
  }
};

class MongoService {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(uri: string): Promise<void> {
    if (!this.client) {
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db();
      console.log('Connected to MongoDB');
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('Disconnected from MongoDB');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db;
  }

  // For development, return mock data
  async getCallStats() {
    return {
      total: mockData.calls.length,
      completed: mockData.calls.filter(call => call.status === 'completed').length,
      failed: mockData.calls.filter(call => call.status === 'failed').length,
      totalCost: mockData.calls.reduce((acc, call) => acc + call.cost, 0)
    };
  }

  async getUsageData() {
    return mockData.usage;
  }

  async getBillingInfo() {
    return mockData.billing;
  }
}

export const mongoService = new MongoService();