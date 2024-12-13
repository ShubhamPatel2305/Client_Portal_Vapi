import { useState, useCallback, useEffect } from 'react';
import { Card } from '@tremor/react';
import { Tab } from '@headlessui/react';
import { Settings2, MessageSquare, Mic, PlayCircle, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { produce } from 'immer';
import { set } from 'lodash';
import ModelConfig from '../components/vapi/ModelConfig';
import VoiceConfig from '../components/vapi/VoiceConfig';
import { AdvancedSettings } from '../components/vapi/AdvancedSettings';
import TranscriberConfig from '../components/vapi/TranscriberConfig';
import FunctionConfig from '../components/vapi/FunctionConfig';
import MetricsDisplay from '../components/vapi/MetricsDisplay';
import vapiService from '../services/vapiService';

interface AssistantConfig {
  model: {
    provider: string;
    name: string;
    firstMessage: string;
    systemPrompt: string;
    temperature: number;
    emotionRecognition: boolean;
  };
  transcriber: {
    provider: string;
    language: string;
    model: string;
    enhancedFiltering: boolean;
  };
  voice: {
    provider: string;
    voice: string;
    speed: number;
  };
  functions: {
    enabled: boolean;
    list: string[];
  };
}

interface MetricsState {
  cost: number;
  latency: number;
}

export default function Vapi() {
  const [config, setConfig] = useState<AssistantConfig>({
    model: {
      provider: 'openai',
      name: 'gpt-4',
      firstMessage: '',
      systemPrompt: '',
      temperature: 0.7,
      emotionRecognition: false
    },
    transcriber: {
      provider: 'whisper',
      language: 'en',
      model: 'base',
      enhancedFiltering: false
    },
    voice: {
      provider: 'elevenlabs',
      voice: 'rachel',
      speed: 1.0
    },
    functions: {
      enabled: false,
      list: []
    }
  });

  const [metrics, setMetrics] = useState<MetricsState>({
    cost: 0.08,
    latency: 950
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssistantData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Assuming you have an assistant ID, replace 'your-assistant-id' with the actual ID
      const assistantId = '56c7f0f1-a068-4f7f-ae52-33bb86c3896d'; // You might want to get this from props or environment
      const assistantData = await vapiService.getAssistant(assistantId);
      
      // Map the assistant data to your config structure
      setConfig(prevConfig => ({
        ...prevConfig,
        model: {
          provider: assistantData.model?.provider || prevConfig.model.provider,
          name: assistantData.model?.model || prevConfig.model.name,
          firstMessage: assistantData.firstMessage || prevConfig.model.firstMessage,
          systemPrompt: assistantData.model?.messages?.[0]?.content || prevConfig.model.systemPrompt,
          temperature: assistantData.model?.temperature ?? prevConfig.model.temperature,
          emotionRecognition: assistantData.model?.emotionRecognitionEnabled ?? prevConfig.model.emotionRecognition
        },
        transcriber: {
          provider: assistantData.transcriber?.provider || prevConfig.transcriber.provider,
          language: assistantData.transcriber?.language || prevConfig.transcriber.language,
          model: assistantData.transcriber?.model || prevConfig.transcriber.model,
          enhancedFiltering: assistantData.backgroundDenoisingEnabled ?? prevConfig.transcriber.enhancedFiltering
        },
        voice: {
          provider: assistantData.voice?.provider || prevConfig.voice.provider,
          voice: assistantData.voice?.voiceId || prevConfig.voice.voice,
          speed: prevConfig.voice.speed // Keep existing if not in API
        },
        functions: prevConfig.functions // Keep existing if not in API
      }));

      // Get real-time metrics
      const metrics = await vapiService.getRealTimeMetrics(assistantId);
      setMetrics({
        cost: metrics?.cost || 0.08,
        latency: metrics?.latency || 950
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assistant data');
      console.error('Error fetching assistant data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAssistantData();
  }, [fetchAssistantData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAssistantData();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [fetchAssistantData]);

  const calculateMetrics = (config: AssistantConfig) => {
    let baseCost = 0.08;
    let baseLatency = 950;

    // Model-based calculations
    if (config.model.provider === 'openai') {
      if (config.model.name === 'gpt-4') {
        baseCost *= 1.5;
        baseLatency += 200;
      } else if (config.model.name === 'gpt-3.5-turbo') {
        baseCost *= 0.8;
        baseLatency -= 100;
      }
    }

    // Transcriber-based calculations
    if (config.transcriber.provider === 'whisper') {
      if (config.transcriber.model === 'enhanced') {
        baseCost += 0.02;
        baseLatency += 100;
      } else if (config.transcriber.model === 'premium') {
        baseCost += 0.05;
        baseLatency += 200;
      }
    }

    // Voice-based calculations
    if (config.voice.provider === 'elevenlabs') {
      baseCost += 0.03;
      baseLatency += config.voice.speed > 1 ? 50 : 0;
    }

    return {
      cost: Number(baseCost.toFixed(2)),
      latency: Math.round(baseLatency)
    };
  };

  const handleConfigChange = (key: string, value: any, options?: { skipMetricsUpdate: boolean }) => {
    const newConfig = produce<AssistantConfig>((draft) => {
      set(draft, key, value);
      return draft;
    })(config);
    
    setConfig(newConfig);

    // Only update metrics if skipMetricsUpdate is not true
    if (!options?.skipMetricsUpdate) {
      const newMetrics = calculateMetrics(newConfig);
      setMetrics(newMetrics);
    }
  };

  const tabs = [
    { id: 'model', icon: <MessageSquare />, label: 'Model' },
    { id: 'transcriber', icon: <Settings2 />, label: 'Transcriber' },
    { id: 'voice', icon: <Mic />, label: 'Voice' },
    { id: 'functions', icon: <PlayCircle />, label: 'Functions' },
    { id: 'advanced', icon: <Settings2 />, label: 'Advanced Settings' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assistant Configuration</h1>
        <div className="flex gap-2">
          {error && (
            <div className="text-sm text-red-500 mr-2">
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${isRefreshing || isLoading ? 'animate-spin' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log('Testing assistant...', config);
            }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            <span>Test Assistant</span>
          </motion.button>
        </div>
      </div>

      <Card className="mt-6">
        <MetricsDisplay cost={metrics.cost} latency={metrics.latency} />
        
        <Tab.Group>
          <Tab.List className="flex space-x-4 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                className={({ selected }) =>
                  `flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none ${
                    selected
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <ModelConfig config={config} onConfigChange={handleConfigChange} />
            </Tab.Panel>
            <Tab.Panel>
              <TranscriberConfig config={config} onConfigChange={handleConfigChange} />
            </Tab.Panel>
            <Tab.Panel>
              <VoiceConfig config={config} onConfigChange={handleConfigChange} />
            </Tab.Panel>
            <Tab.Panel>
              <FunctionConfig config={config} onConfigChange={handleConfigChange} />
            </Tab.Panel>
            <Tab.Panel>
              <AdvancedSettings config={config} onConfigChange={handleConfigChange} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Card>

      <div className="fixed bottom-6 right-6 flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            console.log('Saving as draft...', config);
          }}
          className="px-6 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          <span>Save Draft</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            console.log('Sending to Vapi...', config);
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
          <span>Send to Vapi</span>
        </motion.button>
      </div>
    </div>
  );
}
