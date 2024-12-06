import { mongodb } from './mongodb';
import { ObjectId } from 'mongodb';

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

export async function fetchDashboardData(): Promise<DashboardData[]> {
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
            totalDuration: { $sum: '$duration' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]).toArray()
    ]);

    const avgDuration = recentCalls.reduce((acc, call) => acc + call.duration, 0) / recentCalls.length;
    const totalCost = recentCalls.reduce((acc, call) => acc + call.cost, 0);
    const uniqueUsers = new Set(recentCalls.map(call => call.userId)).size;

    const successfulCalls = recentCalls.filter(call => call.status === 'success').length;
    const failedCalls = recentCalls.filter(call => call.status === 'failed').length;

    const processedData: DashboardData = {
      totalCalls,
      avgCallDuration: avgDuration || 0,
      totalCost,
      activeUsers: uniqueUsers,
      recentActivities: recentCalls,
      callTypes: callTypes.map(type => ({
        type: type._id,
        value: type.count
      })),
      monthlyCallData: monthlyData.map(data => ({
        month: new Date(0, data._id.month - 1).toLocaleString('default', { month: 'short' }),
        calls: data.calls,
        avgDuration: data.totalDuration / data.calls
      })),
      callQualityMetrics: {
        successRate: (successfulCalls / recentCalls.length) * 100,
        failureRate: (failedCalls / recentCalls.length) * 100,
        totalCalls
      }
    };

    return [processedData];
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

    return result;
  } catch (error) {
    console.error('Error updating call:', error);
    throw error;
  }
}

function calculateCallCost(duration: number): number {
  const COST_PER_MINUTE = 0.015;
  return duration * COST_PER_MINUTE;
}