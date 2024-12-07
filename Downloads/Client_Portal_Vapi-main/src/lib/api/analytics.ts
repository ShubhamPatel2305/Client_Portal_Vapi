import { mockDataService } from '../services/mockData';

// Mock data for trends
const generateTrendData = () => {
  const data = [];
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
const distributionData = [
  { name: 'Inbound', value: 35 },
  { name: 'Outbound', value: 45 },
  { name: 'Automated', value: 20 }
];

export const analyticsApi = {
  getDashboardData: async () => {
    const calls = await mockDataService.getCalls();
    const analytics = await mockDataService.getAnalytics();

    return {
      totalCalls: calls.length,
      avgCallDuration: calls.reduce((acc, call) => acc + call.duration, 0) / calls.length,
      totalCost: calls.reduce((acc, call) => acc + call.cost, 0),
      activeUsers: 25,
      trends: generateTrendData(),
      distribution: distributionData,
      recentCalls: calls.slice(0, 5)
    };
  },

  getAnalyticsData: async () => {
    return {
      trends: generateTrendData(),
      distribution: distributionData,
      performance: {
        successRate: 95,
        avgResponseTime: 2.3,
        satisfaction: 4.8
      }
    };
  }
};