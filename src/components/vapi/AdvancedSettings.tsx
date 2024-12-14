import React, { FC } from 'react';
import { Card, TextInput } from '@tremor/react';
import { motion } from 'framer-motion';
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

export const AdvancedSettings: FC<AdvancedSettingsProps> = ({ config, onConfigChange }) => {
  // Merge with defaults
  console.log(config, 'config');
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-white p-6">
        <div className="space-y-6">
          {/* Messages Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <p className="text-sm text-gray-600 mt-1">Configure messages for different call scenarios.</p>
          </div>

          <div className="space-y-4">
            {/* Voicemail Message */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Voicemail Message</h3>
                  <p className="text-sm text-gray-600">This is the message that the assistant will say if the call is forwarded to voicemail.</p>
                </div>
              </div>
              <TextInput
                placeholder="Enter voicemail message"
                value={advancedConfig.messages.voicemail}
                onChange={(e) => onConfigChange('messages.voicemail', e.target.value)}
                className="mt-2"
              />
            </div>

            {/* End Call Message */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-50">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">End Call Message</h3>
                  <p className="text-sm text-gray-600">This is the message that the assistant will say if the call is ended.</p>
                </div>
              </div>
              <TextInput
                placeholder="Enter end call message"
                value={advancedConfig.messages.endCall}
                onChange={(e) => onConfigChange('messages.endCall', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          {/* Call Timeout Settings */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Call Timeout Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Configure when the assistant should end a call based on silence or duration.</p>
          </div>

          <div className="space-y-4">
            {/* Silence Timeout */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-50">
                  <Timer className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Silence Timeout</h3>
                  <p className="text-sm text-gray-600">How long to wait before a call is automatically ended due to inactivity.</p>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="3600"
                step="1"
                value={advancedConfig.timeout.silence}
                onChange={(e) => onConfigChange('timeout.silence', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>10 sec</span>
                <span>{advancedConfig.timeout.silence} sec</span>
                <span>3600 sec</span>
              </div>
            </div>

            {/* Maximum Duration */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Maximum Duration</h3>
                  <p className="text-sm text-gray-600">The maximum number of seconds a call will last.</p>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="43200"
                step="1"
                value={advancedConfig.timeout.maxDuration}
                onChange={(e) => onConfigChange('timeout.maxDuration', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>10 sec</span>
                <span>{advancedConfig.timeout.maxDuration} sec</span>
                <span>43200 sec</span>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-red-50">
                  <div className="h-5 w-5 text-red-600">🔒</div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">HIPAA Compliance</h3>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 w-64 p-2 mt-2 text-xs text-gray-600 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                        When enabled, no logs, recordings, or transcriptions will be stored
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">When this is enabled, no logs, recordings, or transcriptions will be stored.</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onConfigChange('privacy.hipaa', !advancedConfig.hipaaEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  advancedConfig.hipaaEnabled ? 'bg-red-500 focus:ring-red-500' : 'bg-gray-200 focus:ring-gray-500'
                }`}
              >
                <motion.span
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                  }}
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                    advancedConfig.hipaaEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Mic className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Audio Recording</h3>
                  <p className="text-sm text-gray-600 mt-1">Record the conversation with the assistant.</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onConfigChange('privacy.audioRecording', !advancedConfig.recordingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  advancedConfig.recordingEnabled ? 'bg-blue-500 focus:ring-blue-500' : 'bg-gray-200 focus:ring-gray-500'
                }`}
              >
                <motion.span
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                  }}
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                    advancedConfig.recordingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Video className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">Video Recording</h3>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 w-64 p-2 mt-2 text-xs text-gray-600 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                        Enable or disable video recording during web calls
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Enable or disable video recording during a web call.</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onConfigChange('privacy.videoRecording', !advancedConfig.videoRecordingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  advancedConfig.videoRecordingEnabled ? 'bg-purple-500 focus:ring-purple-500' : 'bg-gray-200 focus:ring-gray-500'
                }`}
              >
                <motion.span
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                  }}
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                    advancedConfig.videoRecordingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>
          </div>

          {/* Start Speaking Plan */}
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Start Speaking Plan</h3>
              <p className="text-sm text-gray-600 mt-1">Configure when the assistant should start talking.</p>
            </div>

            {/* Wait Seconds Slider */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-50 rounded-lg">
                  <Clock className="h-4 w-4 text-teal-600" />
                </div>
                <label className="text-sm font-medium text-gray-900">Wait Seconds</label>
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 w-64 p-2 mt-2 text-xs text-gray-600 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                    How long assistant waits before speaking
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={advancedConfig.waitSeconds || 0}
                onChange={(e) => onConfigChange('startSpeaking.waitSeconds', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>0 sec</span>
                <span>{advancedConfig.waitSeconds || 0} sec</span>
                <span>2 sec</span>
              </div>
            </div>

            {/* Smart Endpointing */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Zap className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Smart Endpointing</h3>
                  <p className="text-sm text-gray-600 mt-1">Enable for more accurate speech endpoint detection.</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onConfigChange('startSpeaking.smartEndpointing', !advancedConfig.smartEndpointingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  advancedConfig.smartEndpointingEnabled ? 'bg-indigo-500 focus:ring-indigo-500' : 'bg-gray-200 focus:ring-gray-500'
                }`}
              >
                <motion.span
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                  }}
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                    advancedConfig.smartEndpointingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
