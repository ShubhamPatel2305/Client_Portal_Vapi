import React, { useEffect, useState } from 'react';
import { Card } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, Settings2, Info, MessageSquare, ChevronDown} from 'lucide-react';
import axios from 'axios';
import { getApiKey, getAssistantId } from '../../services/credentialsService';

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

const backgroundSounds = [
  { id: 'office', label: 'Office', icon: '🏢' },
  { id: 'off', label: 'Off', icon: '🔇' }
] as const;

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
    backgroundSound: 'off',
    backchannelingEnabled: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVapiData = async () => {
      try {
        const response = await axios.get(`https://api.vapi.ai/assistant/${getAssistantId()}`, {
          headers: {
            'Authorization': `Bearer ${getApiKey()}`,
            'Content-Type': 'application/json',
          },
        });
        
        // Transform the response data to ensure all required fields exist
        const transformedData = {
          ...response.data,
          voice: {
            ...response.data.voice,
            stability: response.data.voice?.stability ?? 0.5,
            similarityBoost: response.data.voice?.similarityBoost ?? 0.5,
          },
          // Ensure backgroundSound is one of the allowed values
          backgroundSound: ['office', 'off'].includes(response.data.backgroundSound) 
            ? response.data.backgroundSound 
            : 'off'
        };
        
        setVapiData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load voice configuration. Please try again.');
      }
    };

    fetchVapiData();
  }, []);

  const handleConfigChange = async (key: string, value: any) => {
    try {
      // Create the update payload
      let payload = {};
      
      if (key === 'voice.voiceId') {
        // For voiceId updates, include it in the voice object
        payload = {
          voice: {
            ...vapiData.voice,
            voiceId: value
          }
        };
      } else if (key === 'voice.stability' || key === 'voice.similarityBoost') {
        const voiceKey = key.split('.')[1];
        const numValue = parseFloat(value);
        
        if (isNaN(numValue)) {
          setError(`${voiceKey} must be a valid number`);
          return;
        }
        
        payload = {
          voice: {
            ...vapiData.voice,
            [voiceKey]: numValue
          }
        };
      } else {
        payload = { [key]: value };
      }

      // Update UI immediately for better UX
      setVapiData(prev => {
        if (key.includes('voice.')) {
          const voiceKey = key.split('.')[1];
          const newValue = voiceKey === 'voiceId' ? value : parseFloat(value);
          return {
            ...prev,
            voice: {
              ...prev.voice,
              [voiceKey]: newValue
            }
          };
        }
        return {
          ...prev,
          [key]: value
        };
      });

      // Make API call with the payload
      const response = await axios.patch(
        `https://api.vapi.ai/assistant/${getAssistantId()}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${getApiKey()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update state with response data
      if (response.data) {
        setVapiData(prev => ({
          ...prev,
          ...response.data
        }));
      }

      setError(null);
    } catch (err) {
      console.error('Error updating configuration:', err);
      
      // On error, fetch the latest state from API
      try {
        const response = await axios.get(`https://api.vapi.ai/assistant/${getAssistantId()}`, {
          headers: {
            'Authorization': `Bearer ${getApiKey()}`,
            'Content-Type': 'application/json',
          },
        });
        setVapiData(response.data);
        setError(`Failed to update ${key.split('.').pop()}. Please try again.`);
      } catch (fetchErr) {
        console.error('Error fetching latest data:', fetchErr);
        setError('Failed to update. Please refresh the page.');
      }
    }
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

            {/* Voice ID Input */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Mic className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">Voice ID</label>
                  <p className="text-xs text-gray-600">Enter or paste your voice ID</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={vapiData.voice?.voiceId ?? ''}
                  onChange={(e) => handleConfigChange('voice.voiceId', e.target.value)}
                  placeholder="Enter voice ID..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
              </div>
            </motion.div>

            {/* Voice Parameters */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Settings2 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">Voice Parameters</label>
                  <p className="text-xs text-gray-600">Adjust voice stability and similarity</p>
                </div>
              </div>

              {/* Stability Slider */}
              <motion.div 
                className="space-y-2" 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Stability</label>
                  <span className="text-sm text-gray-600">{vapiData.voice?.stability?.toFixed(2) ?? '0.50'}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={vapiData.voice?.stability ?? 0.5}
                    onChange={(e) => handleConfigChange('voice.stability', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600"
                  />
                  <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>1</span>
                  </div>
                </div>
              </motion.div>

              {/* Similarity Boost Slider */}
              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Similarity Boost</label>
                  <span className="text-sm text-gray-600">{vapiData.voice?.similarityBoost?.toFixed(2) ?? '0.75'}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={vapiData.voice?.similarityBoost ?? 0.75}
                    onChange={(e) => handleConfigChange('voice.similarityBoost', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600"
                  />
                  <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>1</span>
                  </div>
                </div>
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
                {backgroundSounds.map((sound) => {
                  const isSelected = vapiData.backgroundSound === sound.id;
                  return (
                    <motion.button
                      key={sound.id}
                      onClick={() => handleConfigChange('backgroundSound', sound.id)}
                      className={`p-3 rounded-xl flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                        isSelected
                          ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500 ring-opacity-50'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                        backgroundColor: isSelected ? 'rgb(224 231 255)' : 'rgb(249 250 251)',
                        color: isSelected ? 'rgb(79 70 229)' : 'rgb(75 85 99)',
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xl">{sound.icon}</span>
                      <span className="text-sm font-medium">{sound.label}</span>
                    </motion.button>
                  );
                })}
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
