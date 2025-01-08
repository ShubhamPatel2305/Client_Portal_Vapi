import { Card, Switch, Select, SelectItem, TextInput } from '@tremor/react';
import { motion } from 'framer-motion';
import { PhoneCall, KeyRound, Phone, Settings, Info } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Assistant } from '../../pages/Vapi';

interface FunctionConfigProps {
  config: Assistant;
  onConfigChange: (key: string, value: any) => void;
}

const countryCodes = [
  { value: '+1', label: '🇺🇸 United States (+1)', country: 'US' },
  { value: '+44', label: '🇬🇧 United Kingdom (+44)', country: 'GB' },
  { value: '+91', label: '🇮🇳 India (+91)', country: 'IN' },
  { value: '+61', label: '🇦🇺 Australia (+61)', country: 'AU' },
  { value: '+86', label: '🇨🇳 China (+86)', country: 'CN' },
  { value: '+81', label: '🇯🇵 Japan (+81)', country: 'JP' },
  { value: '+49', label: '🇩🇪 Germany (+49)', country: 'DE' },
  { value: '+33', label: '🇫🇷 France (+33)', country: 'FR' },
  { value: '+39', label: '🇮🇹 Italy (+39)', country: 'IT' },
  { value: '+34', label: '🇪🇸 Spain (+34)', country: 'ES' },
  { value: '+7', label: '🇷🇺 Russia (+7)', country: 'RU' },
  { value: '+55', label: '🇧🇷 Brazil (+55)', country: 'BR' },
  { value: '+52', label: '🇲🇽 Mexico (+52)', country: 'MX' },
  { value: '+82', label: '🇰🇷 South Korea (+82)', country: 'KR' },
  { value: '+65', label: '🇸🇬 Singapore (+65)', country: 'SG' },
];

const FunctionConfig = React.memo<FunctionConfigProps>(({ config, onConfigChange }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
  const [phoneNumberWithoutCode, setPhoneNumberWithoutCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && config.forwardingPhoneNumber) {
      const exactMatch = countryCodes.find(c => config.forwardingPhoneNumber?.startsWith(c.value));
      if (exactMatch) {
        setSelectedCountryCode(exactMatch.value);
        setPhoneNumberWithoutCode(config.forwardingPhoneNumber.slice(exactMatch.value.length));
      } else {
        const countryCodeMatch = config.forwardingPhoneNumber.match(/^\+(\d{1,3})/);
        if (countryCodeMatch) {
          const code = countryCodeMatch[0];
          const matchingCode = countryCodes.find(c => c.value === code);
          if (matchingCode) {
            setSelectedCountryCode(matchingCode.value);
            setPhoneNumberWithoutCode(config.forwardingPhoneNumber.slice(code.length));
          }
        }
      }
      setIsInitialized(true);
    }
  }, [config.forwardingPhoneNumber, isInitialized]);

  const validatePhoneNumber = (phone: string) => {
    if (!phone) return true;
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneNumberChange = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    setPhoneNumberWithoutCode(cleanedValue);
    
    if (!cleanedValue) {
      setPhoneError('');
      onConfigChange('forwardingPhoneNumber', '');
      return;
    }

    const fullNumber = `${selectedCountryCode}${cleanedValue}`;
    if (validatePhoneNumber(fullNumber)) {
      setPhoneError('');
      onConfigChange('forwardingPhoneNumber', fullNumber);
    } else {
      setPhoneError('Please enter a valid phone number');
    }
  };

  const handleCountryCodeChange = (value: string) => {
    setSelectedCountryCode(value);
    if (!phoneNumberWithoutCode) {
      setPhoneError('');
      onConfigChange('forwardingPhoneNumber', '');
      return;
    }

    const fullNumber = `${value}${phoneNumberWithoutCode}`;
    if (validatePhoneNumber(fullNumber)) {
      setPhoneError('');
      onConfigChange('forwardingPhoneNumber', fullNumber);
    } else {
      setPhoneError('Please enter a valid phone number');
    }
  };

  if (!config) return null;

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
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-50 border border-gray-200 rounded-xl transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
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
                  checked={config.endCallFunctionEnabled}
                  onChange={(value) => onConfigChange('endCallFunctionEnabled', value)}
                  className={`${
                    config.endCallFunctionEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      config.endCallFunctionEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>

            {/* Dial Keypad */}
            <div className="relative group">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-50 border border-gray-200 rounded-xl transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-lg">
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
                  checked={config.dialKeypadFunctionEnabled}
                  onChange={(value) => onConfigChange('dialKeypadFunctionEnabled', value)}
                  className={`${
                    config.dialKeypadFunctionEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      config.dialKeypadFunctionEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>

            {/* Forwarding Phone Number */}
            <div className="relative group">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-xl transition-all duration-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Forwarding Phone Number</p>
                    <p className="text-sm text-gray-600">Enter the phone number for call forwarding</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select
                    value={selectedCountryCode}
                    onValueChange={handleCountryCodeChange}
                    className="w-64"
                  >
                    {countryCodes.map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <TextInput
                    type="tel"
                    value={phoneNumberWithoutCode || ''}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                    placeholder="Enter phone number"
                    className="flex-1"
                    error={!!phoneError}
                    errorMessage={phoneError}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
});

export default FunctionConfig;