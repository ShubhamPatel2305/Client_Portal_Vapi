import { Card, Grid, Metric, Text, ProgressBar } from '@tremor/react';
import { PhoneCall, Clock, DollarSign, Calculator } from 'lucide-react';
import type { CallData } from '../../lib/api/vapiService';
import type { Color } from '@tremor/react';

interface BillingStatsProps {
  data: {
    calls: {
      details: CallData[];
      total: number;
      totalCost: number;
      avgDuration: number;
      avgCost: number;
    };
  };
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(1);
  return `${minutes}m ${remainingSeconds}s`;
};

const calculateStats = (calls: CallData[]) => {
  if (calls.length === 0) {
    return {
      total: 0,
      totalCost: 0,
      avgDuration: 0,
      avgCost: 0
    };
  }

  const totalCalls = calls.length;
  const totalCost = calls.reduce((sum, call) => sum + (call.cost || 0), 0);
  const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0);

  return {
    total: totalCalls,
    totalCost: totalCost,
    avgDuration: totalDuration / totalCalls,
    avgCost: totalCost / totalCalls
  };
};

export function BillingStats({ data }: BillingStatsProps) {
  const stats = calculateStats(data.calls.details);
  const maxCallsLimit = 1000; // Adjust this based on your actual limit

  const metrics: Array<{
    title: string;
    metric: string | number;
    icon: any;
    color: Color;
    progress?: number;
    description?: string;
  }> = [
    {
      title: 'Total Calls',
      metric: stats.total,
      icon: PhoneCall,
      color: 'blue',
      progress: (stats.total / maxCallsLimit) * 100,
      description: `${((stats.total / maxCallsLimit) * 100).toFixed(1)}% of limit`
    },
    {
      title: 'Total Cost',
      metric: `$${stats.totalCost.toFixed(2)}`,
      icon: DollarSign,
      color: 'emerald',
      description: 'Total spent this month'
    },
    {
      title: 'Average Cost per Call',
      metric: `$${stats.avgCost.toFixed(3)}`,
      icon: Calculator,
      color: 'indigo',
      description: 'Average cost per call'
    },
    {
      title: 'Average Duration',
      metric: formatDuration(stats.avgDuration),
      icon: Clock,
      color: 'amber',
      description: 'Average call duration'
    },
  ];

  return (
    <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
      {metrics.map((item) => (
        <Card key={item.title} decoration="top" decorationColor={item.color}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg bg-${item.color}-100`}>
                <item.icon className="w-6 h-6" style={{ color: `var(--${item.color}-500)` }} />
              </div>
              <div>
                <Text>{item.title}</Text>
                <Metric>{item.metric}</Metric>
                {item.description && (
                  <Text className="mt-1 text-gray-500">{item.description}</Text>
                )}
              </div>
            </div>
          </div>
          {item.progress !== undefined && (
            <ProgressBar value={item.progress} color={item.color} className="mt-3" />
          )}
        </Card>
      ))}
    </Grid>
  );
}
