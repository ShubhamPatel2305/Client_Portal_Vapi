import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'your_stripe_public_key';

export const stripe = loadStripe(STRIPE_PUBLIC_KEY);

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    calls: number;
    users: number;
    analytics: boolean;
  };
}

export const billingPlans: BillingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    features: [
      '5,000 calls/month',
      'Basic analytics',
      'Email support',
      '2 team members',
      'Standard reporting'
    ],
    limits: {
      calls: 5000,
      users: 2,
      analytics: false
    }
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 79,
    features: [
      '25,000 calls/month',
      'Advanced analytics',
      'Priority support',
      '5 team members',
      'Advanced reporting',
      'API access'
    ],
    limits: {
      calls: 25000,
      users: 5,
      analytics: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    features: [
      'Unlimited calls',
      'Custom analytics',
      '24/7 support',
      'Unlimited team members',
      'Custom reporting',
      'Dedicated account manager'
    ],
    limits: {
      calls: Infinity,
      users: Infinity,
      analytics: true
    }
  }
];

export async function createCheckoutSession(planId: string): Promise<string> {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'mock_checkout_session_id';
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function getCurrentSubscription() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    planId: 'pro',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false
  };
}

export async function cancelSubscription(): Promise<void> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function resumeSubscription(): Promise<void> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
}