import { useState, useEffect } from 'react';
import { billingPlans, getCurrentSubscription } from '../services/billingService';
import type { BillingPlan } from '../services/billingService';

export interface SubscriptionStatus {
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export function useBilling() {
  const [currentPlan, setCurrentPlan] = useState<BillingPlan | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscriptionData() {
      try {
        const subscriptionData = await getCurrentSubscription();
        setSubscription(subscriptionData);
        
        const plan = billingPlans.find(p => p.id === subscriptionData.planId);
        setCurrentPlan(plan || null);
        
        setError(null);
      } catch (err) {
        setError('Failed to load subscription data');
        console.error('Subscription fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptionData();
  }, []);

  return {
    currentPlan,
    subscription,
    loading,
    error,
    plans: billingPlans
  };
}