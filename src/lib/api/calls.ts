import { mockDataService } from '../services/mockData';
import type { Call, Analytics } from '../services/mockData';

export const callsApi = {
  getCalls: async (): Promise<Call[]> => {
    return mockDataService.getCalls();
  },

  addCall: async (callData: Partial<Call>): Promise<Call> => {
    return mockDataService.addCall(callData);
  },

  getAnalytics: async (): Promise<Analytics> => {
    return mockDataService.getAnalytics();
  }
};