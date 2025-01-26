import React from 'react';
import { Card, Text, Metric, ProgressBar } from '@tremor/react';
import { Users, Phone, Clock } from 'lucide-react';

interface UsageStatsProps {
  data?: {
    currentUsage: number;
    limit: number;
    daysLeft: number;
  };
}

export function UsageStats({ data = { currentUsage: 0, limit: 1000, daysLeft: 30 } }: UsageStatsProps) {
  const usagePercentage = (data.currentUsage / data.limit) * 100;
  const usageColor = usagePercentage > 90 ? 'red' : usagePercentage > 70 ? 'yellow' : 'emerald';

  const stats = [
    {
      title: 'Current Usage',
      metric: data.currentUsage,
      icon: Phone,
      suffix: ` / ${data.limit} calls`,
    },
    {
      title: 'Days Left',
      metric: data.daysLeft,
      icon: Clock,
      suffix: ' days',
    },
    {
      title: 'Usage Percentage',
      metric: `${usagePercentage.toFixed(1)}%`,
      icon: Users,
      suffix: '',
    },
  ];

  return (
    <div className="space-y-6">
      {stats.map((stat) => (
        <Card key={stat.title} decoration="top" decorationColor="blue">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Text>{stat.title}</Text>
              <div className="flex items-center">
                <Metric>{stat.metric}</Metric>
                <Text className="ml-2">{stat.suffix}</Text>
              </div>
            </div>
            <stat.icon className="w-6 h-6 text-blue-500" />
          </div>
          {stat.title === 'Current Usage' && (
            <ProgressBar
              value={usagePercentage}
              color={usageColor}
              className="mt-3"
            />
          )}
        </Card>
      ))}
    </div>
  );
}