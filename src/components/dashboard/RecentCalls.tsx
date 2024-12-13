import React from 'react';
import { Card, Title, Text } from '@tremor/react';
import { formatDuration, formatDateTime } from '../../utils/dateUtils';

interface Call {
  id: string;
  status: string;
  duration: number;
  cost: number;
  createdAt: string;
  endedReason: string;
}

interface RecentCallsProps {
  calls: Call[];
  onCallClick: (call: Call) => void;
}

export const RecentCalls: React.FC<RecentCallsProps> = ({ calls, onCallClick }) => {
  return (
    <Card className="mt-6">
      <Title className="mb-4">Recent Calls</Title>
      <div className="space-y-4">
        {calls.map((call) => (
          <div
            key={call.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            onClick={() => onCallClick(call)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${
                call.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div>
                <Text className="font-medium">{formatDateTime(call.createdAt)}</Text>
                <Text className="text-sm text-gray-600">
                  Duration: {formatDuration(call.duration)}
                </Text>
              </div>
            </div>
            <div className="text-right">
              <Text className="font-medium">${call.cost.toFixed(2)}</Text>
              <Text className="text-sm text-gray-600">
                {call.endedReason || 'Unknown'}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
