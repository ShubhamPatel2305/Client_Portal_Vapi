export const APP_CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  BILLING: '/billing',
  SETTINGS: '/settings',
  SUPPORT: '/support'
};