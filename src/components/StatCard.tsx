import React from 'react';
import { motion } from 'framer-motion';
import { Card, Text } from '@tremor/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface TrendData {
  value: number;
  label: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: TrendData;
  delay?: number;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  delay = 0,
  onClick,
  loading = false,
  className = '',
}: StatCardProps) {
  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4" />;
    if (value < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <Card className={twMerge('relative overflow-hidden group hover:shadow-lg transition-all duration-300', className)}>
        <div className="p-4">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <Text className="text-sm font-medium text-gray-600">{title}</Text>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <Text className="text-2xl font-semibold text-gray-900">
                    {value}
                  </Text>
                  {trend && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className={getTrendColor(trend.value)}>
                        {getTrendIcon(trend.value)}
                      </span>
                      <Text className={`text-xs ${getTrendColor(trend.value)}`}>
                        {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div
          className="absolute inset-0 border-2 border-transparent group-hover:border-blue-100 transition-colors rounded-lg pointer-events-none"
        />
      </Card>
    </motion.div>
  );
}