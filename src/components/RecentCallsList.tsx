import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@tremor/react';
import { Phone, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface RecentCall {
  type: string;
  status: string;
  time: string;
  duration?: string;
  phoneNumber: string;
}

interface RecentCallsListProps {
  calls: RecentCall[];
}

export default function RecentCallsList({ calls }: RecentCallsListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Calls</h3>
      <div className="space-y-4">
        {calls.map((call, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Phone className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="font-medium">{call.phoneNumber}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {call.time}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {call.duration && (
                <span className="text-sm font-medium">{call.duration}</span>
              )}
              {getStatusIcon(call.status)}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}