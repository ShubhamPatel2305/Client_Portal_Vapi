import { BillingPlan, billingPlans } from '../services/billingService';
import { generateAnalyticsReport, generateInvoice } from '../../utils/pdfGenerators';
import { format } from 'date-fns';

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

  changePlan: async (planId: string): Promise<BillingPlan> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const plan = billingPlans.find((p: BillingPlan) => p.id === planId);
    if (!plan) throw new Error('Invalid plan ID');
    return plan;
  },

  downloadReport: async (month: number): Promise<Blob> => {
    // Generate mock data for the report
    const mockData = {
      totalCalls: 653,
      inboundCalls: 717,
      outboundCalls: 516,
      avgDuration: 6,
      totalCost: 245.67,
      successRate: 99.2,
      dailyStats: Array.from({ length: 28 }, (_, i) => ({
        date: format(new Date(2024, month, i + 1), 'yyyy-MM-dd'),
        totalCalls: Math.floor(Math.random() * 100) + 50
      })),
      callDetails: Array.from({ length: 13 }, (_, i) => ({
        id: `CALL-${i + 1}`,
        date: format(new Date(2024, month, Math.floor(Math.random() * 28) + 1), 'yyyy-MM-dd HH:mm:ss'),
        type: Math.random() > 0.5 ? 'Inbound' : 'Outbound',
        duration: Math.floor(Math.random() * 600) + 60,
        cost: Number((Math.random() * 10).toFixed(2)),
        status: Math.random() > 0.1 ? 'Completed' : 'Failed'
      }))
    };

    const doc = generateAnalyticsReport(mockData);
    return doc.output('blob');
  },

  downloadInvoice: async (month: number): Promise<Blob> => {
    // Generate mock data for the invoice
    const mockData = {
      invoiceNumber: `INV-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      client: {
        name: 'John Smith',
        companyName: 'Acme Corporation',
        address: '123 Business Avenue',
        city: 'San Francisco, CA 94105',
        email: 'john.smith@acme.com',
        phone: '+1 (415) 555-0123',
        taxId: 'US-123456789'
      },
      date: format(new Date(2024, month, 1), 'yyyy-MM-dd'),
      dueDate: format(new Date(2024, month + 1, 1), 'yyyy-MM-dd'),
      billingPeriod: format(new Date(2024, month, 1), 'MMMM yyyy'),
      services: [
        {
          name: 'Voice API Calls',
          description: 'Outbound and inbound voice calls with high-quality audio',
          quantity: 653,
          rate: 0.25,
          amount: 163.25
        },
        {
          name: 'SMS Messages',
          description: 'Global SMS messaging with delivery tracking',
          quantity: 245,
          rate: 0.15,
          amount: 36.75
        },
        {
          name: 'Premium Support',
          description: '24/7 priority technical support and consulting',
          quantity: 1,
          rate: 45.00,
          amount: 45.00
        }
      ],
      subtotal: 245.00,
      tax: 24.50,
      total: 269.50,
      paymentMethod: 'Credit Card ending in 4242',
      notes: 'Payment is due within 30 days. Please include invoice number with your payment.'
    };

    const doc = generateInvoice(mockData);
    return doc.output('blob');
  }
};