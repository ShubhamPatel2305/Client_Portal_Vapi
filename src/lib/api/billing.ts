import { BillingPlan, billingPlans } from '../services/billingService';

export const billingApi = {
  getCurrentPlan: async (): Promise<BillingPlan> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return billingPlans[1]; // Return Pro plan as default
  },

  getUsage: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      current: 3800,
      limit: 5000,
      period: {
        start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      }
    };
  },

  getBillingHistory: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return Array.from({ length: 5 }, (_, i) => ({
      id: `INV-${String(i + 1).padStart(3, '0')}`,
      date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000),
      amount: 79.00,
      status: 'paid'
    }));
  },

  changePlan: async (planId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const plan = billingPlans.find(p => p.id === planId);
    if (!plan) throw new Error('Invalid plan ID');
    return plan;
  }
};