import { useState, useEffect } from 'react';
import { Card, Title, Text, Tab, TabList, TabGroup, TabPanel, TabPanels, Select, SelectItem, AreaChart, Button } from '@tremor/react';
import { vapiService } from '../services/vapiService';
import { MessageSquare, Settings, BarChart3, Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AssistantConfig {
  model: {
    provider: string;
    model: string;
    emotionRecognitionEnabled: boolean;
    maxTokens: number;
    temperature: number;
    knowledgeBase: string;
    messages: {
      content: string;
    }[];
  };
  firstMessage: string;
  transcriber: {
    provider: string;
    language: string;
    model: string;
  };
  voice: {
    provider: string;
    voiceId: string;
  };
}

const VapiAnalytics = () => {
  const [assistantId] = useState('56c7f0f1-a068-4f7f-ae52-33bb86c3896d');
  const [config, setConfig] = useState<AssistantConfig>({
    model: {
      provider: 'openai',
      model: 'gpt-4',
      emotionRecognitionEnabled: false,
      maxTokens: 150,
      temperature: 0.7,
      knowledgeBase: 'select-files',
      messages: [
        {
          content: ''
        }
      ]
    },
    firstMessage: 'Hello! How can I help you today?',
    transcriber: {
      provider: 'talkscriber',
      language: 'en',
      model: 'whisper'
    },
    voice: {
      provider: 'tavus',
      voiceId: 'default'
    }
  });
  const [initialConfig, setInitialConfig] = useState<AssistantConfig | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('model');
  const [message, setMessage] = useState('');
  const [messagePrompt, setMessagePrompt] = useState('');

  useEffect(() => {
    loadAssistantData();
    loadMetrics();
  }, [assistantId]);

  const loadAssistantData = async () => {
    try {
      const data = await vapiService.getAssistant(assistantId);
      setConfig({
        model: {
          provider: data.model?.provider || 'unknown',
          model: data.model?.model || 'default',
          emotionRecognitionEnabled: data.model?.emotionRecognitionEnabled || false,
          maxTokens: data.model?.maxTokens || 150,
          temperature: data.model?.temperature || 0.7,
          knowledgeBase: data.model?.knowledgeBase || 'select-files',
          messages: data.model?.messages?.map(msg => ({ content: msg.content || '' })) || [
            {
              content: ''
            }
          ]
        },
        firstMessage: data.firstMessage || 'Hello! How can I help you today?',
        transcriber: {
          provider: data.transcriber?.provider || 'unknown',
          language: data.transcriber?.language || 'en',
          model: data.transcriber?.model || 'default'
        },
        voice: {
          provider: data.voice?.provider || 'unknown',
          voiceId: data.voice?.voiceId || 'default'
        }
      });
      setInitialConfig(data);
      setMessagePrompt(data.model?.messages?.[0]?.content || '');
    } catch (error) {
      console.error('Error loading assistant:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await vapiService.getRealTimeMetrics(assistantId);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadAssistantData();
      await loadMetrics();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleConfigUpdate = async (updates: Partial<AssistantConfig>) => {
    try {
      await vapiService.updateAssistant(assistantId, { configuration: { ...config, ...updates } });
      setConfig(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating assistant:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!initialConfig || JSON.stringify(initialConfig) === JSON.stringify(config)) {
      toast.error('No changes detected to update.');
      return;
    }

    try {
      const response = await axios.patch(`https://api.vapi.ai/assistant/${assistantId}`, {
        model: config.model,
        firstMessage: config.firstMessage
      }, {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Assistant updated successfully!');
    } catch (error) {
      console.error('Error updating assistant:', error);
      toast.error('Failed to update assistant.');
    }
  };

  const handleProviderChange = (value: string) => {
    setConfig(prev => ({
      ...prev,
      model: {
        ...prev.model,
        provider: value
      }
    }));
  };

  const handleModelChange = (value: string) => {
    setConfig(prev => ({
      ...prev,
      model: {
        ...prev.model,
        model: value
      }
    }));
  };

  const performanceData = [
    { date: '2024-01', "Success Rate": 92, "Response Time": 85, "User Satisfaction": 88 },
    { date: '2024-02', "Success Rate": 94, "Response Time": 87, "User Satisfaction": 90 },
    { date: '2024-03', "Success Rate": 93, "Response Time": 89, "User Satisfaction": 92 },
    // Add more data points as needed
  ];

  return (
    <div className="p-4 bg-white">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title>Assistant Configuration</Title>
          <div className="flex items-center gap-4">
            <Text>ID: {assistantId}</Text>
            <Button 
              size="sm"
              variant="secondary"
              onClick={refreshData}
              disabled={isRefreshing}
              icon={RefreshCw}
              className={isRefreshing ? 'animate-spin' : ''}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        <TabGroup index={['model', 'transcriber', 'voice', 'functions', 'advanced', 'analysis'].indexOf(activeTab)}
                 onIndexChange={(index) => setActiveTab(['model', 'transcriber', 'voice', 'functions', 'advanced', 'analysis'][index])}>
          <TabList>
            <Tab icon={MessageSquare}>Model</Tab>
            <Tab>Transcriber</Tab>
            <Tab>Voice</Tab>
            <Tab>Functions</Tab>
            <Tab icon={Settings}>Advanced</Tab>
            <Tab icon={BarChart3}>Analysis</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="space-y-4">
                <div>
                  <Text>First Message</Text>
                  <input
                    type="text"
                    value={config.firstMessage}
                    onChange={(e) => handleConfigUpdate({ firstMessage: e.target.value })}
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <Select value={config.model.provider} onValueChange={handleProviderChange} disabled>
                    <SelectItem value="openai">OpenAI</SelectItem>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <Select value={config.model.model} onValueChange={handleModelChange}>
                    <SelectItem value="gpt-4">GPT 4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT 3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT 4 Turbo</SelectItem>
                    <SelectItem value="gpt-4-realtime">GPT 4 Realtime</SelectItem>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Knowledge Base</label>
                  <Select disabled>
                    <SelectItem value="select-files">Select Files</SelectItem>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Message Prompt</label>
                  <textarea
                    value={messagePrompt}
                    onChange={(e) => setMessagePrompt(e.target.value)}
                    className="w-full p-2 border rounded mt-1 h-32"
                    placeholder="Initial message prompt..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.model.temperature}
                    onChange={(e) => handleConfigUpdate({ model: { ...config.model, temperature: parseFloat(e.target.value) } })}
                    className="w-full"
                  />
                  <Text>{config.model.temperature}</Text>
                </div>

                <div className="flex items-center justify-between">
                  <Text>Detect Emotion</Text>
                  <input
                    type="checkbox"
                    checked={config.model.emotionRecognitionEnabled}
                    onChange={(e) => handleConfigUpdate({ model: { ...config.model, emotionRecognitionEnabled: e.target.checked } })}
                    className="ml-2"
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <Select value={config.transcriber.provider} onValueChange={(value) => handleConfigUpdate({ transcriber: { ...config.transcriber, provider: value } })}>
                    <SelectItem value="talkscriber">Talkscriber</SelectItem>
                    <SelectItem value="google-cloud-speech-to-text">Google Cloud Speech-to-Text</SelectItem>
                  </Select>
                </div>

                <div>
                  <Text>Language</Text>
                  <Select value={config.transcriber.language} onValueChange={(value) => handleConfigUpdate({ transcriber: { ...config.transcriber, language: value } })}>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </Select>
                </div>

                <div>
                  <Text>Model</Text>
                  <Select value={config.transcriber.model} onValueChange={(value) => handleConfigUpdate({ transcriber: { ...config.transcriber, model: value } })}>
                    <SelectItem value="whisper">Whisper</SelectItem>
                    <SelectItem value="wav2vec">Wav2Vec</SelectItem>
                  </Select>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <Select value={config.voice.provider} onValueChange={(value) => handleConfigUpdate({ voice: { ...config.voice, provider: value } })}>
                    <SelectItem value="tavus">Tavus</SelectItem>
                    <SelectItem value="google-cloud-text-to-speech">Google Cloud Text-to-Speech</SelectItem>
                  </Select>
                </div>

                <div>
                  <Text>Voice ID</Text>
                  <Select value={config.voice.voiceId} onValueChange={(value) => handleConfigUpdate({ voice: { ...config.voice, voiceId: value } })}>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="en-US-Wavenet-A">English (US) - Wavenet A</SelectItem>
                    <SelectItem value="en-US-Wavenet-B">English (US) - Wavenet B</SelectItem>
                  </Select>
                </div>
              </div>
            </TabPanel>

            {/* Other tab panels */}
            <TabPanel>
              <Text>Functions Configuration</Text>
            </TabPanel>
            <TabPanel>
              <Text>Advanced Settings</Text>
            </TabPanel>
            <TabPanel>
              <Text>Analysis Dashboard</Text>
              <Card className="mt-6">
                <Title>Performance Trends</Title>
                <AreaChart
                  className="mt-4 h-72"
                  data={performanceData}
                  index="date"
                  categories={["Success Rate", "Response Time", "User Satisfaction"]}
                  colors={["emerald", "blue", "purple"]}
                />
              </Card>
            </TabPanel>
          </TabPanels>
        </TabGroup>

        {/* Metrics Display */}
        {metrics && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <Text>Cost</Text>
              </div>
              <Title className="mt-2">${metrics.cost}/min</Title>
            </Card>
            <Card>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <Text>Latency</Text>
              </div>
              <Title className="mt-2">{metrics.latency}ms</Title>
            </Card>
          </div>
        )}

        {/* Message Input */}
        <div className="mt-6">

            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
        </div>
      </Card>
    </div>
  );
};

export default VapiAnalytics;
