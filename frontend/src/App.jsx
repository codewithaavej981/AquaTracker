import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import WaterConsumptionPlaceholder from './pages/WaterConsumptionPlaceholder';
import MyComplaintsPlaceholder from './pages/MyComplaintsPlaceholder';
import ReportComplaintPlaceholder from './pages/ReportComplaintPlaceholder';
import AdminUsersPlaceholder from './pages/AdminUsersPlaceholder';
import AdminComplaintsPlaceholder from './pages/AdminComplaintsPlaceholder';
import NotFound from './pages/NotFound';
import Loading from './components/Loading';

// Ant Design Custom Water Management Theme
const themeConfig = {
  token: {
    colorPrimary: '#0284c7', // Aqua / Ocean Blue
    colorInfo: '#0ea5e9',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    borderRadius: 8,
    colorBgLayout: '#f8fafc',
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
      itemSelectedBg: '#e0f2fe',
      itemHoverBg: '#f0f9ff',
      itemHeight: 42,
    },
  },
};

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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/consumption" element={<WaterConsumptionPlaceholder />} />
          <Route path="/my-complaints" element={<MyComplaintsPlaceholder />} />
          <Route path="/report-complaint" element={<ReportComplaintPlaceholder />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
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
                <AdminUsersPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminComplaintsPlaceholder />
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
