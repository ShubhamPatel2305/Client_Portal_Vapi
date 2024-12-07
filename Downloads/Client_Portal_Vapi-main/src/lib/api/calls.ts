import { mockDataService } from '../services/mockData';

export const callsApi = {
  getCalls: async () => {
    return mockDataService.getCalls();
  },

  addCall: async (callData: any) => {
    return mockDataService.addCall(callData);
  },

  getAnalytics: async () => {
    return mockDataService.getAnalytics();
  }
};