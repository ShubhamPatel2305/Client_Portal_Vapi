import React from 'react';
import { Card } from '@tremor/react';
import { motion } from 'framer-motion';
import { Mic, Settings, Sliders, Volume2, Info, Globe } from 'lucide-react';

interface TranscriberConfigProps {
  config: {
    transcriber: {
      provider: string;
      language: string;
      model: string;
      enhancedFiltering: boolean;
    };
  };
  onConfigChange: (key: string, value: any, options?: { skipMetricsUpdate: boolean }) => void;
}

const providers = [
  { value: 'whisper', label: 'OpenAI Whisper', description: 'High accuracy, multi-language support' },
  { value: 'google', label: 'Google Speech', description: 'Fast, reliable transcription' },
  { value: 'aws', label: 'AWS Transcribe', description: 'Enterprise-grade solution' }
];

const languages = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'it', label: 'Italian', flag: '🇮🇹' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'nl', label: 'Dutch', flag: '🇳🇱' },
  { value: 'ja', label: 'Japanese', flag: '🇯🇵' }
];

const models = [
  { value: 'base', label: 'Base', description: 'Standard transcription model' },
  { value: 'enhanced', label: 'Enhanced', description: 'Improved accuracy and noise reduction' },
  { value: 'premium', label: 'Premium', description: 'Highest accuracy with custom adaptations' }
];

const TranscriberConfig: React.FC<TranscriberConfigProps> = ({ config, onConfigChange }) => {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Card className="bg-white p-6 shadow-lg rounded-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Mic className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Transcriber Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="relative group">
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="h-4 w-4 text-indigo-500" />
                <label className="text-sm font-medium text-gray-700">Provider</label>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </div>
              <div className="relative">
                <select
                  value={config.transcriber.provider}
                  onChange={(e) => onConfigChange('transcriber.provider', e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
                >
                  {providers.map((provider) => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Settings className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {providers.find(p => p.value === config.transcriber.provider)?.description}
              </div>
            </div>

            <div className="relative group">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                <label className="text-sm font-medium text-gray-700">Language</label>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </div>
              <div className="relative">
                <select
                  value={config.transcriber.language}
                  onChange={(e) => onConfigChange('transcriber.language', e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Globe className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="relative group">
              <div className="flex items-center space-x-2 mb-2">
                <Sliders className="h-4 w-4 text-indigo-500" />
                <label className="text-sm font-medium text-gray-700">Model</label>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </div>
              <div className="relative">
                <select
                  value={config.transcriber.model}
                  onChange={(e) => onConfigChange('transcriber.model', e.target.value)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
                >
                  {models.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Sliders className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {models.find(m => m.value === config.transcriber.model)?.description}
              </div>
            </div>

            <motion.div
              variants={itemVariants}
              className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Settings className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Enhanced Filtering</h4>
                    <p className="text-xs text-gray-500">Improve transcription accuracy</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.transcriber.enhancedFiltering}
                    onChange={(e) => onConfigChange('transcriber.enhancedFiltering', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TranscriberConfig;
