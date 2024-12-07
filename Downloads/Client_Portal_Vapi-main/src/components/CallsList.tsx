import { Card, Title, Text, Badge } from '@tremor/react';
import { format } from 'date-fns';

interface Call {
  id: string;
  phoneNumber: string;
  status: string;
  timestamp: Date;
  duration: number;
  cost: number;
}

interface CallsListProps {
  calls: Call[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'emerald';
    case 'ongoing':
      return 'blue';
    case 'failed':
      return 'rose';
    default:
      return 'gray';
  }
};

export default function CallsList({ calls }: CallsListProps) {
  if (!calls.length) {
    return (
      <Card className="mt-4">
        <div className="text-center py-6">
          <Text>No calls found</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Title>Recent Calls</Title>
      <div className="mt-4 space-y-2">
        {calls.map((call) => (
          <div
            key={call.id}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <Text className="font-medium">{call.phoneNumber}</Text>
                <Text className="text-sm text-gray-500">
                  {format(new Date(call.timestamp), 'PPp')}
                </Text>
              </div>
              <div className="flex items-center space-x-4">
                <Badge color={getStatusColor(call.status)}>
                  {call.status}
                </Badge>
                <div className="text-right">
                  <Text className="font-medium">{call.duration}s</Text>
                  <Text className="text-sm text-gray-500">
                    ${call.cost.toFixed(2)}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
