import React, { useState, useEffect } from 'react';
import { Card, Title, Text, Tab, TabList, TabGroup, TabPanel, TabPanels, Select, SelectItem, AreaChart } from '@tremor/react';
import { vapiService } from '../services/vapiService';
import { MessageSquare, Settings, BarChart3, Clock } from 'lucide-react';

interface AssistantConfig {
  model: string;
  firstMessage: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  provider: string;
  detectEmotion: boolean;
}

const VapiAnalytics = () => {
  const [assistantId] = useState('56c7f0f1-a068-4f7f-ae52-33bb86c3896d');
  const [config, setConfig] = useState<AssistantConfig>({
    model: 'gpt-4o',
    firstMessage: 'hello how are you',
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 150,
    provider: 'openai',
    detectEmotion: false
  });
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('model');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAssistantData();
    loadMetrics();
  }, [assistantId]);

  const loadAssistantData = async () => {
    try {
      const data = await vapiService.getAssistant(assistantId);
      setConfig(data.configuration);
    } catch (error) {
      console.error('Error loading assistant:', error);
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await vapiService.getRealTimeMetrics(assistantId);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
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
    if (!message.trim()) return;
    try {
      await vapiService.sendMessage(assistantId, message);
      setMessage('');
      // Reload metrics after sending message
      loadMetrics();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleProviderChange = (value: string) => {
    setConfig(prev => ({ ...prev, provider: value }));
  };

  const handleModelChange = (value: string) => {
    setConfig(prev => ({ ...prev, model: value }));
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
          <Text>ID: {assistantId}</Text>
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
              <div className="space-y-6">
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
                  <Text>System Prompt</Text>
                  <textarea
                    value={config.systemPrompt}
                    onChange={(e) => handleConfigUpdate({ systemPrompt: e.target.value })}
                    className="w-full p-2 border rounded mt-1 h-32"
                  />
                </div>

                <div>
                  <Text>Provider</Text>
                  <Select 
                    value={config.provider}
                    onValueChange={handleProviderChange}
                  >
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                  </Select>
                </div>

                <div>
                  <Text>Model</Text>
                  <Select 
                    value={config.model}
                    onValueChange={handleModelChange}
                  >
                    <SelectItem value="gpt-4o">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </Select>
                </div>

                <div>
                  <Text>Temperature</Text>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => handleConfigUpdate({ temperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <Text>{config.temperature}</Text>
                </div>

                <div>
                  <Text>Max Tokens</Text>
                  <input
                    type="number"
                    value={config.maxTokens}
                    onChange={(e) => handleConfigUpdate({ maxTokens: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Text>Detect Emotion</Text>
                  <input
                    type="checkbox"
                    checked={config.detectEmotion}
                    onChange={(e) => handleConfigUpdate({ detectEmotion: e.target.checked })}
                    className="ml-2"
                  />
                </div>
              </div>
            </TabPanel>

            {/* Other tab panels */}
            <TabPanel>
              <Text>Transcriber Configuration</Text>
            </TabPanel>
            <TabPanel>
              <Text>Voice Configuration</Text>
            </TabPanel>
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
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VapiAnalytics;
