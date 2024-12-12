import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@tremor/react';
import { DollarSign, Clock } from 'lucide-react';

interface MetricsDisplayProps {
  cost: string | number;
  latency: string | number;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ cost, latency }) => {
  const formatCost = (cost: string | number) => {
    const numCost = typeof cost === 'string' ? parseFloat(cost) : cost;
    return numCost.toFixed(2);
  };

  const formatLatency = (latency: string | number) => {
    if (typeof latency === 'string') {
      return latency.replace('ms', '');
    }
    return latency.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Cost per minute</p>
              <motion.div 
                className="flex items-baseline"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <span className="text-2xl font-bold text-gray-900">
                  ${formatCost(cost)}
                </span>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Latency</p>
              <motion.div 
                className="flex items-baseline"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <span className="text-2xl font-bold text-gray-900">
                  {formatLatency(latency)}
                </span>
                <span className="text-lg text-gray-600 ml-1">ms</span>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default MetricsDisplay;
