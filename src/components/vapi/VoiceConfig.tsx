import React from 'react';
import { Card } from '@tremor/react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Settings2, Info, MessageSquare, ToggleLeft, ChevronDown } from 'lucide-react';

interface VoiceConfigProps {
  config: {
    voice: {
      model: string;
      style: number;
      voiceId: string;
      provider: string;
      stability: number;
      similarityBoost: number;
      inputMinCharacters: number;
      fillerInjectionEnabled: boolean;
      optimizeStreamingLatency: number;
    };
    backchannelingEnabled: boolean;
    backgroundSound?: string;
  };
  onConfigChange: (key: string, value: any) => void;
}

const providers = [
  { value: '11labs', label: 'ElevenLabs', description: 'Emotional and natural voices' },
  { value: 'openai', label: 'OpenAI', description: 'Advanced AI voices' },
  { value: 'deepgram', label: 'Deepgram', description: 'High-quality speech recognition' }
];

const voices = {
  '11labs': [
    'francotest', 'Louis', 'test3', 'franco.2', 'test', 'belal batrawy',
    'Chris male', 'test2', 'test', 'f1', 'test', 'Bobby.Test8', 'Testinggg',
    'Luca Brasi Gentile', 'Paul', 'HARMONY', 'Andrei male', 'Cicek',
    'Jarpa Test - Francisco', 'Kanika', 'Janvi', 'HMIDA'
  ].map(name => ({ id: name, name })),
  
  openai: [
    'alloy', 'echo', 'fable', 'nova', 'onyx', 'shimmer'
  ].map(name => ({ id: name, name: name.charAt(0).toUpperCase() + name.slice(1) })),
  
  deepgram: [
    'angus', 'arcas', 'asteria', 'athena', 'helios', 'hera', 'luna', 
    'orion', 'orpheus', 'perseus', 'stella', 'zeus'
  ].map(name => ({ id: name, name: name.charAt(0).toUpperCase() + name.slice(1) })),
};

const backgroundSounds = [
  'Office', 'None'
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const VoiceConfig: React.FC<VoiceConfigProps> = ({ config, onConfigChange }) => {
  // Default values from API response with proper type checking
  console.log(config);
  const defaultValues = {
    stability: 0.5,
    similarityBoost: 0.5,
    style: 0.2,
    optimizeStreamingLatency: 1,
    fillerInjectionEnabled: false,
    provider: '11labs',
    background: 'none'
  };

  const voiceConfig = {
    ...(config?.voice || {}),
    background: config?.backgroundSound || defaultValues.background
  };

  console.log(voiceConfig);

  const isElevenLabs = voiceConfig.provider === '11labs';

  const formatValue = (value: number, decimals: number = 1) => {
    const defaultValue = decimals === 1 ? 0.5 : 1;
    return typeof value === 'number' ? value.toFixed(decimals) : defaultValue.toFixed(decimals);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <Card className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Voice Settings</h2>
        </div>
        
        {/* Provider Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-900">Provider</label>
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </div>
          <select
            value={voiceConfig.provider}
            onChange={(e) => onConfigChange('voice.provider', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900"
          >
            {providers.map((provider) => (
              <option key={provider.value} value={provider.value} className="text-gray-900">
                {provider.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-600">
            {providers.find(p => p.value === voiceConfig.provider)?.description}
          </p>
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-900">Voice</label>
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </div>
          <select
            value={voiceConfig.voiceId}
            onChange={(e) => onConfigChange('voice.voiceId', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900"
          >
            {(voices[voiceConfig.provider as keyof typeof voices] || []).map((voice) => (
              <option key={voice.id} value={voice.id} className="text-gray-900">
                {voice.name}
              </option>
            ))}
          </select>
        </div>

        {/* Only show these sliders for ElevenLabs provider */}
        {isElevenLabs && (
          <>
            {/* Stability Slider */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Settings2 className="w-4 h-4 mr-2" />
                Stability
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceConfig.stability}
                onChange={(e) => onConfigChange('voice.stability', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">
                {formatValue(voiceConfig.stability)}
              </div>
            </div>

            {/* Clarity + Similarity Slider */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Settings2 className="w-4 h-4 mr-2" />
                Clarity + Similarity
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceConfig.similarityBoost}
                onChange={(e) => onConfigChange('voice.similarityBoost', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">
                {formatValue(voiceConfig.similarityBoost)}
              </div>
            </div>

            {/* Style Exaggeration Slider */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Settings2 className="w-4 h-4 mr-2" />
                Style Exaggeration
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceConfig.style}
                onChange={(e) => onConfigChange('voice.style', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">
                {formatValue(voiceConfig.style)}
              </div>
            </div>

            {/* Optimize Streaming Latency Slider */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Settings2 className="w-4 h-4 mr-2" />
                Optimize Streaming Latency
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={voiceConfig.optimizeStreamingLatency}
                onChange={(e) => onConfigChange('voice.optimizeStreamingLatency', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">
                {voiceConfig.optimizeStreamingLatency}
              </div>
            </div>
          </>
        )}


        {/* Background Sound */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mt-6 p-4 bg-gray-50 rounded-xl space-y-3 transition-all duration-200 hover:shadow-md"
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
          <div className="relative mt-2">
            <select
              value={voiceConfig.background}
              onChange={(e) => onConfigChange('backgroundSound', e.target.value)}
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
            value={voiceConfig.inputMinCharacters}
            onChange={(e) => onConfigChange('voice.inputMinCharacters', parseInt(e.target.value))}
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:border-orange-400"
            min="1"
            max="100"
          />
        </motion.div>

        {/* Toggle Switches */}
        <div className="mt-6 space-y-4">
          {/* Filler Injection */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-md"
          >
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
                onClick={() => onConfigChange('voice.fillerInjectionEnabled', !voiceConfig.fillerInjectionEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  voiceConfig.fillerInjectionEnabled 
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
                    voiceConfig.fillerInjectionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Backchanneling */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-md"
          >
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
                onClick={() => onConfigChange('backchannelingEnabled', !config.backchannelingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  config.backchannelingEnabled 
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
                    config.backchannelingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VoiceConfig;
