import { useState } from 'react';
import { Card } from '@tremor/react';
import { Tab } from '@headlessui/react';
import { Settings2, MessageSquare, Mic, PlayCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { produce } from 'immer';
import { set } from 'lodash';
import ModelConfig from '../components/vapi/ModelConfig';
import VoiceConfig from '../components/vapi/VoiceConfig';
import TranscriberConfig from '../components/vapi/TranscriberConfig';
import FunctionConfig from '../components/vapi/FunctionConfig';
import MetricsDisplay from '../components/vapi/MetricsDisplay';

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
    { id: 'functions', icon: <PlayCircle />, label: 'Functions' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assistant Configuration</h1>
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
