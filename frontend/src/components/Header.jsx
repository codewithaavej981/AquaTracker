import React from 'react';
import { Layout, Button, Tag, Avatar, Dropdown, Space, Tooltip, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: '#ef4444' }} />,
      label: <span style={{ color: '#ef4444' }}>Logout</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 20px',
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary || '#e2e8f0'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        height: 64,
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Left section: menu toggle and branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 38,
            height: 38,
          }}
          aria-label="Toggle navigation menu"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: token.colorText, whiteSpace: 'nowrap' }}>
            AquaTracker
          </span>
          <Tag color="cyan" style={{ borderRadius: 12, padding: '0 8px', fontSize: 11, margin: 0 }}>
            MSBTE
          </Tag>
        </div>
      </div>

      {/* Right section: theme toggle, role tag, and user profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Theme Mode Toggle */}
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <Button
            type="text"
            icon={
              isDark ? (
                <SunOutlined style={{ color: '#f59e0b', fontSize: 18 }} />
              ) : (
                <MoonOutlined style={{ color: '#0284c7', fontSize: 18 }} />
              )
            }
            onClick={toggleTheme}
            style={{ width: 38, height: 38, borderRadius: 8 }}
            aria-label="Toggle light/dark theme"
          />
        </Tooltip>

        <Tag
          color={user?.role === 'admin' ? 'purple' : 'blue'}
          style={{
            textTransform: 'uppercase',
            fontWeight: 600,
            padding: '2px 10px',
            borderRadius: 12,
            margin: 0,
          }}
        >
          {user?.role === 'admin' ? '🛡️ Admin' : '👤 Citizen'}
        </Tag>

        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <Button
            type="text"
            style={{
              height: 44,
              display: 'flex',
              alignItems: 'center',
              padding: '4px 6px',
              borderRadius: 8,
            }}
          >
            <Space size={8}>
              <Avatar
                style={{
                  backgroundColor: user?.role === 'admin' ? '#7c3aed' : '#0284c7',
                  verticalAlign: 'middle',
                }}
                icon={<UserOutlined />}
              />
              <div
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: 130,
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: token.colorText,
                    lineHeight: 1.2,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {user?.name || 'User'}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: token.colorTextSecondary,
                    lineHeight: 1.2,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {user?.email}
                </span>
              </div>
              <DownOutlined style={{ fontSize: 10, color: '#94a3b8' }} />
            </Space>
          </Button>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
