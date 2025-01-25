interface Call {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  type: 'inbound' | 'outbound' | 'automated';
  status: 'completed' | 'failed' | 'in-progress';
  caller: string;
  recipient: string;
  notes?: string;
}

interface Analytics {
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
    value: number;
    label: string;
  }>;
}

// Generate random mock calls
const generateMockCalls = (): Call[] => {
  const calls: Call[] = [];
  const now = new Date();
  const types: Array<'inbound' | 'outbound' | 'automated'> = ['inbound', 'outbound', 'automated'];
  const statuses: Array<'completed' | 'failed' | 'in-progress'> = ['completed', 'failed', 'in-progress'];

  for (let i = 0; i < 100; i++) {
    const startTime = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const duration = Math.floor(Math.random() * 600) + 60; // 1-10 minutes
    const endTime = new Date(startTime.getTime() + duration * 1000);

    calls.push({
      id: `call-${i + 1}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      cost: Math.round(duration * 0.002 * 100) / 100, // $0.002 per second
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      caller: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      recipient: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      notes: Math.random() > 0.5 ? 'Some notes about the call' : undefined
    });
  }

  return calls.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

// Mock data service
export const mockDataService = {
  getCalls: async (): Promise<Call[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockCalls();
  },

  addCall: async (callData: Partial<Call>): Promise<Call> => {
    const newCall: Call = {
      id: Math.random().toString(36).substring(7),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: 0,
      cost: 0,
      type: 'outbound',
      status: 'completed',
      caller: '',
      recipient: '',
      ...callData
    };
    return Promise.resolve(newCall);
  },

  getAnalytics: async (): Promise<Analytics> => {
    const mockCalls = generateMockCalls();
    const now = new Date();
    
    return Promise.resolve({
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
        timestamp: call.startTime,
        id: call.id,
        phoneNumber: call.caller,
        type: call.type,
        status: call.status,
        duration: call.duration,
        cost: call.cost,
        date: new Date(call.startTime).toISOString().split('T')[0]
      })),
      monthlyCallData: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(now.getFullYear(), now.getMonth() - i, 1).toISOString().split('T')[0],
        totalCalls: Math.floor(Math.random() * 1000),
        totalCost: Math.random() * 5000,
        calls: mockCalls.slice(0, 5).map(call => ({
          callId: call.id,
          cost: call.cost,
          duration: call.duration,
          timestamp: call.startTime,
          status: call.status,
          type: call.type
        }))
      })),
      costAnalysis: [
        { value: 40, label: 'Voice' },
        { value: 30, label: 'Processing' },
        { value: 30, label: 'Storage' }
      ]
    });
  }
};

export type { Call, Analytics };
