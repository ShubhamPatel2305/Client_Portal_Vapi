import React from 'react';
import { Card } from '@tremor/react';
import { motion } from 'framer-motion';
import { Mic, Settings, Sliders, Volume2, Info, Globe } from 'lucide-react';

interface TranscriberConfigProps {
  config: {
    transcriber: {
      language: string;
      provider: string;
      model?: string;
    };
  };
  onConfigChange: (path: string, value: any) => void;
}

const providers = [
  { value: 'deepgram', label: 'Deepgram', description: 'High-accuracy transcription' },
  { value: 'talkscriber', label: 'Talkscriber', description: 'Real-time transcription' },
  { value: 'gladia', label: 'Gladia', description: 'Advanced speech recognition' },
  { value: 'assembly-ai', label: 'Assembly AI', description: 'AI-powered transcription' },
  { value: 'azure', label: 'Azure', description: 'Microsoft Azure transcription' }
];

const languages = [
  { value: 'bg', label: 'Bulgarian', flag: '🇧🇬' },
  { value: 'ca', label: 'Catalan', flag: '🇪🇸' },
  { value: 'cs', label: 'Czech', flag: '🇨🇿' },
  { value: 'da', label: 'Danish', flag: '🇩🇰' },
  { value: 'da-DK', label: 'Danish (Denmark)', flag: '🇩🇰' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'de-CH', label: 'German (Switzerland)', flag: '🇨🇭' },
  { value: 'el', label: 'Greek', flag: '🇬🇷' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'en-AU', label: 'English (Australia)', flag: '🇦🇺' },
  { value: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
  { value: 'en-IN', label: 'English (India)', flag: '🇮🇳' },
  { value: 'en-NZ', label: 'English (New Zealand)', flag: '🇳🇿' },
  { value: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'es-419', label: 'Spanish (Latin America)', flag: '🌎' },
  { value: 'es-LATAM', label: 'Spanish (LATAM)', flag: '🌎' },
  { value: 'et', label: 'Estonian', flag: '🇪🇪' },
  { value: 'fi', label: 'Finnish', flag: '🇫🇮' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'fr-CA', label: 'French (Canada)', flag: '🇨🇦' },
  { value: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { value: 'hi-Latn', label: 'Hindi (Latin)', flag: '🇮🇳' },
  { value: 'hu', label: 'Hungarian', flag: '🇭🇺' },
  { value: 'id', label: 'Indonesian', flag: '🇮🇩' },
  { value: 'it', label: 'Italian', flag: '🇮🇹' },
  { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { value: 'ko', label: 'Korean', flag: '🇰🇷' },
  { value: 'ko-KR', label: 'Korean (South Korea)', flag: '🇰🇷' },
  { value: 'lt', label: 'Lithuanian', flag: '🇱🇹' },
  { value: 'lv', label: 'Latvian', flag: '🇱🇻' },
  { value: 'ms', label: 'Malay', flag: '🇲🇾' },
  { value: 'nl-BE', label: 'Dutch (Belgium)', flag: '🇧🇪' },
  { value: 'no', label: 'Norwegian', flag: '🇳🇴' },
  { value: 'pl', label: 'Polish', flag: '🇵🇱' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { value: 'ro', label: 'Romanian', flag: '🇷🇴' },
  { value: 'ru', label: 'Russian', flag: '🇷🇺' },
  { value: 'sk', label: 'Slovak', flag: '🇸🇰' },
  { value: 'sv', label: 'Swedish', flag: '🇸🇪' },
  { value: 'sv-SE', label: 'Swedish (Sweden)', flag: '🇸🇪' },
  { value: 'ta', label: 'Tamil', flag: '🇮🇳' },
  { value: 'taq', label: 'Tamasheq', flag: '🌍' },
  { value: 'th', label: 'Thai', flag: '🇹🇭' },
  { value: 'th-TH', label: 'Thai (Thailand)', flag: '🇹🇭' },
  { value: 'tr', label: 'Turkish', flag: '🇹🇷' },
  { value: 'uk', label: 'Ukrainian', flag: '🇺🇦' },
  { value: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
  { value: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { value: 'zh-CN', label: 'Chinese (Mainland)', flag: '🇨🇳' },
  { value: 'zh-HK', label: 'Chinese (Hong Kong)', flag: '🇭🇰' },
  { value: 'zh-Hans', label: 'Chinese (Simplified)', flag: '🇨🇳' },
  { value: 'zh-Hant', label: 'Chinese (Traditional)', flag: '🇹🇼' },
  { value: 'zh-TW', label: 'Chinese (Taiwan)', flag: '🇹🇼' }
];

const models = [
  { value: 'nova-2', label: 'Nova 2', description: 'Standard transcription model' },
  { value: 'nova-2-general', label: 'Nova 2 General', description: 'General purpose transcription' }
  
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
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900"
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
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900"
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
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none text-gray-900"
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

            
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TranscriberConfig;
