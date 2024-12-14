export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

export const billingPlans: BillingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    features: ['5,000 minutes/month', 'Basic analytics', 'Email support']
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 79,
    features: ['15,000 minutes/month', 'Advanced analytics', 'Priority support'],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    features: ['Unlimited minutes', 'Custom analytics', '24/7 support']
  }
];
