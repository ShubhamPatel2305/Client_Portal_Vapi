import { FC, useState, useEffect } from 'react';
import { Card } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Clock, Zap, Video, MessageSquare, Timer, Shield, Lock } from 'lucide-react';

interface AdvancedSettingsProps {
  config: {
    hipaaEnabled: boolean;
    voicemailMessage: string;
    endCallMessage: string;
    recordingEnabled: boolean;
    silenceTimeoutSeconds: number;
    maxDurationSeconds: number;
    artifactPlan: {
      videoRecordingEnabled: boolean;
    };
    startSpeakingPlan: {
      waitSeconds: number;
      smartEndpointingEnabled: boolean;
    };
  };
  onConfigChange: (path: string, value: any) => void;
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
    // Allow any value to be typed, but clamp when submitting
    setSilenceTimeout(value);
    // Only update the config with clamped value when the input loses focus
  };

  const handleSilenceTimeoutBlur = () => {
    const clampedValue = Math.min(3600, Math.max(10, silenceTimeout));
    setSilenceTimeout(clampedValue);
    onConfigChange('silenceTimeoutSeconds', clampedValue);
  };

  // Handle max duration changes
  const handleMaxDurationChange = (value: number) => {
    // Allow any value to be typed, but clamp when submitting
    setMaxDuration(value);
    // Only update the config with clamped value when the input loses focus
  };

  const handleMaxDurationBlur = () => {
    const clampedValue = Math.min(7200, Math.max(60, maxDuration));
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

  // Handle toggle changes with HIPAA dependency
  const handleRecordingToggle = (key: string, value: boolean) => {
    if (!config.hipaaEnabled) {
      // Allow changes only if HIPAA is disabled
      onConfigChange(key, value);
    }
  };

  // Handle HIPAA toggle
  const handleHipaaToggle = (value: boolean) => {
    if (value) {
      // When turning on HIPAA, force disable recording features
      onConfigChange('recordingEnabled', false);
      onConfigChange('artifactPlan.videoRecordingEnabled', false);
    }
    onConfigChange('hipaaEnabled', value);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-8"
      >
        <Card className="bg-white p-6 shadow-lg rounded-xl">
          <motion.div className="space-y-8">
            {/* Header */}
            <motion.div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Advanced Settings</h2>
                  <p className="text-sm text-gray-600">Configure advanced features and behaviors</p>
                </div>
              </div>
            </motion.div>

            {/* Time Settings Section */}
            <motion.div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Time Settings</h3>
                  <p className="text-xs text-gray-600">Configure call duration and timeouts</p>
                </div>
              </div>
              
              {/* Silence Timeout */}
              <motion.div 
                className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Timer className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Silence Timeout</h3>
                      <p className="text-xs text-gray-600">End call after inactivity period</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="10"
                      max="3600"
                      value={silenceTimeout}
                      onChange={(e) => handleSilenceTimeoutChange(parseInt(e.target.value) || 0)}
                      onBlur={handleSilenceTimeoutBlur}
                      className="w-24 px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onMouseUp={handleSilenceTimeoutBlur}
                    onTouchEnd={handleSilenceTimeoutBlur}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </motion.div>

              {/* Max Duration */}
              <motion.div 
                className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Maximum Duration</h3>
                      <p className="text-xs text-gray-600">Maximum length of the call</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="60"
                      max="7200"
                      value={maxDuration}
                      onChange={(e) => handleMaxDurationChange(parseInt(e.target.value) || 0)}
                      onBlur={handleMaxDurationBlur}
                      className="w-24 px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    onMouseUp={handleMaxDurationBlur}
                    onTouchEnd={handleMaxDurationBlur}
                    className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Messages Section */}
            <motion.div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-purple-50">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Messages</h3>
                  <p className="text-xs text-gray-600">Configure system messages</p>
                </div>
              </div>

              {/* Voicemail Message */}
              <motion.div 
                className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100"
                whileHover={{ scale: 1.01 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mic className="h-5 w-5 text-purple-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Voicemail Message</h3>
                      <p className="text-xs text-gray-600">Message played when call goes to voicemail</p>
                    </div>
                  </div>
                  <textarea
                    value={voicemailMsg}
                    onChange={(e) => handleVoicemailMessageChange(e.target.value)}
                    placeholder="Enter voicemail message..."
                    className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] resize-none"
                  />
                </div>
              </motion.div>

              {/* End Call Message */}
              <motion.div 
                className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100"
                whileHover={{ scale: 1.01 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-rose-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">End Call Message</h3>
                      <p className="text-xs text-gray-600">Message played before ending the call</p>
                    </div>
                  </div>
                  <textarea
                    value={endCallMsg}
                    onChange={(e) => handleEndCallMessageChange(e.target.value)}
                    placeholder="Enter end call message..."
                    className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent min-h-[100px] resize-none"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Recording & Privacy Section */}
            <motion.div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Shield className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Recording & Privacy</h3>
                  <p className="text-xs text-gray-600">Configure recording and privacy settings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* HIPAA Compliance */}
                <motion.div
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    config.hipaaEnabled 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' 
                      : 'bg-white border-gray-200'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.hipaaEnabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Shield className={`h-5 w-5 ${config.hipaaEnabled ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">HIPAA Compliance</h3>
                        <p className="text-xs text-gray-600">Enable HIPAA compliant features</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.hipaaEnabled}
                        onChange={(e) => handleHipaaToggle(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </motion.div>

                {/* Video Recording */}
                <motion.div
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    !config.hipaaEnabled 
                      ? config.artifactPlan.videoRecordingEnabled 
                        ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100' 
                        : 'bg-white border-gray-200'
                      : 'bg-gray-50 border-gray-200 opacity-75 cursor-not-allowed'
                  }`}
                  whileHover={!config.hipaaEnabled ? { scale: 1.01 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.artifactPlan.videoRecordingEnabled && !config.hipaaEnabled ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        {config.hipaaEnabled ? (
                          <Lock className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Video className={`h-5 w-5 ${config.artifactPlan.videoRecordingEnabled ? 'text-purple-600' : 'text-gray-600'}`} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">Video Recording</h3>
                          {config.hipaaEnabled && (
                            <span className="text-xs text-gray-500">(Disable HIPAA first)</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">Enable video recording for calls</p>
                      </div>
                    </div>
                    <label className={`relative inline-flex items-center ${config.hipaaEnabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        checked={config.artifactPlan.videoRecordingEnabled}
                        onChange={(e) => handleRecordingToggle('artifactPlan.videoRecordingEnabled', e.target.checked)}
                        disabled={config.hipaaEnabled}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 ${config.hipaaEnabled ? 'bg-gray-300' : 'bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300'} rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${config.hipaaEnabled ? 'opacity-50' : ''}`}></div>
                    </label>
                  </div>
                </motion.div>

                {/* Audio Recording */}
                <motion.div
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    !config.hipaaEnabled 
                      ? config.recordingEnabled 
                        ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-100' 
                        : 'bg-white border-gray-200'
                      : 'bg-gray-50 border-gray-200 opacity-75 cursor-not-allowed'
                  }`}
                  whileHover={!config.hipaaEnabled ? { scale: 1.01 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.recordingEnabled && !config.hipaaEnabled ? 'bg-rose-100' : 'bg-gray-100'}`}>
                        {config.hipaaEnabled ? (
                          <Lock className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Mic className={`h-5 w-5 ${config.recordingEnabled ? 'text-rose-600' : 'text-gray-600'}`} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">Audio Recording</h3>
                          {config.hipaaEnabled && (
                            <span className="text-xs text-gray-500">(Disable HIPAA first)</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">Enable audio recording for calls</p>
                      </div>
                    </div>
                    <label className={`relative inline-flex items-center ${config.hipaaEnabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        checked={config.recordingEnabled}
                        onChange={(e) => handleRecordingToggle('recordingEnabled', e.target.checked)}
                        disabled={config.hipaaEnabled}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 ${config.hipaaEnabled ? 'bg-gray-300' : 'bg-gray-200 peer-focus:ring-4 peer-focus:ring-rose-300'} rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600 ${config.hipaaEnabled ? 'opacity-50' : ''}`}></div>
                    </label>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
