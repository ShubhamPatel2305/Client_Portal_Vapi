import React, { FC } from 'react';
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
        variants={cardVariants}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-6"
      >
        <Card className="bg-white p-6 shadow-lg rounded-xl">
          <motion.div className="space-y-6" layout>
            {/* Messages Section */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-600 mt-1">Configure messages for different call scenarios.</p>
            </motion.div>

            <div className="space-y-4">
              {/* Voicemail Message */}
              <motion.div 
                className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 rounded-lg bg-blue-50"
                    whileHover={{ rotate: 15 }}
                  >
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Voicemail Message</h3>
                    <p className="text-sm text-gray-600">Message for voicemail forwarding.</p>
                  </div>
                </div>
                <TextInput
                  placeholder="Enter voicemail message"
                  value={advancedConfig.messages.voicemail}
                  onChange={(e) => onConfigChange('messages.voicemail', e.target.value)}
                  className="mt-2 focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>

              {/* End Call Message */}
              <motion.div 
                className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 rounded-lg bg-purple-50"
                    whileHover={{ rotate: -15 }}
                  >
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">End Call Message</h3>
                    <p className="text-sm text-gray-600">Message for call termination.</p>
                  </div>
                </div>
                <TextInput
                  placeholder="Enter end call message"
                  value={advancedConfig.messages.endCall}
                  onChange={(e) => onConfigChange('messages.endCall', e.target.value)}
                  className="mt-2 focus:ring-2 focus:ring-purple-500"
                />
              </motion.div>
            </div>

            {/* Call Timeout Settings */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-gray-900">Call Timeout Settings</h2>
              <p className="text-sm text-gray-600 mt-1">Configure call termination conditions.</p>
            </motion.div>

            <div className="space-y-4">
              {/* Silence Timeout */}
              <motion.div 
                className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
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
                <motion.div whileHover={{ scale: 1.02 }}>
                  <input
                    type="range"
                    min="10"
                    max="3600"
                    step="1"
                    value={advancedConfig.timeout.silence}
                    onChange={(e) => onConfigChange('timeout.silence', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>10s</span>
                    <span>{advancedConfig.timeout.silence}s</span>
                    <span>3600s</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Maximum Duration */}
              <motion.div 
                className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
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
                <motion.div whileHover={{ scale: 1.02 }}>
                  <input
                    type="range"
                    min="60"
                    max="7200"
                    step="60"
                    value={advancedConfig.timeout.maxDuration}
                    onChange={(e) => onConfigChange('timeout.maxDuration', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>1m</span>
                    <span>{Math.floor(advancedConfig.timeout.maxDuration / 60)}m</span>
                    <span>120m</span>
                  </div>
                </motion.div>
              </motion.div>
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

            {/* Toggle Buttons */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* Audio Recording */}
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Mic className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Enable Recording</h4>
                      <p className="text-xs text-gray-500">Record the conversation with the assistant</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.recordingEnabled}
                      onChange={() => onConfigChange('recordingEnabled', !config.recordingEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Video Recording */}
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Video className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Video Recording</h4>
                      <p className="text-xs text-gray-500">Enable or disable video recording during web calls</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.videoRecordingEnabled}
                      onChange={() => onConfigChange('videoRecordingEnabled', !config.videoRecordingEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
