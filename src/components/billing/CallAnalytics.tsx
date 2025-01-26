import React, { useState } from 'react';
import {
  Card,
  Title,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
  Select,
  SelectItem,
  Button,
  Dialog,
  DialogPanel,
} from '@tremor/react';
import { format } from 'date-fns';
import type { CallData } from '../../lib/api/vapiService';
import type { Color } from '@tremor/react';
import { Download } from 'lucide-react';

interface CallAnalyticsProps {
  data: {
    calls: {
      details: CallData[];
    };
  };
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

const getStatusColor = (status: string): Color => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'ended':
      return 'emerald';
    case 'in-progress':
    case 'queued':
      return 'blue';
    case 'failed':
      return 'red';
    default:
      return 'gray';
  }
};

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(1);
  return `${minutes}m ${remainingSeconds}s`;
};

const formatCallType = (type: string): string => {
  switch (type) {
    case 'inboundPhoneCall':
      return 'Inbound Call';
    case 'outboundPhoneCall':
      return 'Outbound Call';
    default:
      return type.replace(/([A-Z])/g, ' $1').trim();
  }
};

export function CallAnalytics({ data, selectedMonth, onMonthChange }: CallAnalyticsProps) {
  const [selectedCall, setSelectedCall] = useState<CallData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredCalls = data.calls.details.filter(call => {
    const callDate = new Date(call.startedAt || call.createdAt);
    return !isNaN(callDate.getTime()) && callDate.getMonth() === selectedMonth;
  });

  const handleViewDetails = (call: CallData) => {
    setSelectedCall(call);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedCall(null);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) 
        ? format(date, 'MMM dd, yyyy HH:mm:ss')
        : 'Invalid Date';
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Title>Call Details</Title>
        <div className="flex items-center space-x-4">
          <Select 
            value={selectedMonth.toString()} 
            onValueChange={(value) => onMonthChange(parseInt(value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {format(new Date(2025, i), 'MMMM')}
              </SelectItem>
            ))}
          </Select>
          <Button
            icon={Download}
            variant="secondary"
            onClick={() => {
              // Implement export functionality
              console.log('Export clicked');
            }}
          >
            Export
          </Button>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Duration</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Cost</TableHeaderCell>
            <TableHeaderCell>Details</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCalls.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No calls found for {format(new Date(2025, selectedMonth), 'MMMM')}
              </TableCell>
            </TableRow>
          ) : (
            filteredCalls.map((call) => (
              <TableRow key={call.id} className="hover:bg-gray-50">
                <TableCell>
                  {formatDate(call.startedAt || call.createdAt)}
                </TableCell>
                <TableCell>{formatDuration(call.duration)}</TableCell>
                <TableCell>
                  <Badge color={getStatusColor(call.status)}>
                    {call.status}
                  </Badge>
                </TableCell>
                <TableCell>${call.cost.toFixed(3)}</TableCell>
                <TableCell>
                  <Button 
                    size="xs" 
                    variant="secondary"
                    onClick={() => handleViewDetails(call)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDetailsOpen} onClose={handleCloseDetails}>
        <DialogPanel>
          {selectedCall && (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <Title>Call Details</Title>
                <Button 
                  variant="light" 
                  onClick={handleCloseDetails}
                  icon={() => (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Call ID</div>
                  <div className="mt-1">{selectedCall.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div className="mt-1">{formatCallType(selectedCall.type)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div className="mt-1">
                    <Badge color={getStatusColor(selectedCall.status)}>
                      {selectedCall.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Duration</div>
                  <div className="mt-1">{formatDuration(selectedCall.duration)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Cost</div>
                  <div className="mt-1">${selectedCall.cost.toFixed(3)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Start Time</div>
                  <div className="mt-1">{formatDate(selectedCall.startedAt || selectedCall.createdAt)}</div>
                </div>
              </div>

              {selectedCall.metadata && (
                <div className="mt-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">Additional Information</div>
                  <pre className="bg-gray-50 rounded p-3 text-sm overflow-auto">
                    {JSON.stringify(selectedCall.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogPanel>
      </Dialog>
    </Card>
  );
}
