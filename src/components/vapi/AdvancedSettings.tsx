import React, { FC, useState, useEffect } from 'react';
import { Card, TextInput } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Info, Clock, Zap, Video, MessageSquare, Timer } from 'lucide-react';

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

const defaultConfig = {
  hipaaEnabled: true,
  voicemailMessage: "Please drop a message",
  endCallMessage: "Thank you for contacting.",
  recordingEnabled: false,
  videoRecordingEnabled: false,
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 600,
  waitSeconds: 60,
  smartEndpointingEnabled: true
};

type TimeSettingKey = 'onPunctuationSeconds' | 'onNoPunctuationSeconds' | 'onNumberSeconds';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
  checked: { backgroundColor: '#3B82F6', color: 'white' },
  unchecked: { backgroundColor: '#F3F4F6', color: '#374151' }
};

export const AdvancedSettings: FC<AdvancedSettingsProps> = ({ config, onConfigChange }) => {
  // Local state for input values
  const [silenceTimeout, setSilenceTimeout] = useState(config.silenceTimeoutSeconds);
  const [maxDuration, setMaxDuration] = useState(config.maxDurationSeconds);

  // Update local state when props change
  useEffect(() => {
    setSilenceTimeout(config.silenceTimeoutSeconds);
    setMaxDuration(config.maxDurationSeconds);
  }, [config.silenceTimeoutSeconds, config.maxDurationSeconds]);

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

  const advancedConfig = {
    ...defaultConfig,
    ...config,
    messages: {
      voicemail: config.voicemailMessage || "Hey, can you please call back? Thanks!",
      endCall: config.endCallMessage || "Goodbye.",
    },
    timeout: {
      silence: config.silenceTimeoutSeconds || 30,
      maxDuration: config.maxDurationSeconds || 1800,
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* Toggle Buttons Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* HIPAA Compliance */}
          <motion.div
            className={`p-4 rounded-xl transition-all duration-300 ${
              config.hipaaEnabled ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onConfigChange('hipaaEnabled', !config.hipaaEnabled)}
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <div className={`p-2 rounded-lg ${config.hipaaEnabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Shield className={`h-5 w-5 ${config.hipaaEnabled ? 'text-blue-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">HIPAA Compliance</h3>
                <p className="text-xs text-gray-600">Enable HIPAA compliant features</p>
              </div>
            </div>
          </motion.div>

          {/* Video Recording */}
          <motion.div
            className={`p-4 rounded-xl transition-all duration-300 ${
              config.videoRecordingEnabled ? 'bg-purple-50 hover:bg-purple-100' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onConfigChange('videoRecordingEnabled', !config.videoRecordingEnabled)}
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <div className={`p-2 rounded-lg ${config.videoRecordingEnabled ? 'bg-purple-100' : 'bg-gray-100'}`}>
                <Video className={`h-5 w-5 ${config.videoRecordingEnabled ? 'text-purple-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Video Recording</h3>
                <p className="text-xs text-gray-600">Enable video recording</p>
              </div>
            </div>
          </motion.div>

          {/* Audio Recording */}
          <motion.div
            className={`p-4 rounded-xl transition-all duration-300 ${
              config.recordingEnabled ? 'bg-rose-50 hover:bg-rose-100' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onConfigChange('recordingEnabled', !config.recordingEnabled)}
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <div className={`p-2 rounded-lg ${config.recordingEnabled ? 'bg-rose-100' : 'bg-gray-100'}`}>
                <Mic className={`h-5 w-5 ${config.recordingEnabled ? 'text-rose-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Audio Recording</h3>
                <p className="text-xs text-gray-600">Enable audio recording</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Time Settings Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Time Settings</h3>
          {/* Silence Timeout */}
          <motion.div 
            className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="p-2 rounded-lg bg-teal-50"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Timer className="h-5 w-5 text-teal-600" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Silence Timeout</h3>
                  <p className="text-sm text-gray-600">Automatic call end on inactivity.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="3600"
                  value={silenceTimeout}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 10 : parseInt(e.target.value);
                    handleSilenceTimeoutChange(value);
                  }}
                  className="w-24 px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #14b8a6 ${(silenceTimeout - 10) / 35.9}%, #e5e7eb ${(silenceTimeout - 10) / 35.9}%)`,
                  WebkitAppearance: 'none',
                }}
              />
              <style dangerouslySetInnerHTML={{ __html: `
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  background: #14b8a6;
                  border-radius: 50%;
                  cursor: pointer;
                  transition: background-color 0.2s;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                  background: #0d9488;
                }
                input[type='range']::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  background: #14b8a6;
                  border-radius: 50%;
                  cursor: pointer;
                  border: none;
                  transition: background-color 0.2s;
                }
                input[type='range']::-moz-range-thumb:hover {
                  background: #0d9488;
                }
              `}} />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>10s</span>
                <span>1h</span>
              </div>
            </div>
          </motion.div>

          {/* Maximum Duration */}
          <motion.div 
            className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="p-2 rounded-lg bg-orange-50"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Clock className="h-5 w-5 text-orange-600" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Maximum Duration</h3>
                  <p className="text-sm text-gray-600">Maximum call duration limit.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="60"
                  max="7200"
                  value={maxDuration}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 60 : parseInt(e.target.value);
                    handleMaxDurationChange(value);
                  }}
                  className="w-24 px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #f97316 ${(maxDuration - 60) / 71.4}%, #e5e7eb ${(maxDuration - 60) / 71.4}%)`,
                  WebkitAppearance: 'none',
                }}
              />
              <style dangerouslySetInnerHTML={{ __html: `
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  background: #f97316;
                  border-radius: 50%;
                  cursor: pointer;
                  transition: background-color 0.2s;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                  background: #ea580c;
                }
                input[type='range']::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  background: #f97316;
                  border-radius: 50%;
                  cursor: pointer;
                  border: none;
                  transition: background-color 0.2s;
                }
                input[type='range']::-moz-range-thumb:hover {
                  background: #ea580c;
                }
              `}} />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1m</span>
                <span>2h</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Messages Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Voicemail Message */}
            <motion.div 
              className="p-4 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.01 }}
            >
              <h4 className="text-sm font-medium text-gray-900 mb-2">Voicemail Message</h4>
              <TextInput
                value={advancedConfig.messages.voicemail}
                onChange={(e) => onConfigChange('messages.voicemail', e.target.value)}
                className="w-full h-24 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter voicemail message..."
              />
            </motion.div>

            {/* End Call Message */}
            <motion.div 
              className="p-4 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.01 }}
            >
              <h4 className="text-sm font-medium text-gray-900 mb-2">End Call Message</h4>
              <TextInput
                value={advancedConfig.messages.endCall}
                onChange={(e) => onConfigChange('messages.endCall', e.target.value)}
                className="w-full h-24 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter end call message..."
              />
            </motion.div>
          </div>
        </div>

        {/* Privacy Settings */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <div className="h-4 w-4 text-indigo-600">🔒</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">HIPAA Compliance</h4>
                  <p className="text-xs text-gray-500">When enabled, no logs, recordings, or transcriptions will be stored</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={advancedConfig.hipaaEnabled}
                  onChange={() => onConfigChange('hipaaEnabled', !advancedConfig.hipaaEnabled)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
