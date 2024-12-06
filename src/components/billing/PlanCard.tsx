import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import type { BillingPlan } from '../../services/billingService';

interface PlanCardProps {
  plan: BillingPlan;
  isCurrentPlan: boolean;
  onSelect: (planId: string) => void;
  loading?: boolean;
}

export default function PlanCard({ plan, isCurrentPlan, onSelect, loading }: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className={`rounded-lg border-2 p-6 ${
        isCurrentPlan ? 'border-indigo-600' : 'border-gray-200'
      }`}>
        {isCurrentPlan && (
          <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full mb-4">
            Current Plan
          </span>
        )}
        
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <p className="mt-4">
          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
          <span className="text-gray-500">/month</span>
        </p>
        
        <ul className="mt-6 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() => onSelect(plan.id)}
          disabled={isCurrentPlan || loading}
          className={`mt-8 w-full py-2 px-4 rounded-lg flex items-center justify-center ${
            isCurrentPlan
              ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
              : loading
              ? 'bg-indigo-500 text-white cursor-wait'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } transition-colors`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : (
            'Upgrade to ' + plan.name
          )}
        </button>
      </div>
    </motion.div>
  );
}