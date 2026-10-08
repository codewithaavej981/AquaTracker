import React from 'react';
import { Card, Descriptions, Tag, Typography, Button, Space, Avatar, theme } from 'antd';
import { UserOutlined, MailOutlined, SafetyOutlined, CalendarOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card className="aqua-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <Avatar
            size={72}
            style={{
              backgroundColor: user?.role === 'admin' ? '#7c3aed' : '#0284c7',
              fontSize: 28,
            }}
            icon={<UserOutlined />}
          />
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
              {user?.name}
            </Title>
            <Space style={{ marginTop: 4 }}>
              <Tag
                color={user?.role === 'admin' ? 'purple' : 'blue'}
                style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}
              >
                {user?.role === 'admin' ? '🛡️ Administrator' : '👤 Citizen'}
              </Tag>
              <Text type="secondary" style={{ fontSize: 13 }}>ID: {user?.id || 'Active'}</Text>
            </Space>
          </div>
        </div>

        <Descriptions
          bordered
          column={1}
          labelStyle={{ width: '30%', fontWeight: 600 }}
        >
          <Descriptions.Item label={<span><UserOutlined style={{ marginRight: 8, color: '#0284c7' }} />Full Name</span>}>
            <span style={{ fontWeight: 500 }}>{user?.name}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<span><MailOutlined style={{ marginRight: 8, color: '#0284c7' }} />Email Address</span>}>
            <span>{user?.email}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<span><SafetyOutlined style={{ marginRight: 8, color: '#0284c7' }} />Assigned Role</span>}>
            <Tag color={user?.role === 'admin' ? 'purple' : 'blue'}>
              {user?.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={<span><CalendarOutlined style={{ marginRight: 8, color: '#0284c7' }} />Member Since</span>}>
            <span>{formattedDate}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Password Status">
            <span style={{ color: '#10b981', fontWeight: 500 }}>
              Encrypted (Hashed with bcryptjs)
            </span>
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ borderRadius: 8 }}
          >
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
