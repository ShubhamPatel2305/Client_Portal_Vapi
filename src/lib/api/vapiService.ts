import axios from 'axios';
import { VapiClient } from "@vapi-ai/server-sdk";
import { getApiKey } from '../../services/credentialsService';

const VAPI_BASE_URL = 'https://api.vapi.ai';
const VAPI_API_KEY = import.meta.env.VITE_VAPI_API_KEY;

// import { getApiKey } from './credentialsService';

const getHeaders = () => ({
  'Authorization': `Bearer ${getApiKey()}`,
  'Content-Type': 'application/json'
});

const vapiClient = axios.create({
  baseURL: VAPI_BASE_URL,
  headers: getHeaders()
});

export interface Call {
  timestamp: Date;
  id: string;
  phoneNumber: string;
  duration: number;
  status: "success" | "failed" | "pending";
  type: "inbound" | "outbound";
  notes?: string;
  cost: number;
  userId: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
  date?: string;
}

export interface TrendData {
  value: number;
  label: string;
}

export interface MonthlyCallData {
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
}

export interface Analytics {
  results: AnalyticsResult[];
  totalCallMinutes: number;
  totalCallMinutesTrend: number;
  numberOfCalls: number;
  numberOfCallsTrend: number;
  totalSpent: number;
  totalSpentTrend: number;
  avgCostPerCall: number;
  avgCostPerCallTrend: number;
  monthlyTrend: MonthlyTrend[];
  callDistribution: CallDistribution[];
  recentCalls: RecentCall[];
  monthlyCallData: MonthlyCallData[];
  costAnalysis: ChartDataItem[];
}

export interface AnalyticsResult {
  date: string;
  calls: number;
  cost: number;
}

export interface MonthlyTrend {
  date: string;
  calls: number;
  cost: number;
}

export interface CallDistribution {
  name: string;
  count: number;
  color: string;
  trend: string;
}

export interface RecentCall {
  id: string;
  phoneNumber: string;
  type: string;
  status: string;
  duration: number;
  cost: number;
  date: string;
}

export interface CallData {
  id: string;
  type: string;
  startedAt: string;
  endedAt: string;
  cost: number;
  status: string;
  endedReason?: string;
  costBreakdown?: {
    transport: number;
    stt: number;
    llm: number;
    tts: number;
    vapi: number;
    total: number;
  };
  duration: number;
  createdAt: string;
}

export const vapiService = {
  async getAnalytics(startDate?: Date, endDate?: Date): Promise<Analytics> {
    try {
      const now = new Date();
      const defaultStartDate = startDate || new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000)); // 30 days ago
      const defaultEndDate = endDate || now;

      const { data } = await vapiClient.post('/analytics', {
        queries: [
          {
            table: "call",
            name: "current_total_duration",
            operations: [{ operation: "sum", column: "duration" }],
            timeRange:{
              start: new Date(now.getTime()-(180 * 24 * 60 * 60 * 1000)).toISOString(),
              end: now.toISOString()
            }
          },
          {
            table: "call",
            name: "previous_total_duration",
            operations: [{ operation: "sum", column: "duration" }],
            timeRange: {
              start: new Date(defaultStartDate.getTime() - (180 * 24 * 60 * 60 * 1000)).toISOString(),
              end: now.toISOString()
            }
          },
          {
            table: "call",
            name: "current_calls_count",
            operations: [{ operation: "count", column: "id" }],
            timeRange:{
              start: new Date(now.getTime()-(180 * 24 * 60 * 60 * 1000)).toISOString(),
              end: now.toISOString()
            }
          },
          {
            table: "call",
            name: "previous_calls_count",
            operations: [{ operation: "count", column: "id" }],
            timeRange: {
              start: new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000)).toISOString(),
              end: now.toISOString()
            }
          },
          {
            table: "call",
            name: "current_total_cost",
            operations: [{ operation: "sum", column: "cost" }],
            timeRange:{
              start: new Date(now.getTime()-(180 * 24 * 60 * 60 * 1000)).toISOString(),
              end: now.toISOString()
            }
          },
          {
            table: "call",
            name: "previous_total_cost",
            operations: [{ operation: "sum", column: "cost" }],
            timeRange: {
              start: new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000)).toISOString(),
              end: now.toISOString()
            }
          },
          {
            table: "call",
            name: "calls_by_status",
            operations: [{ operation: "count", column: "id" }],
            groupBy: ["status"],
            timeRange:{
              start: new Date(now.getTime()-(180 * 24 * 60 * 60 * 1000)).toISOString(),
              end: now.toISOString()
            }
          },
          {
            table: "call",
            name: "monthly_calls",
            operations: [{ operation: "count", column: "id" }],
            timeRange: {
              step: "month",
              start: defaultStartDate.toISOString(),
              end: defaultEndDate.toISOString()
            }
          },
          {
            table: "call",
            name: "monthly_costs",
            operations: [{ operation: "sum", column: "cost" }],
            timeRange: {
              step: "month",
              start: defaultStartDate.toISOString(),
              end: defaultEndDate.toISOString()
            }
          }
        ]
      });

      // Extract current period data
      const currentDuration = data.find((item: any) => item.name === 'current_total_duration')?.result[0]?.sumDuration || 0;
      const currentCalls = parseInt(data.find((item: any) => item.name === 'current_calls_count')?.result[0]?.countId || '0');
      const currentCost = parseFloat(data.find((item: any) => item.name === 'current_total_cost')?.result[0]?.sumCost || '0');

      // Extract previous period data
      const previousDuration = data.find((item: any) => item.name === 'previous_total_duration')?.result[0]?.sumDuration || 0;
      const previousCalls = parseInt(data.find((item: any) => item.name === 'previous_calls_count')?.result[0]?.countId || '0');
      const previousCost = parseFloat(data.find((item: any) => item.name === 'previous_total_cost')?.result[0]?.sumCost || '0');

      // Calculate trends
      const calculateTrend = (current: number, previous: number) => 
        previous ? ((current - previous) / previous) * 100 : 0;

      // Use the raw duration value directly (no need to divide by 60 as it's already in minutes)
      const totalCallMinutes = currentDuration;
      const totalCallMinutesTrend = calculateTrend(currentDuration, previousDuration);
      
      const numberOfCallsTrend = calculateTrend(currentCalls, previousCalls);
      
      const totalSpentTrend = calculateTrend(currentCost, previousCost);
      
      const currentAvgCost = currentCalls ? currentCost / currentCalls : 0;
      const previousAvgCost = previousCalls ? previousCost / previousCalls : 0;
      const avgCostPerCallTrend = calculateTrend(currentAvgCost, previousAvgCost);

      // Process other data
      const monthlyCallData = data.find((item: any) => item.name === 'monthly_calls')?.result.map((item: any) => {
        const costItem = data.find((dataItem: any) => dataItem.name === 'monthly_costs')?.result
          .find((costItem: any) => costItem.date === item.date);
        
        return {
          date: item.date.substring(0, 7), // Format: YYYY-MM
          totalCalls: parseInt(item.countId) || 0,
          totalCost: parseFloat(costItem?.sumCost || '0'),
          calls: []
        };
      }) || [];

      const costAnalysis = data.find((item: any) => item.name === 'monthly_costs')?.result.map((item: any) => ({
        category: item.date.substring(0, 7), // Format: YYYY-MM
        amount: parseFloat(item.sumCost) || 0
      })) || [];

      const callDistribution = data.find((item: any) => item.name === 'calls_by_status')?.result.map((item: any) => ({
        name: item.status,
        value: (parseInt(item.countId) / currentCalls) * 100,
        color: item.status === 'success' ? '#10B981' : item.status === 'failed' ? '#EF4444' : '#6B7280',
        trend: '',
        count: parseInt(item.countId) || 0
      })) || [];

      return {
        results: [],
        totalCallMinutes,
        totalCallMinutesTrend,
        numberOfCalls: currentCalls,
        numberOfCallsTrend,
        totalSpent: currentCost,
        totalSpentTrend,
        avgCostPerCall: currentAvgCost,
        avgCostPerCallTrend,
        monthlyTrend: monthlyCallData.map(item => ({
          date: item.date,
          calls: item.totalCalls,
          cost: item.totalCost
        })),
        monthlyCallData,
        costAnalysis,
        callDistribution,
        recentCalls: []
      };
    } catch (error) {
      console.error('Error fetching Vapi analytics:', error);
      throw error;
    }
  },
  async fetchDashboardData(): Promise<Analytics> {
    try {
      const response = await vapiClient.get('/dashboard/analytics');
      
      if (!response.data) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = response.data;

      // Ensure monthlyCallData is consistent with numberOfCalls
      const monthlyCallData: MonthlyCallData[] = data.monthlyCallData || [];
      const totalCalls = monthlyCallData.reduce((sum: number, month: MonthlyCallData) => 
        sum + month.totalCalls, 0);
      
      // If the total calls don't match numberOfCalls, adjust the data
      if (totalCalls !== data.numberOfCalls) {
        const adjustmentFactor = data.numberOfCalls / totalCalls;
        monthlyCallData.forEach((month: MonthlyCallData) => {
          month.totalCalls = Math.round(month.totalCalls * adjustmentFactor);
          month.totalCost = month.totalCost * adjustmentFactor;
        });
      }

      // Calculate total spent and average cost with proper types
      const totalSpent = monthlyCallData.reduce((sum: number, month: MonthlyCallData) => 
        sum + month.totalCost, 0);
      
      const avgCostPerCall = data.numberOfCalls > 0 
        ? monthlyCallData.reduce((sum: number, month: MonthlyCallData) => 
            sum + month.totalCost, 0) / data.numberOfCalls 
        : 0;

      return {
        results: [],
        monthlyCallData,
        callDistribution: data.callDistribution || [],
        costAnalysis: data.costAnalysis || [],
        monthlyTrend: data.monthlyTrend || [],
        recentCalls: data.recentCalls || [],
        totalSpent,
        avgCostPerCall,
        totalCallMinutes: 0,
        totalCallMinutesTrend: 0,
        numberOfCalls: data.numberOfCalls,
        numberOfCallsTrend: 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },
  async getCalls(startDate?: Date, endDate?: Date): Promise<CallData[]> {
    try {
      const client = new VapiClient({ token: import.meta.env.VITE_VAPI_API_KEY || "" });
      const response = await client.calls.list({
        createdAtGe: startDate?.toISOString(),
        createdAtLe: endDate?.toISOString(),
      });

      return (response || []).map((call: any) => ({
        id: call.id || '',
        type: call.type || '',
        startedAt: call.startedAt || call.createdAt || new Date().toISOString(),
        endedAt: call.endedAt || call.createdAt || new Date().toISOString(),
        cost: call.costBreakdown?.total || 0,
        status: call.status || 'unknown',
        endedReason: call.endedReason,
        costBreakdown: call.costBreakdown || {
          transport: 0,
          stt: 0,
          llm: 0,
          tts: 0,
          vapi: 0,
          total: 0
        },
        duration: call.startedAt && call.endedAt ? 
          Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000) : 0,
        createdAt: call.createdAt || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching calls:', error);
      // Return empty array instead of throwing to handle API errors gracefully
      return [];
    }
  }
};
