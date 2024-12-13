import React from 'react';
import { Card, Metric, Text } from '@tremor/react';
import { PhoneCall, PhoneIncoming, PhoneOutgoing, Clock } from 'lucide-react';

interface BillingStatsProps {
  data: {
    calls: {
      total: number;
      inbound: number;
      outbound: number;
      avgDuration: number;
      cost: string;
    };
  };
}

export function BillingStats({ data }: BillingStatsProps) {
  const stats = [
    {
      title: 'Total Calls',
      metric: data.calls.total.toLocaleString(),
      icon: PhoneCall,
      color: 'bg-blue-500'
    },
    {
      title: 'Inbound Calls',
      metric: data.calls.inbound.toLocaleString(),
      icon: PhoneIncoming,
      color: 'bg-green-500'
    },
    {
      title: 'Outbound Calls',
      metric: data.calls.outbound.toLocaleString(),
      icon: PhoneOutgoing,
      color: 'bg-purple-500'
    },
    {
      title: 'Average Duration',
      metric: `${Math.floor(data.calls.avgDuration / 60)}m ${data.calls.avgDuration % 60}s`,
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          decoration="top"
          decorationColor={stat.color.replace('bg-', '')}
        >
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-gray-600">{stat.title}</Text>
              <Metric className="mt-2 text-2xl">{stat.metric}</Metric>
            </div>
            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
