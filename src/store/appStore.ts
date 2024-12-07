import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { securityUtils } from '../lib/security';

interface AppState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notifications: Notification[];
  settings: AppSettings;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

interface AppSettings {
  emailNotifications: boolean;
  soundEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  timezone: string;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      notifications: [],
      settings: {
        emailNotifications: true,
        soundEnabled: true,
        autoRefresh: true,
        refreshInterval: 30000,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },

      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          { ...notification, id: crypto.randomUUID() },
          ...state.notifications,
        ].slice(0, 5),
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        settings: state.settings,
      }),
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? securityUtils.decryptData(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, securityUtils.encryptData(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);