import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@tremor/react';
import { Phone, Clock, TrendingUp } from 'lucide-react';

interface UsageStatsProps {
  currentUsage: number;
  limit: number;
  daysLeft: number;
}

export default function UsageStats({ currentUsage, limit, daysLeft }: UsageStatsProps) {
  const usagePercentage = (currentUsage / limit) * 100;
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Usage Statistics</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Current Usage</span>
            <span className="font-semibold">{currentUsage.toLocaleString()} / {limit.toLocaleString()}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                usagePercentage > 90 ? 'bg-red-500' :
                usagePercentage > 75 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Phone className="h-5 w-5 text-indigo-600 mb-2" />
            <div className="text-sm text-gray-600">Calls Made</div>
            <div className="text-xl font-bold">{currentUsage}</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-indigo-600 mb-2" />
            <div className="text-sm text-gray-600">Days Left</div>
            <div className="text-xl font-bold">{daysLeft}</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-indigo-600 mb-2" />
            <div className="text-sm text-gray-600">Usage Rate</div>
            <div className="text-xl font-bold">{Math.round(currentUsage / (30 - daysLeft))}/day</div>
          </div>
        </div>
      </div>
    </Card>
  );
}