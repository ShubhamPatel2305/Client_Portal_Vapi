import React, { FC, useState, useEffect } from 'react';
import { Card, TextInput } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Info, Clock, Zap, Video, MessageSquare, Timer, Shield } from 'lucide-react';

interface AdvancedSettingsProps {
  config: {
    hipaaEnabled: boolean;
    voicemailMessage: string;
    endCallMessage: string;
    recordingEnabled: boolean;
    videoRecordingEnabled: boolean;
    silenceTimeoutSeconds: number;
    maxDurationSeconds: number;
    waitSeconds: number;
    smartEndpointingEnabled: boolean;
  };
  onConfigChange: (key: string, value: any) => void;
}

export const AdvancedSettings: FC<AdvancedSettingsProps> = ({ config, onConfigChange }) => {
  // Local state for input values
  const [silenceTimeout, setSilenceTimeout] = useState(config.silenceTimeoutSeconds);
  const [maxDuration, setMaxDuration] = useState(config.maxDurationSeconds);
  const [voicemailMsg, setVoicemailMsg] = useState(config.voicemailMessage);
  const [endCallMsg, setEndCallMsg] = useState(config.endCallMessage);

  // Update local state when props change
  useEffect(() => {
    setSilenceTimeout(config.silenceTimeoutSeconds);
    setMaxDuration(config.maxDurationSeconds);
    setVoicemailMsg(config.voicemailMessage);
    setEndCallMsg(config.endCallMessage);
  }, [config]);

  // Handle silence timeout changes
  const handleSilenceTimeoutChange = (value: number) => {
    const clampedValue = Math.min(3600, Math.max(10, value));
    setSilenceTimeout(clampedValue);
    onConfigChange('silenceTimeoutSeconds', clampedValue);
  };

  // Handle max duration changes
  const handleMaxDurationChange = (value: number) => {
    const clampedValue = Math.min(7200, Math.max(60, value));
    setMaxDuration(clampedValue);
    onConfigChange('maxDurationSeconds', clampedValue);
  };

  // Handle message changes
  const handleVoicemailMessageChange = (value: string) => {
    setVoicemailMsg(value);
    onConfigChange('voicemailMessage', value);
  };

  const handleEndCallMessageChange = (value: string) => {
    setEndCallMsg(value);
    onConfigChange('endCallMessage', value);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* Time Settings Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Time Settings</h3>
          </div>
          
          {/* Silence Timeout */}
          <motion.div 
            className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Silence Timeout</h3>
                  <p className="text-sm text-gray-600">End call after inactivity period</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="3600"
                  value={silenceTimeout}
                  onChange={(e) => handleSilenceTimeoutChange(parseInt(e.target.value) || 10)}
                  className="w-24 px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-600">seconds</span>
              </div>
            </div>
            <div className="mt-4">
              <input
                type="range"
                min="10"
                max="3600"
                value={silenceTimeout}
                onChange={(e) => handleSilenceTimeoutChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </motion.div>

          {/* Max Duration */}
          <motion.div 
            className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Maximum Duration</h3>
                  <p className="text-sm text-gray-600">Maximum length of the call</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="60"
                  max="7200"
                  value={maxDuration}
                  onChange={(e) => handleMaxDurationChange(parseInt(e.target.value) || 60)}
                  className="w-24 px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <span className="text-sm text-gray-600">seconds</span>
              </div>
            </div>
            <div className="mt-4">
              <input
                type="range"
                min="60"
                max="7200"
                value={maxDuration}
                onChange={(e) => handleMaxDurationChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>
          </motion.div>
        </div>

        {/* Messages Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          </div>

          {/* Voicemail Message */}
          <motion.div 
            className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-medium text-gray-900">Voicemail Message</h3>
              </div>
              <textarea
                value={voicemailMsg}
                onChange={(e) => handleVoicemailMessageChange(e.target.value)}
                placeholder="Enter voicemail message..."
                className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
              />
            </div>
          </motion.div>

          {/* End Call Message */}
          <motion.div 
            className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-rose-600" />
                <h3 className="text-sm font-medium text-gray-900">End Call Message</h3>
              </div>
              <textarea
                value={endCallMsg}
                onChange={(e) => handleEndCallMessageChange(e.target.value)}
                placeholder="Enter end call message..."
                className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 min-h-[100px]"
              />
            </div>
          </motion.div>
        </div>

        {/* Recording & Privacy Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recording & Privacy</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* HIPAA Compliance */}
            <motion.div
              className={`p-6 rounded-xl border ${
                config.hipaaEnabled ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              } shadow-sm hover:shadow-md transition-all duration-300`}
              whileHover={{ scale: 1.01 }}
              onClick={() => onConfigChange('hipaaEnabled', !config.hipaaEnabled)}
            >
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.hipaaEnabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Shield className={`h-5 w-5 ${config.hipaaEnabled ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">HIPAA Compliance</h3>
                    <p className="text-sm text-gray-600">Enable HIPAA compliant features</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  config.hipaaEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    config.hipaaEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </div>
            </motion.div>

            {/* Video Recording */}
            <motion.div
              className={`p-6 rounded-xl border ${
                config.videoRecordingEnabled ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200'
              } shadow-sm hover:shadow-md transition-all duration-300`}
              whileHover={{ scale: 1.01 }}
              onClick={() => onConfigChange('videoRecordingEnabled', !config.videoRecordingEnabled)}
            >
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.videoRecordingEnabled ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    <Video className={`h-5 w-5 ${config.videoRecordingEnabled ? 'text-purple-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Video Recording</h3>
                    <p className="text-sm text-gray-600">Enable video recording for calls</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  config.videoRecordingEnabled ? 'bg-purple-600' : 'bg-gray-200'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    config.videoRecordingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </div>
            </motion.div>

            {/* Audio Recording */}
            <motion.div
              className={`p-6 rounded-xl border ${
                config.recordingEnabled ? 'bg-rose-50 border-rose-200' : 'bg-white border-gray-200'
              } shadow-sm hover:shadow-md transition-all duration-300`}
              whileHover={{ scale: 1.01 }}
              onClick={() => onConfigChange('recordingEnabled', !config.recordingEnabled)}
            >
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.recordingEnabled ? 'bg-rose-100' : 'bg-gray-100'}`}>
                    <Mic className={`h-5 w-5 ${config.recordingEnabled ? 'text-rose-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Audio Recording</h3>
                    <p className="text-sm text-gray-600">Enable audio recording for calls</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  config.recordingEnabled ? 'bg-rose-600' : 'bg-gray-200'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    config.recordingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
