import React from 'react';
import { Layout, Menu, Drawer, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  FormOutlined,
  UserOutlined,
  TeamOutlined,
  AlertOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, isMobile, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { token } = theme.useToken();

  const isAdmin = user?.role === 'admin';

  // Map legacy/alias paths to primary menu keys
  const getSelectedKey = (path) => {
    if (path === '/consumption') return '/water-consumption';
    if (path === '/my-complaints') return '/complaints';
    return path;
  };

  // User navigation items
  const userMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/water-consumption',
      icon: <ExperimentOutlined />,
      label: 'Water Consumption',
    },
    {
      key: '/complaints',
      icon: <FileTextOutlined />,
      label: 'My Complaints',
    },
    {
      key: '/report-complaint',
      icon: <FormOutlined />,
      label: 'Report Complaint',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: '#ef4444' }} />,
      label: <span style={{ color: '#ef4444' }}>Logout</span>,
    },
  ];

  // Admin navigation items
  const adminMenuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'Users',
    },
    {
      key: '/admin/complaints',
      icon: <AlertOutlined />,
      label: 'Complaints',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: '#ef4444' }} />,
      label: <span style={{ color: '#ef4444' }}>Logout</span>,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (isMobile && setMobileOpen) {
      setMobileOpen(false);
    }
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else {
      navigate(key);
    }
  };

  const brandHeaderContent = (
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: `1px solid ${token.colorBorderSecondary || '#f1f5f9'}`,
        gap: 12,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 18,
          boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
          flexShrink: 0,
        }}
      >
        💧
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, color: token.colorText, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
          AquaTracker
        </div>
        <div style={{ fontSize: 11, color: '#0284c7', fontWeight: 600 }}>
          {isAdmin ? 'ADMIN PORTAL' : 'CITIZEN PORTAL'}
        </div>
      </div>
    </div>
  );

  // If mobile, render Drawer
  if (isMobile) {
    return (
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        width={280}
        closable={false}
        className="mobile-nav-drawer"
        styles={{
          body: {
            padding: 0,
            background: token.colorBgContainer,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {brandHeaderContent}
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
          style={{ borderRight: 0, marginTop: 12, background: 'transparent' }}
          items={isAdmin ? adminMenuItems : userMenuItems}
          onClick={handleMenuClick}
        />
      </Drawer>
    );
  }

  // Desktop Sider
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={null}
      style={{
        background: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBorderSecondary || '#e2e8f0'}`,
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 100,
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
      width={240}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: `1px solid ${token.colorBorderSecondary || '#f1f5f9'}`,
          gap: 12,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
            boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
            flexShrink: 0,
          }}
        >
          💧
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: token.colorText, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              AquaTracker
            </div>
            <div style={{ fontSize: 11, color: '#0284c7', fontWeight: 600 }}>
              {isAdmin ? 'ADMIN PORTAL' : 'CITIZEN PORTAL'}
            </div>
          </div>
        )}
      </div>

      {/* Menu Navigation */}
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey(location.pathname)]}
        style={{ borderRight: 0, marginTop: 12, background: 'transparent' }}
        items={isAdmin ? adminMenuItems : userMenuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
