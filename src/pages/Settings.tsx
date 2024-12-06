import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Title, Text, Button as TremorButton } from '@tremor/react';
import { 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Phone, 
  Save,
  Moon,
  Sun,
  Palette,
  Volume2,
  Shield,
  Mail,
  Clock,
  Languages,
  AlertTriangle,
  Laptop
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme';

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    activityStatus: boolean;
    dataSharing: boolean;
  };
}

export default function Settings() {
  const { user } = useAuthStore();
  const { theme: currentTheme, setTheme } = useThemeStore();
  const [settings, setSettings] = useState<UserSettings>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    theme: currentTheme,
    notifications: {
      email: true,
      push: true,
      sound: true,
    },
    privacy: {
      profileVisibility: 'public',
      activityStatus: true,
      dataSharing: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
      }));
    }
  }, [user]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = (type: keyof UserSettings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const togglePrivacy = (type: keyof UserSettings['privacy']) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: !prev.privacy[type],
      },
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title>Settings</Title>
          <Text>Manage your account settings and preferences</Text>
        </div>
        <TremorButton
          size="lg"
          variant="primary"
          icon={Save}
          loading={isLoading}
          onClick={handleSave}
        >
          Save Changes
        </TremorButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-indigo-600" />
            <Title>Profile</Title>
          </div>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={settings.firstName}
                onChange={e => setSettings(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={settings.lastName}
                onChange={e => setSettings(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={e => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-indigo-600" />
            <Title>Notifications</Title>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <Text className="font-medium">Email Notifications</Text>
                  <Text className="text-gray-500">Get emails about your activity</Text>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('email')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  settings.notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    settings.notifications.email ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-500" />
                <div>
                  <Text className="font-medium">Push Notifications</Text>
                  <Text className="text-gray-500">Get notified in the app</Text>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('push')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  settings.notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    settings.notifications.push ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-gray-500" />
                <div>
                  <Text className="font-medium">Sound Notifications</Text>
                  <Text className="text-gray-500">Play sounds for notifications</Text>
                </div>
              </div>
              <button
                onClick={() => toggleNotification('sound')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  settings.notifications.sound ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    settings.notifications.sound ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-indigo-600" />
            <Title>Preferences</Title>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={settings.language}
                onChange={e => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={e => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="mt-6">
          <Title>Theme Settings</Title>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <Text>Theme</Text>
              </div>
              <div className="flex space-x-2">
                <TremorButton
                  size="xs"
                  variant={settings.theme === 'light' ? 'primary' : 'secondary'}
                  onClick={() => handleThemeChange('light')}
                  icon={Sun}
                >
                  Light
                </TremorButton>
                <TremorButton
                  size="xs"
                  variant={settings.theme === 'dark' ? 'primary' : 'secondary'}
                  onClick={() => handleThemeChange('dark')}
                  icon={Moon}
                >
                  Dark
                </TremorButton>
                <TremorButton
                  size="xs"
                  variant={settings.theme === 'system' ? 'primary' : 'secondary'}
                  onClick={() => handleThemeChange('system')}
                  icon={Laptop}
                >
                  System
                </TremorButton>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-indigo-600" />
            <Title>Privacy & Security</Title>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <Text className="font-medium">Profile Visibility</Text>
                  <Text className="text-gray-500">Make your profile visible to others</Text>
                </div>
              </div>
              <select
                value={settings.privacy.profileVisibility}
                onChange={e => setSettings(prev => ({
                  ...prev,
                  privacy: {
                    ...prev.privacy,
                    profileVisibility: e.target.value as 'public' | 'private'
                  }
                }))}
                className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <Text className="font-medium">Activity Status</Text>
                  <Text className="text-gray-500">Show when you're active</Text>
                </div>
              </div>
              <button
                onClick={() => togglePrivacy('activityStatus')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  settings.privacy.activityStatus ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    settings.privacy.activityStatus ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-gray-500" />
                <div>
                  <Text className="font-medium">Data Sharing</Text>
                  <Text className="text-gray-500">Share usage data to improve our services</Text>
                </div>
              </div>
              <button
                onClick={() => togglePrivacy('dataSharing')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  settings.privacy.dataSharing ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    settings.privacy.dataSharing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-4">
              <TremorButton
                size="lg"
                variant="secondary"
                icon={Lock}
                onClick={() => toast.success('Password change functionality coming soon!')}
                className="w-full"
              >
                Change Password
              </TremorButton>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}