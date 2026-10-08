import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Input,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Avatar,
  message,
} from 'antd';
import {
  TeamOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../api/axios';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const { Title, Paragraph } = Typography;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Error fetching registered users:', err);
      message.error(err.response?.data?.message || 'Failed to load user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by search query
  const filteredUsers = users.filter((u) => {
    const q = searchText.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  const columns = [
    {
      title: 'Citizen Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: record.role === 'admin' ? '#7c3aed' : '#0284c7',
            }}
            icon={<UserOutlined />}
            size="small"
          />
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{name}</span>
        </Space>
      ),
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: '#94a3b8' }} />
          <span>{email}</span>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag
          color={role === 'admin' ? 'purple' : 'blue'}
          style={{
            fontWeight: 600,
            textTransform: 'uppercase',
            borderRadius: 10,
            padding: '2px 8px',
          }}
        >
          {role === 'admin' ? '🛡️ Admin' : '👤 Citizen'}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Citizen (user)', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Registered Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: '#94a3b8' }} />
          <span>{dayjs(date).format('YYYY-MM-DD HH:mm')}</span>
        </Space>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: 'descend',
    },
  ];

  if (loading && users.length === 0) {
    return <Loading tip="Loading user directory from MongoDB..." />;
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Banner */}
      <Card
        className="aqua-card"
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          border: 'none',
          color: '#fff',
        }}
      >
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
              👥 User Management Directory
            </Title>
            <Paragraph style={{ color: '#e0f2fe', margin: '8px 0 0 0', fontSize: 14 }}>
              Read-only administrative directory of all citizen and administrator accounts registered in AquaTracker.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Button
              icon={<ReloadOutlined spin={loading} />}
              onClick={fetchUsers}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
              }}
            >
              Refresh Directory
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Directory Table Card */}
      <Card
        className="aqua-card"
        title={
          <Space>
            <TeamOutlined style={{ color: '#0284c7' }} />
            <span style={{ fontWeight: 600, color: '#0f172a' }}>
              All Registered Accounts ({filteredUsers.length} of {users.length})
            </span>
          </Space>
        }
        extra={
          <Input
            placeholder="Search by name or email..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 240, borderRadius: 8 }}
            allowClear
          />
        }
      >
        {users.length === 0 ? (
          <EmptyState
            title="No Users Registered"
            subTitle="No registered user profiles were found in the database."
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="_id"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            scroll={{ x: 600 }}
          />
        )}
      </Card>
    </div>
  );
};

export default AdminUsers;
