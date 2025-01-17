import { useState, useCallback, useEffect } from 'react';
import { Card } from '@tremor/react';
import { Tab } from '@headlessui/react';
import { Settings2, MessageSquare, Mic, PlayCircle, Sparkles, RefreshCw, ChevronDown, ChevronUp, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { produce } from 'immer';
import { set } from 'lodash';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Components
import ModelConfig from '../components/vapi/ModelConfig';
import VoiceConfig from '../components/vapi/VoiceConfig';
import TranscriberConfig from '../components/vapi/TranscriberConfig';
import FunctionConfig from '../components/vapi/FunctionConfig';
import MetricsDisplay from '../components/vapi/MetricsDisplay';
import { AdvancedSettings } from '../components/vapi/AdvancedSettings';
import vapiService from '../services/vapiService';
import VoiceAssistant from '../components/VoiceAssistant';

export interface Assistant {
  id: string;
  orgId: string;
  name: string;
  voice: {
    voiceId: string;
    provider: string;
  };
  model: {
    model: string;
    provider: string;
    temperature: number;
    systemPrompt: string;
    emotionRecognitionEnabled: boolean;
  };
  transcriber: {
    language: string;
    provider: string;
  };
  forwardingPhoneNumber: string;
  recordingEnabled: boolean;
  firstMessage: string;
  voicemailMessage: string;
  endCallFunctionEnabled: boolean;
  endCallMessage: string;
  dialKeypadFunctionEnabled: boolean;
  hipaaEnabled: boolean;
  silenceTimeoutSeconds: number;
  maxDurationSeconds: number;
  backgroundSound: string;
  backchannelingEnabled: boolean;
  backgroundDenoisingEnabled: boolean;
  artifactPlan: {
    videoRecordingEnabled: boolean;
  };
  startSpeakingPlan: {
    waitSeconds: number;
    smartEndpointingEnabled: boolean;
  };
  isServerUrlSecretSet: boolean;
}

interface MetricsState {
  cost: number;
  latency: number;
}

export default function Vapi() {
  const VAPI_API_KEY = import.meta.env.VITE_VAPI_API_KEY;
  const ASSISTANT_ID = import.meta.env.VITE_ASSISTANT_ID || '56c7f0f1-a068-4f7f-ae52-33bb86c3896d';

  const [config, setConfig] = useState<Assistant>({
    id: '',
    orgId: '',
    name: '',
    voice: {
      voiceId: '',
      provider: ''
    },
    model: {
      model: '',
      provider: '',
      temperature: 0.7,
      systemPrompt: '',
      emotionRecognitionEnabled: false
    },
    transcriber: {
      language: '',
      provider: ''
    },
    forwardingPhoneNumber: '',
    recordingEnabled: false,
    firstMessage: '',
    voicemailMessage: '',
    endCallFunctionEnabled: false,
    endCallMessage: '',
    dialKeypadFunctionEnabled: false,
    hipaaEnabled: false,
    silenceTimeoutSeconds: 1800,
    maxDurationSeconds: 3600,
    backgroundSound: '',
    backchannelingEnabled: false,
    backgroundDenoisingEnabled: false,
    artifactPlan: {
      videoRecordingEnabled: false
    },
    startSpeakingPlan: {
      waitSeconds: 1,
      smartEndpointingEnabled: true
    },
    isServerUrlSecretSet: false
  });

  const [metrics, setMetrics] = useState<MetricsState>({
    cost: 0.08,
    latency: 950
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSendingToVapi, setIsSendingToVapi] = useState(false);

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const toggleInstructions = () => {
    setIsInstructionsOpen(!isInstructionsOpen);
  };

  const fetchAssistantData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const assistantData = await vapiService.getAssistant(ASSISTANT_ID);
      console.log('Assistant Data:', assistantData);

      // Map the assistant data to your config structure
      setConfig(prevConfig => ({
        ...prevConfig,
        id: assistantData.id || prevConfig.id,
        orgId: assistantData.orgId || prevConfig.orgId,
        name: assistantData.name || prevConfig.name,
        voice: {
          voiceId: assistantData.voice?.voiceId || prevConfig.voice.voiceId,
          provider: assistantData.voice?.provider || prevConfig.voice.provider
        },
        model: {
          model: assistantData.model?.model || prevConfig.model.model,
          provider: assistantData.model?.provider || prevConfig.model.provider,
          temperature: assistantData.model?.temperature ?? prevConfig.model.temperature,
          systemPrompt: assistantData.model?.systemPrompt || prevConfig.model.systemPrompt,
          emotionRecognitionEnabled: assistantData.model?.emotionRecognitionEnabled ?? prevConfig.model.emotionRecognitionEnabled
        },
        transcriber: {
          language: assistantData.transcriber?.language || prevConfig.transcriber.language,
          provider: assistantData.transcriber?.provider || prevConfig.transcriber.provider
        },
        forwardingPhoneNumber: assistantData.forwardingPhoneNumber || prevConfig.forwardingPhoneNumber,
        recordingEnabled: assistantData.recordingEnabled ?? prevConfig.recordingEnabled,
        firstMessage: assistantData.firstMessage || prevConfig.firstMessage,
        voicemailMessage: assistantData.voicemailMessage || prevConfig.voicemailMessage,
        endCallFunctionEnabled: assistantData.endCallFunctionEnabled ?? prevConfig.endCallFunctionEnabled,
        endCallMessage: assistantData.endCallMessage || prevConfig.endCallMessage,
        dialKeypadFunctionEnabled: assistantData.dialKeypadFunctionEnabled ?? prevConfig.dialKeypadFunctionEnabled,
        hipaaEnabled: assistantData.hipaaEnabled ?? prevConfig.hipaaEnabled,
        silenceTimeoutSeconds: assistantData.silenceTimeoutSeconds ?? prevConfig.silenceTimeoutSeconds,
        maxDurationSeconds: assistantData.maxDurationSeconds ?? prevConfig.maxDurationSeconds,
        backgroundSound: assistantData.backgroundSound || prevConfig.backgroundSound,
        backchannelingEnabled: assistantData.backchannelingEnabled ?? prevConfig.backchannelingEnabled,
        backgroundDenoisingEnabled: assistantData.backgroundDenoisingEnabled ?? prevConfig.backgroundDenoisingEnabled,
        artifactPlan: {
          videoRecordingEnabled: assistantData.artifactPlan?.videoRecordingEnabled ?? prevConfig.artifactPlan.videoRecordingEnabled
        },
        startSpeakingPlan: {
          waitSeconds: assistantData.startSpeakingPlan?.waitSeconds ?? prevConfig.startSpeakingPlan.waitSeconds,
          smartEndpointingEnabled: assistantData.startSpeakingPlan?.smartEndpointingEnabled ?? prevConfig.startSpeakingPlan.smartEndpointingEnabled
        },
        isServerUrlSecretSet: assistantData.isServerUrlSecretSet ?? prevConfig.isServerUrlSecretSet
      }));

      // Get real-time metrics
      const metrics = await vapiService.getRealTimeMetrics(ASSISTANT_ID);
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

  const calculateMetrics = (config: Assistant) => {
    let cost = 0.08; // Default cost
    let latency = 950; // Default latency

    // Model-based calculations for OpenAI
    if (config.model.provider === 'openai') {
      switch (config.model.model) {
        case 'gpt-4o':
          cost = 0.15;
          latency = 900;
          break;
        case 'gpt-4o-mini':
          cost = 0.12;
          latency = 800;
          break;
        case 'o1-preview':
          cost = 0.10;
          latency = 700;
          break;
        case 'o1-mini':
          cost = 0.08;
          latency = 650;
          break;
        case 'gpt-4o-realtime-preview-2024-12-17':
          cost = 0.13;
          latency = 750;
          break;
        case 'gpt-4o-mini-realtime-preview-2024-12-17':
          cost = 0.11;
          latency = 700;
          break;
        case 'gpt-3.5-turbo':
          cost = 0.06;
          latency = 600;
          break;
      }
    }
    // Model-based calculations for Anthropic
    else if (config.model.provider === 'anthropic') {
      switch (config.model.model) {
        case 'claude-3-opus-20240229':
          cost = 0.15;
          latency = 1000;
          break;
        case 'claude-3-sonnet-20240229':
          cost = 0.12;
          latency = 1000;
          break;
        case 'claude-3-haiku-20240307':
          cost = 0.10;
          latency = 1000;
          break;
        case 'claude-3-5-sonnet-20240620':
        case 'claude-3-5-sonnet-20241022':
          cost = 0.11;
          latency = 1000;
          break;
        case 'claude-3-5-haiku-20241022':
          cost = 0.09;
          latency = 1000;
          break;
      }
    }

    return {
      cost: Number(cost.toFixed(2)),
      latency: Math.round(latency)
    };
  };

  const handleConfigChange = useCallback((path: string, value: any) => {
    setConfig(prevConfig => {
      const newConfig = produce(prevConfig, (draft: any) => {
        set(draft, path, value);
      });

      // Skip API update if we're changing provider (model will be updated separately)
      if (path === 'model.provider') {
        const newMetrics = calculateMetrics(newConfig);
        setMetrics(newMetrics);
        return newConfig;
      }

      // Prepare data for API
      const apiData = {
        name: newConfig.name,
        voice: {
          voiceId: newConfig.voice.voiceId,
          provider: newConfig.voice.provider
        },
        model: {
          model: newConfig.model.model,
          provider: newConfig.model.provider,
          temperature: newConfig.model.temperature,
          systemPrompt: newConfig.model.systemPrompt,
          emotionRecognitionEnabled: newConfig.model.emotionRecognitionEnabled
        },
        transcriber: {
          language: newConfig.transcriber.language,
          provider: newConfig.transcriber.provider
        },
        forwardingPhoneNumber: newConfig.forwardingPhoneNumber || '',
        recordingEnabled: newConfig.recordingEnabled,
        firstMessage: newConfig.firstMessage,
        voicemailMessage: newConfig.voicemailMessage,
        endCallFunctionEnabled: newConfig.endCallFunctionEnabled,
        endCallMessage: newConfig.endCallMessage,
        dialKeypadFunctionEnabled: newConfig.dialKeypadFunctionEnabled,
        hipaaEnabled: newConfig.hipaaEnabled,
        silenceTimeoutSeconds: newConfig.silenceTimeoutSeconds,
        maxDurationSeconds: newConfig.maxDurationSeconds,
        backgroundSound: newConfig.backgroundSound,
        backchannelingEnabled: newConfig.backchannelingEnabled,
        backgroundDenoisingEnabled: newConfig.backgroundDenoisingEnabled
      };

      // Store current metrics
      const currentMetrics = calculateMetrics(newConfig);

      // Update API
      vapiService.updateAssistant(ASSISTANT_ID, apiData)
        .then(() => {
          // After successful update, ensure metrics are set correctly
          setMetrics(currentMetrics);
        })
        .catch((error) => {
          console.error('Error updating assistant:', error);
          toast.error(error.message);
        });

      return newConfig;
    });
  }, [ASSISTANT_ID]);

  const handleMetricsChange = (newMetrics: { cost: number; latency: number }) => {
    setMetrics(newMetrics);
  };

  const handleSendToVapi = async () => {
    // Start loading state
    setIsSendingToVapi(true);
  
    try {
      // Prepare the config object for the API
      const apiConfig = {
        model: {
          model: config.model.model,
          provider: config.model.provider,
          systemPrompt: config.model.systemPrompt,
          temperature: config.model.temperature,
          emotionRecognitionEnabled: config.model.emotionRecognitionEnabled
        },
        transcriber: {
          language: config.transcriber.language,
          provider: config.transcriber.provider
        },
        voice: {
          voiceId: config.voice.voiceId,
          provider: config.voice.provider
        },
        dialKeypadFunctionEnabled: config.dialKeypadFunctionEnabled,
        endCallFunctionEnabled: config.endCallFunctionEnabled,
        forwardingPhoneNumber: config.forwardingPhoneNumber,
        hipaaEnabled: config.hipaaEnabled,
        voicemailMessage: config.voicemailMessage,
        endCallMessage: config.endCallMessage,
        recordingEnabled: config.recordingEnabled,
        silenceTimeoutSeconds: config.silenceTimeoutSeconds,  
        maxDurationSeconds: config.maxDurationSeconds,
        firstMessage: config.firstMessage,
        artifactPlan: {
          videoRecordingEnabled: config.artifactPlan.videoRecordingEnabled
        },
        startSpeakingPlan: {
          waitSeconds: config.startSpeakingPlan.waitSeconds,
          smartEndpointingEnabled: config.startSpeakingPlan.smartEndpointingEnabled
        }
      };
  
      // Perform the API call
      const response = await axios.patch(
        `https://api.vapi.ai/assistant/${ASSISTANT_ID}`, 
        apiConfig,
        {
          headers: {
            'Authorization': `Bearer ${VAPI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Check for successful status
      if (response.status === 200) {
        // Success toast
        toast.success('Assistant configuration updated successfully', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
          },
          icon: '✅'
        });
  
        // Optionally refetch the assistant data to ensure UI is in sync
        await fetchAssistantData();
      }
    } catch (error) {
      // Type guard for axios error
      if (axios.isAxiosError(error)) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response?.data?.message || 
                             error.response?.data?.error || 
                             'Failed to update assistant configuration';
        
        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#FF6B6B',
            color: 'white',
            fontWeight: 'bold',
          },
          icon: '❌'
        });
  
        // Log the full error for debugging
        console.error('Axios Error:', {
          response: error.response,
          request: error.request,
          message: error.message
        });
      } else {
        // Handle non-axios errors
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred';
  
        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#FF6B6B',
            color: 'white',
            fontWeight: 'bold',
          },
          icon: '❌'
        });
  
        // Log the unexpected error
        console.error('Unexpected Error:', error);
      }
    } finally {
      // Always stop loading state
      setIsSendingToVapi(false);
    }
  };

  const tabs = [
    { id: 'model', icon: <MessageSquare />, label: 'Model' },
    { id: 'transcriber', icon: <Settings2 />, label: 'Transcriber' },
    { id: 'voice', icon: <Mic />, label: 'Voice' },
    { id: 'functions', icon: <PlayCircle />, label: 'Functions' },
    { id: 'advanced', icon: <Settings2 />, label: 'Advanced' },
  ];

  return (
    <div className="flex flex-col space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Assistant Configuration</h1>
          <p className="text-gray-600">Configure your AI assistant's behavior and capabilities</p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleInstructions}
            className="flex items-center space-x-2 px-4 py-2.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl shadow-sm hover:bg-teal-100 hover:border-teal-300 transition-all duration-200"
          >
            <HelpCircle className="w-5 h-5 text-teal-600" />
            <span className="font-medium">Configuration Instructions</span>
          </motion.button>
          <VoiceAssistant config={config} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            className="p-2.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl shadow-sm hover:bg-teal-100 hover:border-teal-300 transition-all duration-200"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isInstructionsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={toggleInstructions}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Settings2 className="w-6 h-6 mr-3 text-blue-600" />
                  Configuration Instructions
                </h3>
                <button
                  onClick={toggleInstructions}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">1</span>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700">Customize your AI assistant's settings using the tabs below</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">2</span>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700">Adjust model, transcriber, voice, and function settings</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">3</span>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700">Configure advanced options for enhanced control</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">4</span>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700">Click "Update AI Agent" to apply your changes</p>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <ModelConfig
              config={config}
              onConfigChange={handleConfigChange}
              onMetricsChange={handleMetricsChange}
            />
          </Tab.Panel>
          <Tab.Panel>
            <TranscriberConfig config={config} onConfigChange={handleConfigChange} />
          </Tab.Panel>
          <Tab.Panel>
            <VoiceConfig />
          </Tab.Panel>
          <Tab.Panel>
            <FunctionConfig config={config} onConfigChange={handleConfigChange} />
          </Tab.Panel>
          <Tab.Panel>
            <AdvancedSettings config={config} onConfigChange={handleConfigChange} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="fixed bottom-6 right-6 flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendToVapi}
          disabled={isSendingToVapi}
          className={`px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 ${isSendingToVapi ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSendingToVapi ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Settings2 className="w-5 h-5 mr-2" />
          )}
          <span>{isSendingToVapi ? 'Updating...' : 'Update AI Agent'}</span>
        </motion.button>
        <Toaster />
      </div>
    </div>
  );
}