import React from 'react';
import { Layout, Button, Tag, Avatar, Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        padding: '0 24px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        height: 64,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 40,
            height: 40,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
            AquaTracker Monitoring System
          </span>
          <Tag color="cyan" style={{ borderRadius: 12, padding: '0 8px', fontSize: 11 }}>
            MSBTE Micro-Project
          </Tag>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
              padding: '4px 8px',
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
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
                  {user?.name || 'User'}
                </span>
                <span style={{ fontSize: 11, color: '#64748b', lineHeight: 1.2 }}>
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
