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

const Header = ({ collapsed, isMobile, mobileOpen, onToggleMenu }) => {
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

  const menuToggleIcon = isMobile ? (
    mobileOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />
  ) : (
    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
  );

  return (
    <AntHeader
      style={{
        padding: isMobile ? '0 12px' : '0 20px',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, minWidth: 0 }}>
        <Button
          type="text"
          icon={menuToggleIcon}
          onClick={onToggleMenu}
          style={{
            fontSize: '16px',
            width: 38,
            height: 38,
            flexShrink: 0,
          }}
          aria-label="Toggle navigation menu"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap', minWidth: 0 }}>
          <span
            style={{
              fontSize: isMobile ? 14 : 15,
              fontWeight: 700,
              color: token.colorText,
              whiteSpace: 'nowrap',
            }}
          >
            AquaTracker
          </span>
          <Tag
            color="cyan"
            className="header-msbte-tag"
            style={{ borderRadius: 12, padding: '0 6px', fontSize: 10, margin: 0 }}
          >
            MSBTE
          </Tag>
        </div>
      </div>

      {/* Right section: theme toggle, role tag, and user profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, flexShrink: 0 }}>
        {/* Theme Mode Toggle */}
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <Button
            type="text"
            icon={
              isDark ? (
                <SunOutlined style={{ color: '#f59e0b', fontSize: 17 }} />
              ) : (
                <MoonOutlined style={{ color: '#0284c7', fontSize: 17 }} />
              )
            }
            onClick={toggleTheme}
            style={{ width: 36, height: 36, borderRadius: 8, padding: 0 }}
            aria-label="Toggle light/dark theme"
          />
        </Tooltip>

        <Tag
          color={user?.role === 'admin' ? 'purple' : 'blue'}
          className="header-role-tag"
          style={{
            textTransform: 'uppercase',
            fontWeight: 600,
            padding: '2px 8px',
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
              height: 40,
              display: 'flex',
              alignItems: 'center',
              padding: '4px 6px',
              borderRadius: 8,
            }}
          >
            <Space size={6}>
              <Avatar
                style={{
                  backgroundColor: user?.role === 'admin' ? '#7c3aed' : '#0284c7',
                  verticalAlign: 'middle',
                }}
                icon={<UserOutlined />}
                size="small"
              />
              <div
                className="header-user-text"
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: 120,
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    fontSize: 12,
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
                    fontSize: 10,
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
              <DownOutlined style={{ fontSize: 9, color: '#94a3b8' }} />
            </Space>
          </Button>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
