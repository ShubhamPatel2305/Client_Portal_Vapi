import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Title, Text, Button as TremorButton, TextInput, Select, SelectItem } from '@tremor/react';
import { 
  Lock, 
  User, 
  Save,
  Shield,
  Check,
  Settings as SettingsIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme';
import { auth } from '../lib/firebase';
import { updateProfile, sendPasswordResetEmail, updateEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  avatar?: string;
}

type ThemeType = 'light' | 'dark' | 'system';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
] as const;

const timezones = [
  { value: 'UTC-8', label: 'Pacific Time (PT)' },
  { value: 'UTC-5', label: 'Eastern Time (ET)' },
  { value: 'UTC+0', label: 'Greenwich Mean Time (GMT)' },
  { value: 'UTC+1', label: 'Central European Time (CET)' },
  { value: 'UTC+5:30', label: 'India Standard Time (IST)' },
] as const;

export default function Settings() {
  const { user } = useAuthStore();
  const { theme: currentTheme, setTheme } = useThemeStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPasswordResetConfirm, setShowPasswordResetConfirm] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    language: 'en',
    timezone: 'UTC+0',
    theme: currentTheme as ThemeType,
    avatar: user?.photoURL || undefined
  });

  useEffect(() => {
    if (user) {
      const [firstName = '', lastName = ''] = user.displayName?.split(' ') || [];
      setSettings(prev => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || '',
        avatar: user.photoURL || undefined
      }));
    }
    loadUserSettings();
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserSettings;
        setSettings(prev => ({
          ...prev,
          ...userData,
          firstName: prev.firstName || userData.firstName,
          lastName: prev.lastName || userData.lastName,
          email: user.email || '',
          avatar: user.photoURL || undefined
        }));
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Update Firebase Auth Profile
      const fullName = `${settings.firstName} ${settings.lastName}`.trim();
      await updateProfile(user, {
        displayName: fullName,
      });

      // Update email if changed
      if (user.email !== settings.email) {
        await updateEmail(user, settings.email);
      }

      // Save settings to Firestore
      await setDoc(doc(db, 'users', user.uid), settings, { merge: true });

      // Update theme
      setTheme(settings.theme);

      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling
    if (!user?.email) return;
    
    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setShowPasswordResetConfirm(true);
      setTimeout(() => setShowPasswordResetConfirm(false), 5000);
      toast.success('Password reset email sent');
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast.error(error.message || 'Failed to send password reset email');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const successIconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6 sm:space-y-8"
      >
        <div className="mb-6 sm:mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <div className="inline-block">
              <motion.div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Title className="text-3xl sm:text-4xl font-bold">Settings</Title>
              </motion.div>
            </div>
            <Text className="text-gray-600">Manage your account settings and preferences</Text>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Profile Settings */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <Card className="bg-white/90 backdrop-blur-lg shadow-lg p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <Title className="text-xl font-semibold">Profile Information</Title>
                    <Text className="text-sm text-gray-600">Update your personal details</Text>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <TextInput
                      value={settings.firstName}
                      onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                      placeholder="Enter your first name"
                      className="w-full"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <TextInput
                      value={settings.lastName}
                      onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                      placeholder="Enter your last name"
                      className="w-full"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <TextInput
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      placeholder="Enter your email"
                      type="email"
                      className="w-full"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <TextInput
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      type="tel"
                      className="w-full"
                    />
                  </motion.div>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card className="bg-white/90 backdrop-blur-lg shadow-lg p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                    <SettingsIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <Title className="text-xl font-semibold">Preferences</Title>
                    <Text className="text-sm text-gray-600">Customize your experience</Text>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => setSettings({ ...settings, language: value })}
                      className="w-full"
                    >
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Timezone</label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                      className="w-full"
                    >
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Theme</label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => setSettings({ ...settings, theme: value as ThemeType })}
                      className="w-full"
                    >
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </Select>
                  </motion.div>
                </div>
              </div>
            </Card>

            {/* Security */}
            <Card className="bg-white/90 backdrop-blur-lg shadow-lg p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                  <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <Title className="text-xl font-semibold">Security</Title>
                    <Text className="text-sm text-gray-600">Manage your account security</Text>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Text className="font-medium">Password Reset</Text>
                    <Text className="text-sm text-gray-600">Send a password reset email</Text>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <TremorButton
                      size="lg"
                      color="indigo"
                      onClick={handlePasswordReset}
                      disabled={isResettingPassword}
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Reset Password
                      </div>
                    </TremorButton>
                  </motion.div>
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TremorButton
                  size="lg"
                  color="indigo"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                >
                  <div className="flex items-center gap-2">
                    {showSaveSuccess ? (
                      <motion.div
                        variants={successIconVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSaving ? 'Saving...' : (showSaveSuccess ? 'Saved!' : 'Save Changes')}
                  </div>
                </TremorButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Password Reset Confirmation */}
      <AnimatePresence>
        {showPasswordResetConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <Text className="text-white">Password reset email sent!</Text>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}