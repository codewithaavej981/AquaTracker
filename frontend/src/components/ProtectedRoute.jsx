import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { Result, Button, theme } from 'antd';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const { token } = theme.useToken();

  if (loading) {
    return <Loading fullScreen tip="Verifying authorization..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (requiredRole && user?.role !== requiredRole) {
    // If a normal user tries to access admin routes
    if (requiredRole === 'admin') {
      return (
        <div style={{ padding: '40px 16px', maxWidth: '100%', background: token.colorBgLayout, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Result
            status="403"
            title="403 - Access Denied"
            subTitle="You do not have administrative privileges to access this page."
            extra={
              <Button type="primary" style={{ background: '#0284c7' }} href="/dashboard">
                Return to Citizen Dashboard
              </Button>
            }
          />
        </div>
      );
    }

    // If an admin accesses user-only route, redirect to admin dashboard
    if (requiredRole === 'user' && user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
