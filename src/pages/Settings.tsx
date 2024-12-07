import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Title, Text, Button as TremorButton, TextInput, Select, SelectItem } from '@tremor/react';
import { 
  Lock, 
  User, 
  Save,
  Shield,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme';
import { auth } from '../lib/firebase';
import { updateProfile, sendPasswordResetEmail, updateEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
];

const timezones = [
  { value: 'UTC-8', label: 'Pacific Time (PT)' },
  { value: 'UTC-5', label: 'Eastern Time (ET)' },
  { value: 'UTC+0', label: 'Greenwich Mean Time (GMT)' },
  { value: 'UTC+1', label: 'Central European Time (CET)' },
  { value: 'UTC+5:30', label: 'India Standard Time (IST)' },
];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
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
          >
            <Title className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</Title>
            <Text className="text-sm sm:text-base text-gray-600">Manage your account settings and preferences</Text>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Profile Settings */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <Card className="overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <Title className="text-xl font-semibold">Profile Information</Title>
                    <Text className="text-sm text-gray-600">Update your personal details</Text>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Text className="mb-2 text-sm font-medium">First Name</Text>
                    <TextInput
                      placeholder="Enter your first name"
                      value={settings.firstName}
                      onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Text className="mb-2 text-sm font-medium">Email</Text>
                    <TextInput
                      placeholder="Enter your email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Text className="mb-2 text-sm font-medium">Language</Text>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => setSettings({ ...settings, language: value })}
                    >
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Text className="mb-2 text-sm font-medium">Last Name</Text>
                    <TextInput
                      placeholder="Enter your last name"
                      value={settings.lastName}
                      onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Text className="mb-2 text-sm font-medium">Phone</Text>
                    <TextInput
                      placeholder="Enter your phone number"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Text className="mb-2 text-sm font-medium">Timezone</Text>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                    >
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <Card className="overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <Title className="text-xl font-semibold">Security</Title>
                    <Text className="text-sm text-gray-600">Manage your security preferences</Text>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Text className="mb-2 text-sm font-medium">Password</Text>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <TremorButton
                      icon={Lock}
                      variant="secondary"
                      onClick={handlePasswordReset}
                      loading={isResettingPassword}
                      className="w-full sm:w-auto"
                    >
                      Reset Password
                    </TremorButton>
                    <AnimatePresence>
                      {showPasswordResetConfirm && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="text-sm text-green-600 flex items-center gap-1"
                        >
                          <Check className="h-4 w-4" />
                          Reset email sent!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <Text className="mb-2 text-sm font-medium">Theme</Text>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => setSettings({ ...settings, theme: value as ThemeType })}
                  >
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          className="flex justify-end items-center gap-4 sticky bottom-4 sm:bottom-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TremorButton
            icon={Save}
            onClick={handleSaveSettings}
            loading={isSaving}
            loadingText="Saving..."
            size="lg"
            className="w-full sm:w-auto"
          >
            Save Changes
          </TremorButton>

          <AnimatePresence>
            {showSaveSuccess && (
              <motion.div
                variants={successIconVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex items-center gap-2 text-green-600"
              >
                <div className="p-1 bg-green-100 rounded-full">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Saved!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}