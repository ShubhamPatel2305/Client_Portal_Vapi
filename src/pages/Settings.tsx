import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Title, Text, Button as TremorButton, TextInput } from '@tremor/react';
import { Lock, User, Save, Shield, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/auth';
import { auth } from '../lib/firebase';
import { updateProfile, sendPasswordResetEmail, updateEmail, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
}

export default function Settings() {
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPasswordResetConfirm, setShowPasswordResetConfirm] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: ''
  });

  // Initial load
  useEffect(() => {
    const initializeSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Set initial data from user profile immediately
        const [firstName = '', lastName = ''] = (user.displayName || '').split(' ');
        const initialSettings = {
          firstName,
          lastName,
          email: user.email || '',
          phone: '',
          companyName: ''
        };

        // Set initial data immediately to prevent loading state
        setSettings(initialSettings);
        setIsLoading(false);

        // Try to load from Firestore in background
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const firestoreSettings = {
            firstName: userData.firstName || firstName,
            lastName: userData.lastName || lastName,
            email: user.email || '',
            phone: userData.phone || '',
            companyName: userData.companyName || ''
          };
          setSettings(firestoreSettings);
        } else {
          // Create initial document if it doesn't exist
          await setDoc(userDocRef, {
            ...initialSettings,
            createdAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error initializing settings:', error);
      }
    };

    initializeSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) {
      toast.error('You must be logged in to save settings');
      return;
    }

    if (!settings.firstName.trim() || !settings.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    setIsSaving(true);
    try {
      // Update Firebase Auth Profile
      const fullName = `${settings.firstName.trim()} ${settings.lastName.trim()}`;
      await updateProfile(user, { displayName: fullName });

      // Update email if changed
      const trimmedEmail = settings.email.trim();
      if (trimmedEmail && trimmedEmail !== user.email) {
        await updateEmail(user, trimmedEmail);
        // Send verification email
        await sendEmailVerification(user);
        toast('Please verify your new email address. A verification link has been sent.', {
          icon: 'ℹ️'
        });
      }

      // Save to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const settingsData: UserSettings = {
        firstName: settings.firstName.trim(),
        lastName: settings.lastName.trim(),
        email: trimmedEmail || user.email || '',
        phone: settings.phone.trim(),
        companyName: settings.companyName.trim()
      };

      await setDoc(userDocRef, {
        ...settingsData,
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setSettings(settingsData);
      
      // Show success message and update button state
      toast.success('Settings saved successfully!');
      setShowSaveSuccess(true);

      // Reset button state after delay
      setTimeout(() => {
        setShowSaveSuccess(false);
        setIsSaving(false);
      }, 2000);

    } catch (error: any) {
      console.error('Error saving settings:', error);
      setIsSaving(false);
      
      if (error.code === 'auth/requires-recent-login') {
        toast.error('For security reasons, please log out and log back in to change your email.');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already in use by another account.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address.');
      } else {
        toast.error('Failed to save settings. Please try again.');
      }
    }
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user?.email) {
      toast.error('No email address found');
      return;
    }
    
    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setShowPasswordResetConfirm(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast.error('Failed to send password reset email. Please try again.');
    } finally {
      setIsResettingPassword(false);
      setTimeout(() => setShowPasswordResetConfirm(false), 3000);
    }
  };

  // Handle input changes with proper state updates
  const handleFieldChange = (field: keyof UserSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6 sm:space-y-8"
      >
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Title className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 ml-[19px]">
            Settings
          </Title>
          <Text className="text-gray-600 mt-2 ml-[19px]">Manage your account preferences and settings</Text>
        </motion.div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-white to-indigo-50/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <Title className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Profile Information</Title>
                    <Text className="text-gray-600">Update your personal details</Text>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                      <label className="text-sm font-medium text-indigo-600">First Name</label>
                      <TextInput
                        type="text"
                        placeholder="First Name"
                        value={settings.firstName}
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                        className="focus:ring-2 focus:ring-indigo-500 bg-white/50 border-indigo-100"
                      />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                      <label className="text-sm font-medium text-indigo-600">Last Name</label>
                      <TextInput
                        type="text"
                        placeholder="Last Name"
                        value={settings.lastName}
                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                        className="focus:ring-2 focus:ring-indigo-500 bg-white/50 border-indigo-100"
                      />
                    </motion.div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-indigo-600">Email</label>
                    <TextInput
                      type="email"
                      placeholder="Email"
                      value={settings.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="focus:ring-2 focus:ring-indigo-500 bg-white/50 border-indigo-100"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-indigo-600">Phone</label>
                    <TextInput
                      type="tel"
                      placeholder="Phone"
                      value={settings.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="focus:ring-2 focus:ring-indigo-500 bg-white/50 border-indigo-100"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-indigo-600">Company Name</label>
                    <TextInput
                      type="text"
                      placeholder="Enter your company name"
                      value={settings.companyName}
                      onChange={(e) => handleFieldChange('companyName', e.target.value)}
                      className="focus:ring-2 focus:ring-indigo-500 bg-white/50 border-indigo-100"
                    />
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                    <Shield className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <Title className="text-xl font-semibold">Security Settings</Title>
                    <Text className="text-gray-600">Manage your account security</Text>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900">Email Address</h3>
                      <p className="text-gray-600 text-sm mt-1">Your current email: <span className="font-semibold">{user?.email}</span></p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <TremorButton
                        onClick={handlePasswordReset}
                        disabled={isResettingPassword}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-200"
                      >
                        <div className="flex items-center justify-center gap-2">
                          {isResettingPassword ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Sending Reset Link...</span>
                            </>
                          ) : showPasswordResetConfirm ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Email Sent!</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              <span>Reset Password</span>
                            </>
                          )}
                        </div>
                      </TremorButton>
                    </motion.div>
                    <div className="mt-4 p-3 bg-white/80 rounded border border-teal-100">
                      <h4 className="text-sm font-medium text-teal-700 mb-2">How to Reset Your Password:</h4>
                      <ol className="text-sm text-gray-600 space-y-1 list-decimal pl-4">
                        <li>Click the "Reset Password" button above</li>
                        <li>Check your email inbox for the reset link</li>
                        <li>Click the link in the email</li>
                        <li>Enter your new password</li>
                        <li>Log back in with your new password</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Save Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TremorButton
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`
                  ${showSaveSuccess ? 'bg-green-600' : 'bg-indigo-600'}
                  text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2
                `}
              >
                <div className="flex items-center gap-2">
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : showSaveSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </div>
              </TremorButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}