import React from 'react';
import { Card } from '@tremor/react';
import { Switch } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Sparkles, Thermometer, MessageSquare, Bot, Cpu, Info } from 'lucide-react';

interface ModelConfigProps {
  config: {
    model: {
      provider: string;
      name: string;
      firstMessage: string;
      systemPrompt: string;
      temperature: number;
      emotionRecognition: boolean;
    };
  };
  onConfigChange: (key: string, value: any, options?: { skipMetricsUpdate: boolean }) => void;
}

interface ModelOption {
  value: string;
  label: string;
  tags?: string[];
  latency?: number;
  cost?: number;
}

const ModelConfig: React.FC<ModelConfigProps> = ({ config, onConfigChange }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const openAiModels: ModelOption[] = [
    { value: 'gpt-4o', label: 'GPT 4o', latency: 900, cost: 0.11 },
    { value: 'gpt-4o-mini', label: 'GPT 4o Mini', latency: 750, cost: 0.08, tags: ['Fastest', 'Cheapest'] },
    { value: 'gpt-3.5-turbo', label: 'GPT 3.5 Turbo', latency: 700, cost: 0.08 },
    { value: 'gpt-4-turbo', label: 'GPT 4 Turbo', latency: 1250, cost: 0.24 },
    { value: 'gpt-4o-realtime', label: 'GPT 4o Realtime', latency: 700, cost: 0.74 }
  ];

  const anthropicModels: ModelOption[] = [
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus', latency: 1450, cost: 0.33 },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', latency: 1450, cost: 0.12 },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', latency: 850, cost: 0.08 },
    { value: 'claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet', latency: 950, cost: 0.12 },
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', latency: 950, cost: 0.12 },
    { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', latency: 950, cost: 0.12 }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Messages */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="bg-white p-6 shadow-lg rounded-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Message
                  </label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <textarea
                  value={config.model.firstMessage}
                  onChange={(e) => {
                    // Only update the first message without triggering pricing/latency changes
                    onConfigChange('model.firstMessage', e.target.value, { skipMetricsUpdate: true });
                  }}
                  className="w-full h-[50px] px-4 py-3 bg-white text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter the initial message your assistant will use..."
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    System Prompt
                  </label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <textarea
                  value={config.model.systemPrompt}
                  onChange={(e) => {
                    // Only update the system prompt without triggering pricing/latency changes
                    onConfigChange('model.systemPrompt', e.target.value, { skipMetricsUpdate: true });
                  }}
                  className="w-full h-64 px-4 py-3 bg-white text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Add your prompt here..."
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column - Model Settings */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="bg-white p-6 shadow-lg rounded-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bot className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Model Settings</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider
                  </label>
                  <div className="relative">
                    <select
                      value={config.model.provider}
                      onChange={(e) => onConfigChange('model.provider', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 text-gray-900"
                    >
                      <option value="openai" className="text-gray-900">OpenAI</option>
                      <option value="anthropic" className="text-gray-900">Anthropic</option>
                    </select>
                    <Cpu className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </motion.div>

                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <div className="relative">
                    <select
                      value={config.model.name}
                      onChange={(e) => onConfigChange('model.name', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 text-gray-900"
                    >
                      {config.model.provider === 'openai' ? (
                        openAiModels.map((model) => (
                          <option key={model.value} value={model.value} className="text-gray-900">
                            {model.label}
                          </option>
                        ))
                      ) : (
                        anthropicModels.map((model) => (
                          <option key={model.value} value={model.value} className="text-gray-900">
                            {model.label}
                          </option>
                        ))
                      )}
                    </select>
                    <Bot className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {config.model.provider === 'openai' ? (
                        openAiModels.find(m => m.value === config.model.name)?.latency && (
                          <span className="text-xs text-gray-500">
                            {openAiModels.find(m => m.value === config.model.name)?.latency} • {openAiModels.find(m => m.value === config.model.name)?.cost}
                          </span>
                        )
                      ) : (
                        anthropicModels.find(m => m.value === config.model.name)?.latency && (
                          <span className="text-xs text-gray-500">
                            {anthropicModels.find(m => m.value === config.model.name)?.latency} • {anthropicModels.find(m => m.value === config.model.name)?.cost}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <label className="text-sm font-medium text-gray-700">
                        Temperature
                      </label>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {config.model.temperature}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-2 left-0 right-0 flex justify-between text-xs text-gray-500">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.model.temperature}
                      onChange={(e) => onConfigChange('model.temperature', parseFloat(e.target.value))}
                      className="w-full h-2 mt-6 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Emotion Recognition
                      </label>
                      <p className="text-xs text-gray-500">
                        Enable emotional response analysis
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={config.model.emotionRecognition}
                    onChange={(value) => onConfigChange('model.emotionRecognition', value)}
                    className={`${
                      config.model.emotionRecognition ? 'bg-purple-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        config.model.emotionRecognition ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModelConfig;
