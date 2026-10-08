import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Citizen Pages
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import WaterConsumption from './pages/WaterConsumption';
import MyComplaints from './pages/MyComplaints';
import ReportComplaint from './pages/ReportComplaint';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminComplaints from './pages/AdminComplaints';

// Shared
import NotFound from './pages/NotFound';
import Loading from './components/Loading';

// Root index redirector based on authentication and role
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen tip="Loading AquaTracker..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  const { isDark } = useTheme();

  // Ant Design Custom Theme Configuration (Light / Dark Mode)
  const themeConfig = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#0284c7', // Deep Aqua / Teal accent
      colorInfo: '#0ea5e9',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      borderRadius: 8,
      ...(isDark
        ? {
            colorBgLayout: '#0b1329',
            colorBgContainer: '#162035',
            colorText: '#f8fafc',
            colorBorderSecondary: '#1e293b',
          }
        : {
            colorBgLayout: '#f8fafc',
            colorBgContainer: '#ffffff',
            colorText: '#0f172a',
            colorBorderSecondary: '#e2e8f0',
          }),
    },
    components: {
      Button: {
        controlHeight: 38,
        fontWeight: 600,
      },
      Card: {
        paddingLG: 24,
      },
      Menu: {
        itemSelectedColor: '#0284c7',
        itemSelectedBg: isDark ? 'rgba(2, 132, 199, 0.25)' : '#e0f2fe',
        itemHoverBg: isDark ? 'rgba(2, 132, 199, 0.12)' : '#f0f9ff',
        itemHeight: 42,
      },
      Table: {
        borderRadius: 8,
      },
    },
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Root Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Authenticated Citizen / Shared Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Citizen Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/water-consumption" element={<WaterConsumption />} />
          <Route path="/consumption" element={<Navigate to="/water-consumption" replace />} />
          <Route path="/complaints" element={<MyComplaints />} />
          <Route path="/my-complaints" element={<Navigate to="/complaints" replace />} />
          <Route path="/report-complaint" element={<ReportComplaint />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminComplaints />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
