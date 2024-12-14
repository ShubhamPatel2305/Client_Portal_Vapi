import React, { useEffect, useState } from 'react';
import { Card } from '@tremor/react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Settings2, Info, MessageSquare, ToggleLeft, ChevronDown } from 'lucide-react';
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
    transition: {
      duration: 0.5
    }
  }
};

const VoiceConfig: React.FC = () => {
  const [vapiData, setVapiData] = useState<VapiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchVapiData();
  }, []);

  const handleConfigChange = async (key: string, value: any) => {
    try {
      // Create a deep copy of the current data
      const updatedData = JSON.parse(JSON.stringify(vapiData));
      
      // Update the nested property using the key path
      const keys = key.split('.');
      let current: any = updatedData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      // Update the state
      setVapiData(updatedData);

      // Send the update to the API
      await axios.patch(`https://api.vapi.ai/assistant/${assistantId}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update data');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!vapiData) return <div>No data available</div>;

  const isElevenLabs = vapiData.voice.provider === '11labs';

  const formatValue = (value: number, decimals: number = 1) => {
    return typeof value === 'number' ? value.toFixed(decimals) : '0';
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
            value={vapiData.voice.provider}
            onChange={(e) => handleConfigChange('voice.provider', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900"
          >
            {providers.map((provider) => (
              <option key={provider.value} value={provider.value} className="text-gray-900">
                {provider.label}
              </option>
            ))}
          </select>
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-900">Voice</label>
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </div>
          <select
            value={vapiData.voice.voiceId}
            onChange={(e) => handleConfigChange('voice.voiceId', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900"
          >
            {(voices[vapiData.voice.provider as keyof typeof voices] || []).map((voice) => (
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
                value={vapiData.voice.stability}
                onChange={(e) => handleConfigChange('voice.stability', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">
                {formatValue(vapiData.voice.stability)}
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
                value={vapiData.voice.similarityBoost}
                onChange={(e) => handleConfigChange('voice.similarityBoost', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">
                {formatValue(vapiData.voice.similarityBoost)}
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
                value={vapiData.voice.style}
                onChange={(e) => handleConfigChange('voice.style', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">
                {formatValue(vapiData.voice.style)}
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
                value={vapiData.voice.optimizeStreamingLatency}
                onChange={(e) => handleConfigChange('voice.optimizeStreamingLatency', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-right">
                {vapiData.voice.optimizeStreamingLatency}
              </div>
            </div>
          </>
        )}

        {/* Filler Injection Toggle */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Filler Injection
          </label>
          <div 
            className={`cursor-pointer p-2 rounded ${vapiData.voice.fillerInjectionEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => handleConfigChange('voice.fillerInjectionEnabled', !vapiData.voice.fillerInjectionEnabled)}
          >
            <ToggleLeft className={`w-6 h-6 ${vapiData.voice.fillerInjectionEnabled ? 'transform rotate-180' : ''}`} />
          </div>
        </div>

        {/* Backchanneling Toggle */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Backchanneling
          </label>
          <div 
            className={`cursor-pointer p-2 rounded ${vapiData.backchannelingEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => handleConfigChange('backchannelingEnabled', !vapiData.backchannelingEnabled)}
          >
            <ToggleLeft className={`w-6 h-6 ${vapiData.backchannelingEnabled ? 'transform rotate-180' : ''}`} />
          </div>
        </div>

        {/* Background Sound */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-900">Background Sound</label>
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </div>
          <select
            value={vapiData.backgroundSound}
            onChange={(e) => handleConfigChange('backgroundSound', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900"
          >
            {backgroundSounds.map((sound) => (
              <option 
                key={sound} 
                value={sound.toLowerCase()} 
                className="text-gray-900"
              >
                {sound}
              </option>
            ))}
          </select>
        </div>

      </Card>
    </motion.div>
  );
};

export default VoiceConfig;
