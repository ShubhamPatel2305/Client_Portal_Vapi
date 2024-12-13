import { Dialog } from '@tremor/react';
import { Phone, Clock, DollarSign, X, Volume2, VolumeX } from 'lucide-react';
import { Badge, Button } from '@tremor/react';
import { format } from 'date-fns';
import { VapiCall } from '../../services/vapiService';
import { useState, useRef, useEffect } from 'react';

interface CallDetailsModalProps {
  call: VapiCall;
  isOpen: boolean;
  onClose: () => void;
}

export default function CallDetailsModal({ call, isOpen, onClose }: CallDetailsModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatDuration = (startTime: string, endTime: string) => {
    const duration = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recording URL when available
    if (call.artifact?.recordingUrl && audioRef.current) {
      audioRef.current.src = call.artifact.recordingUrl;
      audioRef.current.load();
    }
  }, [call.artifact?.recordingUrl]);

  if (!isOpen) return null;

  const hasRecording = Boolean(call.artifact?.recordingUrl);

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

          {/* Recording */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500">Call Recording</h3>
            {hasRecording ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <audio
                  ref={audioRef}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="light"
                      icon={isPlaying ? VolumeX : Volume2}
                      onClick={handlePlayPause}
                      className="!p-2"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <div className="text-sm text-gray-500">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 text-center">
                No recording available for this call
              </div>
            )}
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
        </div>
      </div>
    </Dialog>
  );
}
