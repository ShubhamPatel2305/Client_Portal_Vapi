import { MongoClient, ObjectId, Db } from 'mongodb';

class MongoDB {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017');
      this.db = this.client.db(process.env.MONGODB_DB || 'vapi_portal');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}

export const mongodb = new MongoDB();

export interface Call {
  _id?: ObjectId;
  phoneNumber: string;
  duration: number;
  status: 'success' | 'failed' | 'pending';
  type: 'inbound' | 'outbound';
  timestamp: Date;
  notes?: string;
  cost: number;
  userId: string;
}

export interface DashboardData {
  totalCalls: number;
  avgCallDuration: number;
  totalCost: number;
  activeUsers: number;
  recentActivities: Call[];
  callTypes: { type: string; value: number }[];
  monthlyCallData: { month: string; calls: number; avgDuration: number }[];
  callQualityMetrics: {
    successRate: number;
    failureRate: number;
    totalCalls: number;
  };
}

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const db = mongodb.getDb();
    const calls = db.collection<Call>('calls');

    const [totalCalls, recentCalls, callTypes, monthlyData] = await Promise.all([
      calls.countDocuments(),
      calls.find().sort({ timestamp: -1 }).limit(10).toArray(),
      calls.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]).toArray(),
      calls.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$timestamp' },
              year: { $year: '$timestamp' }
            },
            calls: { $sum: 1 },
            avgDuration: { $avg: '$duration' }
          }
        }
      ]).toArray()
    ]);

    const activeUsers = await db.collection('users').countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });

    const callQualityMetrics = await calls.aggregate([
      {
        $group: {
          _id: null,
          totalCalls: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          },
          failureCount: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          }
        }
      }
    ]).toArray();

    const metrics = callQualityMetrics[0] || { totalCalls: 0, successCount: 0, failureCount: 0 };
    const successRate = metrics.totalCalls > 0 ? (metrics.successCount / metrics.totalCalls) * 100 : 0;
    const failureRate = metrics.totalCalls > 0 ? (metrics.failureCount / metrics.totalCalls) * 100 : 0;

    return {
      totalCalls,
      avgCallDuration: recentCalls.reduce((acc: number, call: Call) => acc + call.duration, 0) / (recentCalls.length || 1),
      totalCost: recentCalls.reduce((acc: number, call: Call) => acc + call.cost, 0),
      activeUsers,
      recentActivities: recentCalls,
      callTypes: callTypes.map(type => ({
        type: type._id as string,
        value: type.count as number
      })),
      monthlyCallData: monthlyData.map(data => ({
        month: `${data._id.year}-${String(data._id.month).padStart(2, '0')}`,
        calls: data.calls,
        avgDuration: data.avgDuration
      })),
      callQualityMetrics: {
        successRate,
        failureRate,
        totalCalls: metrics.totalCalls
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export async function addNewCall(callData: Omit<Call, '_id' | 'timestamp' | 'cost'>): Promise<Call> {
  try {
    const db = mongodb.getDb();
    const calls = db.collection<Call>('calls');

    const newCall: Call = {
      ...callData,
      timestamp: new Date(),
      cost: calculateCallCost(callData.duration)
    };

    const result = await calls.insertOne(newCall);
    return { ...newCall, _id: result.insertedId };
  } catch (error) {
    console.error('Error adding new call:', error);
    throw error;
  }
}

export async function updateCall(id: string, updates: Partial<Call>): Promise<Call | null> {
  try {
    const db = mongodb.getDb();
    const calls = db.collection<Call>('calls');

    const result = await calls.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result || null;
  } catch (error) {
    console.error('Error updating call:', error);
    throw error;
  }
}

function calculateCallCost(duration: number): number {
  const COST_PER_MINUTE = 0.015;
  return duration * COST_PER_MINUTE;
}