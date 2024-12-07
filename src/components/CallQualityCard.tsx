import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@tremor/react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface CallQualityProps {
  successRate: number;
  failureRate: number;
  totalCalls: number;
}

export default function CallQualityCard({ successRate, failureRate, totalCalls }: CallQualityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Call Quality Metrics</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Success Rate</span>
            </div>
            <span className="font-semibold text-green-500">{successRate.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span>Failure Rate</span>
            </div>
            <span className="font-semibold text-red-500">{failureRate.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span>Total Calls</span>
            </div>
            <span className="font-semibold">{totalCalls}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}