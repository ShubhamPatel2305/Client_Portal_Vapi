import { mockDataService, type Call } from '../services/mockData';

// Mock data for trends
interface TrendData {
  date: string;
  calls: number;
  duration: number;
}

const generateTrendData = (): TrendData[] => {
  const data: TrendData[] = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      calls: Math.floor(Math.random() * 100) + 50,
      duration: Math.floor(Math.random() * 10) + 2
    });
  }
  return data;
};

// Mock data for distribution
interface DistributionData {
  name: string;
  value: number;
}

const distributionData: DistributionData[] = [
  { name: 'Inbound', value: 35 },
  { name: 'Outbound', value: 45 },
  { name: 'Automated', value: 20 }
];

export const analyticsApi = {
  getDashboardData: async () => {
    const calls = await mockDataService.getCalls();

    return {
      totalCalls: calls.length,
      avgCallDuration: calls.reduce((acc: number, call: Call) => acc + call.duration, 0) / calls.length,
      totalCost: calls.reduce((acc: number, call: Call) => acc + call.cost, 0),
      activeUsers: 25,
      trends: generateTrendData(),
      distribution: distributionData,
      recentCalls: calls.slice(0, 5)
    };
  },

  getAnalyticsData: async () => {
    const calls = await mockDataService.getCalls();
    return {
      trends: generateTrendData(),
      distribution: distributionData,
      performance: {
        successRate: (calls.filter(call => call.status === 'completed').length / calls.length) * 100,
        avgResponseTime: 2.3,
        satisfaction: 4.8
      }
    };
  }
};