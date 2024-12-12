import { Card, Title, Switch } from '@tremor/react';
import { motion } from 'framer-motion';
import { PhoneCall, KeyRound, Phone, Settings, Info } from 'lucide-react';
import React from 'react';

interface FunctionConfigProps {
  config: any;
  onConfigChange: (key: string, value: any) => void;
}

const countryOptions = [
  { value: 'us', label: '🇺🇸 United States', code: '+1' },
  { value: 'uk', label: '🇬🇧 United Kingdom', code: '+44' },
  { value: 'au', label: '🇦🇺 Australia', code: '+61' },
  { value: 'in', label: '🇮🇳 India', code: '+91' }
];

export const FunctionConfig: React.FC<FunctionConfigProps> = ({ config, onConfigChange }) => {
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
            <Settings className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Function Settings</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <motion.div variants={itemVariants} className="space-y-6">
            {/* End Call Function */}
            <div className="relative group">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-xl transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <PhoneCall className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">Enable End Call Function</p>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                    <p className="text-sm text-gray-500">Allow assistant to end calls (Best for gpt-4)</p>
                  </div>
                </div>
                <Switch
                  checked={config.endCallEnabled || false}
                  onChange={(value) => onConfigChange('endCallEnabled', value)}
                  className={`${
                    config.endCallEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      config.endCallEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>

            {/* Dial Keypad */}
            <div className="relative group">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-xl transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <KeyRound className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">Dial Keypad</p>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                    <p className="text-sm text-gray-500">Enable assistant to use keypad</p>
                  </div>
                </div>
                <Switch
                  checked={config.keypadEnabled || false}
                  onChange={(value) => onConfigChange('keypadEnabled', value)}
                  className={`${
                    config.keypadEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      config.keypadEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>

            {/* Forwarding Phone Number */}
            <div className="relative group">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-xl transition-all duration-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Phone className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">Forwarding Phone Number</p>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                    <p className="text-sm text-gray-500">Set up call forwarding destination</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="relative w-32">
                    <select 
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      {countryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Settings className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={config.forwardingNumber || ''}
                    onChange={(e) => onConfigChange('forwardingNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FunctionConfig;
