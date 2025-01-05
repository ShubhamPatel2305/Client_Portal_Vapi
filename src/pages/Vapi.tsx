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
  dialKeypadFunctionEnabled: boolean;
  endCallFunctionEnabled: boolean;
  forwardingPhoneNumber: string;
  hipaaEnabled: boolean;
  voicemailMessage: string;
  endCallMessage: string;
  recordingEnabled: boolean;
  videoRecordingEnabled: boolean;
  silenceTimeoutSeconds: number;
  maxDurationSeconds: number;
  waitSeconds: number;
  smartEndpointingEnabled: boolean;
  privacy?: {
    hipaa?: boolean;
    audioRecording?: boolean;
    videoRecording?: boolean;
  };
  startSpeaking?: {
    waitSeconds?: number;
    smartEndpointing?: boolean;
    onPunctuationSeconds?: number;
    onNoPunctuationSeconds?: number;
    onNumberSeconds?: number;
  };
  messages?: {
    voicemail?: string;
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
    },
    dialKeypadFunctionEnabled: false,
    endCallFunctionEnabled: false,
    forwardingPhoneNumber: '',
    hipaaEnabled: true,
    voicemailMessage: "Please drop a message",
    endCallMessage: "Thank you for contacting.",
    recordingEnabled: false,
    videoRecordingEnabled: false,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 600,
    waitSeconds: 60,
    smartEndpointingEnabled: true
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
      // Assuming you have an assistant ID, replace 'your-assistant-id' with the actual ID
      const assistantId = '45e1846e-917e-48e6-8859-b5d74051ee35'; // You might want to get this from props or environment
      const assistantData = await vapiService.getAssistant(assistantId);
      console.log(assistantData);
  
      // Map the assistant data to your config structure
      setConfig(prevConfig => ({
        ...prevConfig,
        model: {
          provider: assistantData.model?.provider || prevConfig.model.provider,
          name: assistantData.model?.model || prevConfig.model.name,
          firstMessage: assistantData.firstMessage || prevConfig.model.firstMessage,
          systemPrompt: assistantData.model?.messages?.find(msg => msg.role === 'system')?.content || prevConfig.model.systemPrompt,
          temperature: assistantData.model?.temperature ?? prevConfig.model.temperature,
          emotionRecognition: prevConfig.model.emotionRecognition // Not in new API response, keep existing
        },
        transcriber: {
          provider: prevConfig.transcriber.provider, // Not in new API response, keep existing
          language: prevConfig.transcriber.language, // Not in new API response, keep existing
          model: prevConfig.transcriber.model, // Not in new API response, keep existing
          enhancedFiltering: prevConfig.transcriber.enhancedFiltering // Not in new API response, keep existing
        },
        voice: {
          provider: assistantData.voice?.provider || prevConfig.voice.provider,
          voice: assistantData.voice?.voiceId || prevConfig.voice.voice,
          speed: prevConfig.voice.speed // Keep existing if not in API
        },
        functions: prevConfig.functions, // Not in new API response, keep existing
        dialKeypadFunctionEnabled: prevConfig.dialKeypadFunctionEnabled, // Not in new API response, keep existing
        endCallFunctionEnabled: prevConfig.endCallFunctionEnabled, // Not in new API response, keep existing
        forwardingPhoneNumber: prevConfig.forwardingPhoneNumber, // Not in new API response, keep existing
        hipaaEnabled: prevConfig.hipaaEnabled, // Not in new API response, keep existing
        voicemailMessage: assistantData.voicemailMessage || prevConfig.voicemailMessage,
        endCallMessage: assistantData.endCallMessage || prevConfig.endCallMessage,
        videoRecordingEnabled: prevConfig.videoRecordingEnabled, // Not in new API response, keep existing
        silenceTimeoutSeconds: prevConfig.silenceTimeoutSeconds, // Not in new API response, keep existing
        maxDurationSeconds: prevConfig.maxDurationSeconds, // Not in new API response, keep existing
        waitSeconds: prevConfig.waitSeconds, // Not in new API response, keep existing
        smartEndpointingEnabled: prevConfig.smartEndpointingEnabled // Not in new API response, keep existing
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

  const handleSendToVapi = async () => {
    // Start loading state
    setIsSendingToVapi(true);
  
    try {
      // Get the API key from environment variables
      const VAPI_API_KEY = import.meta.env.VITE_VAPI_API_KEY;
      
      // Prepare the config object for the API
      const apiConfig = {
        model: {
          provider: config.model.provider,
          model: config.model.name,
          systemPrompt: config.model.systemPrompt,
          temperature: config.model.temperature,
          emotionRecognitionEnabled: config.model.emotionRecognition
        },
        transcriber: {
          provider: config.transcriber.provider,
          language: config.transcriber.language,
          model: config.transcriber.model
        },
        voice: {
          provider: config.voice.provider,
          voiceId: config.voice.voice
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
        firstMessage: config.model.firstMessage
      };
  
      // Perform the API call
      const assistantId = '45e1846e-917e-48e6-8859-b5d74051ee35';
      const response = await axios.patch(
        `https://api.vapi.ai/assistant/${assistantId}`, 
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
            <ModelConfig config={config} onConfigChange={handleConfigChange} />
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