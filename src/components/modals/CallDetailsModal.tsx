import { Dialog } from '@tremor/react';
import { Phone, Clock, DollarSign, X } from 'lucide-react';
import { Badge } from '@tremor/react';
import { format } from 'date-fns';
import { VapiCall } from '../../services/vapiService';
import { Button } from '@tremor/react';

interface CallDetailsModalProps {
  call: VapiCall;
  isOpen: boolean;
  onClose: () => void;
}

export default function CallDetailsModal({ call, isOpen, onClose }: CallDetailsModalProps) {
  const formatDuration = (startTime: string, endTime: string) => {
    const duration = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold">Call Details</h2>
          </div>
          <Button
            variant="light"
            icon={X}
            onClick={onClose}
            className="!p-1"
          />
        </div>

        <div className="space-y-6 p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{call.customer?.number || 'Unknown'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Start Time</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{format(new Date(call.startedAt), 'PPpp')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Duration</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{formatDuration(call.startedAt, call.endedAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Cost</h3>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span>${call.cost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          {call.analysis?.summary && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Summary</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {call.analysis.summary}
              </p>
            </div>
          )}

          {/* Transcript */}
          {call.artifact?.transcript && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Transcript</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {call.artifact.transcript}
                </pre>
              </div>
            </div>
          )}

          {/* Status and End Reason */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <Badge
                color={
                  call.status === 'completed' ? 'green' :
                  call.status === 'failed' ? 'red' : 'yellow'
                }
                className="capitalize"
              >
                {call.status}
              </Badge>
            </div>
            <div className="space-y-2 text-right">
              <h3 className="text-sm font-medium text-gray-500">End Reason</h3>
              <span className="text-sm text-gray-700">{call.endedReason || 'N/A'}</span>
            </div>
          </div>

          {/* Recording */}
          {call.artifact?.recordingUrl && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Recording</h3>
              <audio controls className="w-full">
                <source src={call.artifact.recordingUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
