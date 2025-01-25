import React from 'react';
import { motion} from 'framer-motion';
import { Card } from '@tremor/react';
import { DollarSign, Clock, HelpCircle } from 'lucide-react';

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
    const numLatency = typeof latency === 'string' ? parseInt(latency.replace('ms', '')) : latency;
    return numLatency;
  };

  const getCostColor = (cost: number) => {
    if (cost < 0.05) return 'from-emerald-400 to-green-500';
    if (cost < 0.10) return 'from-yellow-400 to-amber-500';
    if (cost < 0.15) return 'from-orange-400 to-amber-600';
    return 'from-red-400 to-rose-600';
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 800) return 'from-blue-400 to-indigo-500';
    if (latency < 1200) return 'from-violet-400 to-purple-500';
    if (latency < 1600) return 'from-fuchsia-400 to-pink-500';
    return 'from-rose-400 to-red-600';
  };

  const costPercentage = Math.min((parseFloat(formatCost(cost)) / 0.20) * 100, 100);
  const latencyPercentage = Math.min((formatLatency(latency) / 2000) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="font-medium text-emerald-900">Cost</span>
            </div>
            <div className="flex items-center space-x-1">
              <motion.span 
                key={cost.toString()}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-2xl font-bold text-emerald-900"
              >
                ${formatCost(cost)}
              </motion.span>
              <span className="text-sm text-emerald-700">/min</span>
              <HelpCircle className="w-4 h-4 text-emerald-400 ml-1 cursor-help" />
            </div>
          </div>
          
          <div className="relative h-3 bg-emerald-100 rounded-full overflow-hidden">
            <motion.div
              className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${getCostColor(parseFloat(formatCost(cost)))}`}
              initial={{ width: 0 }}
              animate={{ width: `${costPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="grid grid-cols-4 gap-1 text-xs text-emerald-600">
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded" />
            <div className="h-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded" />
            <div className="h-1.5 bg-gradient-to-r from-orange-400 to-amber-600 rounded" />
            <div className="h-1.5 bg-gradient-to-r from-red-400 to-rose-600 rounded" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-blue-900">Latency</span>
            </div>
            <div className="flex items-center space-x-1">
              <motion.span 
                key={latency.toString()}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-2xl font-bold text-blue-900"
              >
                {formatLatency(latency)}
              </motion.span>
              <span className="text-sm text-blue-700">ms</span>
              <HelpCircle className="w-4 h-4 text-blue-400 ml-1 cursor-help" />
            </div>
          </div>
          
          <div className="relative h-3 bg-blue-100 rounded-full overflow-hidden">
            <motion.div
              className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${getLatencyColor(formatLatency(latency))}`}
              initial={{ width: 0 }}
              animate={{ width: `${latencyPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="grid grid-cols-4 gap-1 text-xs text-blue-600">
            <div className="h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded" />
            <div className="h-1.5 bg-gradient-to-r from-violet-400 to-purple-500 rounded" />
            <div className="h-1.5 bg-gradient-to-r from-fuchsia-400 to-pink-500 rounded" />
            <div className="h-1.5 bg-gradient-to-r from-rose-400 to-red-600 rounded" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MetricsDisplay;
