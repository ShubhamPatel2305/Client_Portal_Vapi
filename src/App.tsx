import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './stores/auth';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import VapiAnalytics from './pages/Vapi';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Billing from './pages/Billing'; // Added import statement for Billing
import AuthGuard from './components/AuthGuard';
import AppLayout from './components/AppLayout';
import Sidebar from './components/Sidebar';
import { ThemeProvider } from './components/ThemeProvider';
import './i18n'; // Import i18n configuration

// Configure React Router future flags
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

// Layout wrapper for authenticated routes
const AuthLayout = () => (
  <AuthGuard>
    <Outlet />
  </AuthGuard>
);

// Main layout wrapper for authenticated pages
const MainLayout = () => (
  <AppLayout>
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  </AppLayout>
);

export default function App() {
  const { checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter {...routerConfig}>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<AuthLayout />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vapi" element={<VapiAnalytics />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/team" element={<Team />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<Support />} />
              <Route path="/billing" element={<Billing />} />
            </Route>
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          
          {/* Catch all other routes and redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
