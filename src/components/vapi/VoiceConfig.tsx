import React, { useEffect, useState } from 'react';
import { Card } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, Settings2, Info, MessageSquare, ToggleLeft, ChevronDown, Wand2 } from 'lucide-react';
import axios from 'axios';

interface VapiResponse {
  id: string;
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
  backgroundSound: string;
  backchannelingEnabled: boolean;
}

const providers = [
  { value: '11labs', label: 'ElevenLabs', description: 'Emotional and natural voices', icon: '🎭' },
];

const voices = {
  '11labs': [
    'francotest', 'Louis', 'test3', 'franco.2', 'test', 'belal batrawy',
    'Chris male', 'test2', 'test', 'f1', 'test', 'Bobby.Test8', 'Testinggg',
    'Luca Brasi Gentile', 'Paul', 'HARMONY', 'Andrei male', 'Cicek',
    'Jarpa Test - Francisco', 'Kanika', 'Janvi', 'HMIDA'
  ].map(name => ({ id: name, name })),
};

const backgroundSounds = [
  { id: 'office', label: 'Office', icon: '🏢' },
  { id: 'default', label: 'Default', icon: '🎵' },
  { id: 'off', label: 'Off', icon: '🔇' }
];

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

const VoiceConfig: React.FC = () => {
  const [vapiData, setVapiData] = useState<VapiResponse>({
    id: '',
    voice: {
      model: '',
      style: 0,
      voiceId: '',
      provider: '11labs',
      stability: 0.5,
      similarityBoost: 0.5,
      inputMinCharacters: 0,
      fillerInjectionEnabled: false,
      optimizeStreamingLatency: 0,
    },
    backgroundSound: 'default',
    backchannelingEnabled: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [useManualVoiceId, setUseManualVoiceId] = useState(false);

  const VAPI_API_KEY = import.meta.env.VITE_VAPI_API_KEY;
  const assistantId = '56c7f0f1-a068-4f7f-ae52-33bb86c3896d';

  useEffect(() => {
    const fetchVapiData = async () => {
      try {
        const response = await axios.get(`https://api.vapi.ai/assistant/${assistantId}`, {
          headers: {
            'Authorization': `Bearer ${VAPI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        setVapiData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchVapiData();
  }, []);

  const handleConfigChange = async (key: string, value: any) => {
    // Optimistically update the UI
    const updatedData = {
      ...vapiData,
      voice: { ...vapiData.voice },
    };
    
    const keys = key.split('.');
    let current: any = updatedData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setVapiData(updatedData);

    try {
      await axios.patch(`https://api.vapi.ai/assistant/${assistantId}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      setError(null);
    } catch (err) {
      console.error('Error updating configuration:', err);
      // Don't revert the UI state, just show the error
      setError('Changes may not have been saved. The interface will continue to work.');
    }
  };

  const isElevenLabs = vapiData.voice.provider === '11labs';
  const formatValue = (value: number, decimals: number = 1) => {
    return typeof value === 'number' ? value.toFixed(decimals) : '0';
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <Card className="bg-white p-6 shadow-lg rounded-xl">
          <motion.div className="space-y-6" layout>
            {/* Header */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Voice Settings</h2>
                  <p className="text-sm text-gray-600">Configure your assistant's voice and speech parameters</p>
                </div>
              </div>
            </motion.div>

            {/* Provider Selection */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Settings2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">Voice Provider</label>
                  <p className="text-xs text-gray-600">Select your preferred AI voice provider</p>
                </div>
              </div>
              <div className="relative">
                <select
                  value={vapiData.voice.provider}
                  onChange={(e) => handleConfigChange('voice.provider', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900 pr-10"
                >
                  {providers.map((provider) => (
                    <option key={provider.value} value={provider.value} className="text-gray-900">
                      {provider.icon} {provider.label} - {provider.description}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>

            {/* Voice Selection */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-teal-50">
                    <Mic className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Voice Selection</label>
                    <p className="text-xs text-gray-600">Choose the voice for your assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Enter ID manually</label>
                  <input
                    type="checkbox"
                    checked={useManualVoiceId}
                    onChange={(e) => setUseManualVoiceId(e.target.checked)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="relative">
                {useManualVoiceId ? (
                  <input
                    type="text"
                    value={vapiData.voice.voiceId}
                    onChange={(e) => handleConfigChange('voice.voiceId', e.target.value)}
                    placeholder="Enter voice ID"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  />
                ) : (
                  <select
                    value={vapiData.voice.voiceId}
                    onChange={(e) => handleConfigChange('voice.voiceId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900 pr-10"
                  >
                    <option value="">Select a voice</option>
                    {voices['11labs'].map((voice) => (
                      <option key={voice.id} value={voice.id} className="text-gray-900">
                        {voice.name}
                      </option>
                    ))}
                  </select>
                )}
                {!useManualVoiceId && (
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                )}
              </div>
            </motion.div>

            {/* Voice Parameters - Always show for ElevenLabs */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Wand2 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Voice Parameters</h3>
                  <p className="text-xs text-gray-600">Fine-tune your voice settings</p>
                </div>
              </div>

              {/* Stability Slider */}
              <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Stability</label>
                  <span className="text-sm text-gray-600">{formatValue(vapiData.voice.stability)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={vapiData.voice.stability}
                  onChange={(e) => handleConfigChange('voice.stability', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600"
                />
              </motion.div>

              {/* Similarity Boost Slider */}
              <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Similarity Boost</label>
                  <span className="text-sm text-gray-600">{formatValue(vapiData.voice.similarityBoost)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={vapiData.voice.similarityBoost}
                  onChange={(e) => handleConfigChange('voice.similarityBoost', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600"
                />
              </motion.div>
            </motion.div>

            {/* Background Sound */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <Volume2 className="h-4 w-4 text-indigo-500" />
                <label className="text-sm font-medium text-gray-700">Background Sound</label>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {backgroundSounds.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => handleConfigChange('backgroundSound', sound.id)}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                      vapiData.backgroundSound === sound.id
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{sound.icon}</span>
                    <span className="text-sm font-medium">{sound.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Additional Settings */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Enable Natural Conversation</h4>
                      <p className="text-xs text-gray-500">Make the bot say words like 'mhmm', 'ya' etc. while listening to make the conversation sounds natural. Default disabled</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vapiData.backchannelingEnabled}
                      onChange={(e) => handleConfigChange('backchannelingEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Card>
        {error && (
          <div className="p-4 bg-red-50 rounded-xl text-red-600 flex items-center gap-2">
            <Info className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceConfig;
