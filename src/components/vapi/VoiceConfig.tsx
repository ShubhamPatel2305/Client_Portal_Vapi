import React from 'react';
import { Card } from '@tremor/react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Settings2, Info, MessageSquare, ToggleLeft, ChevronDown } from 'lucide-react';

interface VoiceConfigProps {
  config: {
    voice: {
      provider: string;
      voice: string;
      background?: string;
      minCharacters?: number;
      punctuationBoundaries?: string[];
      fillerInjection?: boolean;
      backchanneling?: boolean;
    };
  };
  onConfigChange: (key: string, value: any) => void;
}

const providers = [
  { id: 'deepgram', name: 'Deepgram', description: 'High-quality speech recognition' },
  { id: 'openai', name: 'OpenAI', description: 'Advanced AI voices' },
  { id: 'elevenlabs', name: 'ElevenLabs', description: 'Emotional and natural voices' }
];

const voices = {
  deepgram: [
    'angus', 'arcas', 'asteria', 'athena', 'helios', 'hera', 'luna', 
    'orion', 'orpheus', 'perseus', 'stella', 'zeus'
  ].map(name => ({ id: name, name: name.charAt(0).toUpperCase() + name.slice(1) })),
  
  elevenlabs: [
    'francotest', 'Louis', 'test3', 'franco.2', 'test', 'belal batrawy',
    'Chris male', 'test2', 'test', 'f1', 'test', 'Bobby.Test8', 'Testinggg',
    'Luca Brasi Gentile', 'Paul', 'HARMONY', 'Andrei male', 'Cicek',
    'Jarpa Test - Francisco', 'Kanika', 'Janvi', 'HMIDA'
  ].map(name => ({ id: name, name })),
  
  openai: [
    'alloy', 'echo', 'fable', 'nova', 'onyx', 'shimmer'
  ].map(name => ({ id: name, name: name.charAt(0).toUpperCase() + name.slice(1) }))
};

const backgroundSounds = [
  'Office', 'Cafe', 'Street', 'Nature', 'None'
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const VoiceConfig: React.FC<VoiceConfigProps> = ({ config, onConfigChange }) => {
  // Default values
  const defaultConfig = {
    background: 'office',
    minCharacters: 10,
    punctuationBoundaries: [],
    fillerInjection: false,
    backchanneling: false
  };

  // Merge with defaults
  const voiceConfig = {
    ...defaultConfig,
    ...config.voice
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Card className="bg-white p-6">
        <div className="space-y-6">
          {/* Voice Settings Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Voice Settings</h2>
            <div className="space-y-4">
              {/* Provider */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-900">Provider</label>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </div>
                <select
                  value={config.voice.provider}
                  onChange={(e) => onConfigChange('voice.provider', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id} className="text-gray-900">
                      {provider.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-600">
                  {providers.find(p => p.id === config.voice.provider)?.description}
                </p>
              </div>

              {/* Voice */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-900">Voice</label>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </div>
                <select
                  value={config.voice.voice}
                  onChange={(e) => onConfigChange('voice.voice', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900"
                >
                  {(voices[config.voice.provider as keyof typeof voices] || []).map((voice) => (
                    <option key={voice.id} value={voice.id} className="text-gray-900">
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Configuration Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Additional Configuration</h2>
              <p className="text-sm text-gray-600 mb-6">Configure additional settings for the voice of your assistant.</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Background Sound */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-gray-50 rounded-xl space-y-3 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Volume2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <label className="text-sm font-medium text-gray-900">Background Sound</label>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 w-48 p-2 mt-2 text-xs text-gray-600 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                        Choose background ambient sound for your assistant
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={voiceConfig.background}
                      onChange={(e) => onConfigChange('voice.background', e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:border-blue-400"
                    >
                      {backgroundSounds.map((sound) => (
                        <option 
                          key={sound} 
                          value={sound.toLowerCase()} 
                          className="py-2 text-gray-900"
                        >
                          {sound}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </motion.div>

                {/* Input Min Characters */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-gray-50 rounded-xl space-y-2 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-orange-50 rounded-lg">
                      <Settings2 className="h-4 w-4 text-orange-600" />
                    </div>
                    <label className="text-sm font-medium text-gray-900">Input Min Characters</label>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 w-48 p-2 mt-2 text-xs text-gray-600 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                        Minimum number of characters required for voice generation
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={voiceConfig.minCharacters}
                    onChange={(e) => onConfigChange('voice.minCharacters', parseInt(e.target.value))}
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:border-orange-400"
                    min="1"
                    max="100"
                  />
                </motion.div>
              </div>

              {/* Punctuation Boundaries */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="mt-6 p-4 bg-gray-50 rounded-xl space-y-3 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-purple-50 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">Punctuation Boundaries</h3>
                  <div className="group relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute left-0 w-64 p-2 mt-2 text-xs text-gray-600 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                      These punctuations determine how the text is split into chunks for voice generation
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Choose how your text will be split for natural voice generation
                </p>
                <div className="relative mt-2">
                  <select
                    value={voiceConfig.punctuationBoundaries?.join(',') || ''}
                    onChange={(e) => onConfigChange('voice.punctuationBoundaries', e.target.value ? e.target.value.split(',') : [])}
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:border-purple-400"
                  >
                    <option value="">No Punctuation Boundaries</option>
                    <option value=".,!?">Basic (. , ! ?)</option>
                    <option value=".,!?;:">Extended (. , ! ? ; :)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </motion.div>

              {/* Toggle Switches */}
              <div className="mt-6 space-y-4">
                {/* Filler Injection */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-green-50">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Filler Injection Enabled</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Add natural speech fillers to make the voice output more human-like
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onConfigChange('voice.fillerInjection', !voiceConfig.fillerInjection)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          voiceConfig.fillerInjection 
                            ? 'bg-green-500 focus:ring-green-500' 
                            : 'bg-gray-200 focus:ring-gray-500'
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
                            voiceConfig.fillerInjection ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Backchanneling */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-indigo-50">
                        <ToggleLeft className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Backchanneling Enabled</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Add acknowledgment sounds during conversations
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onConfigChange('voice.backchanneling', !voiceConfig.backchanneling)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          voiceConfig.backchanneling 
                            ? 'bg-indigo-500 focus:ring-indigo-500' 
                            : 'bg-gray-200 focus:ring-gray-500'
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
                            voiceConfig.backchanneling ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VoiceConfig;
