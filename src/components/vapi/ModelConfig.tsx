import React from 'react';
import { Card } from '@tremor/react';
import { Switch } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Sparkles, Thermometer, MessageSquare, Bot, Cpu, Info } from 'lucide-react';

interface ModelConfigProps {
  config: {
    model: {
      model: string;
      provider: string;
      temperature: number;
      systemPrompt: string;
      emotionRecognitionEnabled: boolean;
    };
    firstMessage: string;
  };
  onConfigChange: (path: string, value: any) => void;
  onMetricsChange: (metrics: { cost: number; latency: number }) => void;
}

interface ModelOption {
  value: string;
  label: string;
  tags?: string[];
  latency?: number;
  cost?: number;
}

const ModelConfig: React.FC<ModelConfigProps> = ({ config, onConfigChange, onMetricsChange }) => {
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

  const handleModelChange = (modelValue: string) => {
    onConfigChange('model.model', modelValue);
    
    // Find the selected model to get its metrics
    const models = config.model.provider === 'openai' ? openAiModels : anthropicModels;
    const selectedModel = models.find(model => model.value === modelValue);
    
    if (selectedModel) {
      // Update metrics in parent component
      onMetricsChange({
        cost: selectedModel.cost,
        latency: selectedModel.latency
      });
    }
  };

  const handleTemperatureChange = (value: number) => {
    onConfigChange('model.temperature', value);
  };

  const handleSystemPromptChange = (value: string) => {
    onConfigChange('model.systemPrompt', value);
  };

  const handleEmotionRecognitionChange = (value: boolean) => {
    onConfigChange('model.emotionRecognitionEnabled', value);
  };

  const handleProviderChange = (newProvider: string) => {
    // First update the provider
    onConfigChange('model.provider', newProvider);
    
    // Set default model based on provider
    const defaultModel = newProvider === 'openai' ? 'gpt-4o' : 'claude-3-opus-20240229';
    
    // Update the model after a short delay to ensure provider is updated first
    setTimeout(() => {
      onConfigChange('model.model', defaultModel);
    }, 100);
  };

  const openAiModels: ModelOption[] = [
    { value: 'gpt-4o', label: 'GPT-4o', latency: 900, cost: 0.15 },
    { value: 'gpt-4o-mini', label: 'GPT-4o-Mini', latency: 800, cost: 0.12 },
    { value: 'o1-preview', label: 'O1 Preview', latency: 700, cost: 0.10 },
    { value: 'o1-mini', label: 'O1 Mini', latency: 650, cost: 0.08 },
    { value: 'gpt-4o-realtime-preview-2024-12-17', label: 'GPT-4 Opus Realtime', latency: 750, cost: 0.13 },
    { value: 'gpt-4o-mini-realtime-preview-2024-12-17', label: 'GPT-4 Opus Mini Realtime', latency: 700, cost: 0.11 },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', latency: 600, cost: 0.06 }
  ];

  const anthropicModels: ModelOption[] = [
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus', latency: 1000, cost: 0.15 },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', latency: 1000, cost: 0.12 },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', latency: 1000, cost: 0.10 },
    { value: 'claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet', latency: 1000, cost: 0.11 },
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', latency: 1000, cost: 0.11 },
    { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', latency: 1000, cost: 0.09 }
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
                  value={config.firstMessage || ''}
                  onChange={(e) => onConfigChange('firstMessage', e.target.value)}
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
                  value={config.model.systemPrompt || ''}
                  onChange={(e) => handleSystemPromptChange(e.target.value)}
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
                      onChange={(e) => handleProviderChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 text-gray-900"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
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
                      value={config.model.model}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 text-gray-900"
                    >
                      {(config.model.provider === 'openai' ? openAiModels : anthropicModels).map((model) => (
                        <option key={model.value} value={model.value} className="text-gray-900">
                          {model.label} ({model.latency}ms • ${model.cost.toFixed(2)}/min)
                        </option>
                      ))}
                    </select>
                    <Bot className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
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
                      onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
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
                    checked={config.model.emotionRecognitionEnabled}
                    onChange={(value) => handleEmotionRecognitionChange(value)}
                    className={`${
                      config.model.emotionRecognitionEnabled ? 'bg-purple-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        config.model.emotionRecognitionEnabled ? 'translate-x-6' : 'translate-x-1'
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
