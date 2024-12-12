import React, { useState } from 'react';
import { Card } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, Settings2, PlayCircle, Info, VolumeX, Volume1, Volume } from 'lucide-react';

interface VoiceConfigProps {
  config: {
    voice: {
      provider: string;
      voice: string;
      speed: number;
    };
  };
  onConfigChange: (key: string, value: any) => void;
}

const voices = {
  elevenlabs: [
    { id: 'rachel', name: 'Rachel', description: 'Warm and professional female voice' },
    { id: 'adam', name: 'Adam', description: 'Clear and authoritative male voice' },
    { id: 'sam', name: 'Sam', description: 'Friendly and engaging neutral voice' },
    { id: 'emily', name: 'Emily', description: 'Young and energetic female voice' },
    { id: 'josh', name: 'Josh', description: 'Deep and confident male voice' }
  ],
  aws: [
    { id: 'joanna', name: 'Joanna', description: 'Professional female voice' },
    { id: 'matthew', name: 'Matthew', description: 'Natural male voice' },
    { id: 'ivy', name: 'Ivy', description: 'Cheerful female voice' }
  ],
  google: [
    { id: 'wavenet-a', name: 'WaveNet A', description: 'High-quality female voice' },
    { id: 'wavenet-b', name: 'WaveNet B', description: 'High-quality male voice' },
    { id: 'wavenet-c', name: 'WaveNet C', description: 'High-quality neutral voice' }
  ]
};

const providers = [
  { id: 'elevenlabs', name: 'ElevenLabs', description: 'High-quality emotional voices' },
  { id: 'aws', name: 'Amazon Polly', description: 'Enterprise-grade text-to-speech' },
  { id: 'google', name: 'Google Cloud', description: 'Natural-sounding voices' }
];

const VoiceConfig: React.FC<VoiceConfigProps> = ({ config, onConfigChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewText, setPreviewText] = useState('Hello! This is a preview of the selected voice.');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const getVolumeIcon = (speed: number) => {
    if (speed < 0.5) return <VolumeX className="h-5 w-5" />;
    if (speed < 1) return <Volume1 className="h-5 w-5" />;
    if (speed < 1.5) return <Volume className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  const handlePreview = () => {
    setIsPlaying(true);
    // Simulate voice preview
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Card className="bg-white p-6 shadow-lg rounded-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Volume2 className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Voice Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="relative">
              <div className="flex items-center space-x-2 mb-2">
                <Settings2 className="h-4 w-4 text-purple-500" />
                <label className="text-sm font-medium text-gray-700">Provider</label>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </div>
              <div className="relative">
                <select
                  value={config.voice.provider}
                  onChange={(e) => onConfigChange('voice.provider', e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Settings2 className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {providers.find(p => p.id === config.voice.provider)?.description}
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="h-4 w-4 text-purple-500" />
                <label className="text-sm font-medium text-gray-700">Voice</label>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </div>
              <div className="relative">
                <select
                  value={config.voice.voice}
                  onChange={(e) => onConfigChange('voice.voice', e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
                >
                  {voices[config.voice.provider as keyof typeof voices].map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Mic className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {voices[config.voice.provider as keyof typeof voices].find(v => v.id === config.voice.voice)?.description}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-purple-500" />
                  <label className="text-sm font-medium text-gray-700">Speed</label>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </div>
                <span className="text-sm text-gray-500">{config.voice.speed}x</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0.25"
                  max="2"
                  step="0.25"
                  value={config.voice.speed}
                  onChange={(e) => onConfigChange('voice.speed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="absolute -top-6 left-0 right-0 flex justify-between px-2">
                  <span className="text-xs text-gray-400">Slow</span>
                  <span className="text-xs text-gray-400">Fast</span>
                </div>
              </div>
            </div>

            <motion.div
              variants={itemVariants}
              className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Voice Preview</h4>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePreview}
                    disabled={isPlaying}
                    className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <PlayCircle className={`h-5 w-5 ${isPlaying ? 'text-purple-600 animate-pulse' : 'text-gray-600'}`} />
                  </motion.button>
                </div>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Enter text to preview..."
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <AnimatePresence>
                  {isPlaying && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center justify-center space-x-2 text-purple-600"
                    >
                      <span className="text-sm">Playing preview...</span>
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-2 h-2 bg-purple-600 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="w-2 h-2 bg-purple-600 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="w-2 h-2 bg-purple-600 rounded-full"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VoiceConfig;
