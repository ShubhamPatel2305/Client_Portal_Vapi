import React from 'react';
import { Card, Text, Title } from '@tremor/react';
import { PhoneCall, DollarSign, Clock, PhoneOff } from 'lucide-react';

interface StatCardsProps {
  totalCalls: number;
  totalCost: number;
  avgDuration: number;
  totalEnded: number;
}

export const StatCards: React.FC<StatCardsProps> = ({
  totalCalls,
  totalCost,
  avgDuration,
  totalEnded,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <PhoneCall className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <Text className="text-sm text-gray-600">Total Calls</Text>
            <Title className="text-lg font-bold text-gray-900">
              {totalCalls}
            </Title>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <Text className="text-sm text-gray-600">Total Cost</Text>
            <Title className="text-lg font-bold text-gray-900">
              ${totalCost.toFixed(2)}
            </Title>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <Text className="text-sm text-gray-600">Average Duration</Text>
            <Title className="text-lg font-bold text-gray-900">
              {avgDuration.toFixed(1)}s
            </Title>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-rose-50 rounded-lg">
            <PhoneOff className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <Text className="text-sm text-gray-600">Total Calls Ended</Text>
            <Title className="text-lg font-bold text-gray-900">
              {totalEnded}
            </Title>
          </div>
        </div>
      </Card>
    </div>
  );
};
