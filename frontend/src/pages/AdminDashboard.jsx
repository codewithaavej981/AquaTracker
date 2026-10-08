import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Typography,
  Tag,
  Space,
  Spin,
  Alert,
  Progress,
  message,
} from 'antd';
import {
  TeamOutlined,
  AlertOutlined,
  ExperimentOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const { Title, Paragraph, Text } = Typography;

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConsumptionRecords: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin statistics:', err);
      message.error(err.response?.data?.message || 'Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Compute complaint resolution progress percentage
  const resolutionRate =
    stats.totalComplaints > 0
      ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
      : 100;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Admin Welcome Banner */}
      <Card
        className="aqua-card"
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: 12,
          border: 'none',
        }}
      >
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Tag
              color="purple"
              style={{
                borderRadius: 12,
                fontWeight: 600,
                marginBottom: 8,
                padding: '2px 10px',
              }}
            >
              ADMINISTRATIVE COMMAND CENTER
            </Tag>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
              Welcome, Administrator {user?.name || 'Admin'} 🛡️
            </Title>
            <Paragraph style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: 14 }}>
              System-wide water consumption oversight and municipal grievance redressal operations.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                icon={<ReloadOutlined spin={loading} />}
                onClick={fetchStats}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                Refresh Metrics
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Real MongoDB Metric Cards */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* Total Registered Users */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="aqua-card">
              <Statistic
                title={<span style={{ color: '#64748b', fontWeight: 500 }}>Total Registered Users</span>}
                value={stats.totalUsers}
                prefix={<TeamOutlined style={{ color: '#0284c7' }} />}
                valueStyle={{ color: '#0f172a', fontWeight: 700 }}
              />
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Verified accounts</span>
                <Button type="link" size="small" onClick={() => navigate('/admin/users')}>
                  View Directory &rarr;
                </Button>
              </div>
            </Card>
          </Col>

          {/* Total Water Consumption Records */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="aqua-card">
              <Statistic
                title={<span style={{ color: '#64748b', fontWeight: 500 }}>Consumption Records</span>}
                value={stats.totalConsumptionRecords}
                prefix={<ExperimentOutlined style={{ color: '#0ea5e9' }} />}
                valueStyle={{ color: '#0f172a', fontWeight: 700 }}
              />
              <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
                Total daily intake submissions
              </div>
            </Card>
          </Col>

          {/* Total Complaints */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="aqua-card">
              <Statistic
                title={<span style={{ color: '#64748b', fontWeight: 500 }}>Total Complaints</span>}
                value={stats.totalComplaints}
                prefix={<AlertOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ color: '#0f172a', fontWeight: 700 }}
              />
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>All reported issues</span>
                <Button type="link" size="small" onClick={() => navigate('/admin/complaints')}>
                  Manage &rarr;
                </Button>
              </div>
            </Card>
          </Col>

          {/* Pending Complaints */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="aqua-card">
              <Statistic
                title={<span style={{ color: '#64748b', fontWeight: 500 }}>Pending Complaints</span>}
                value={stats.pendingComplaints}
                prefix={<ClockCircleOutlined style={{ color: '#ef4444' }} />}
                valueStyle={{ color: '#ef4444', fontWeight: 700 }}
              />
              <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
                Requiring review & triage
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>

      {/* Complaints Status Breakdown Card */}
      <Card
        className="aqua-card"
        title={
          <span style={{ fontWeight: 600, color: '#0f172a' }}>
            📊 Grievance Status Summary (Real Database Distribution)
          </span>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={8}>
            <Card style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
              <Statistic
                title={<span style={{ color: '#b45309', fontWeight: 600 }}>Pending Review</span>}
                value={stats.pendingComplaints}
                prefix={<ClockCircleOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ color: '#b45309', fontWeight: 700 }}
              />
              <Text style={{ fontSize: 12, color: '#78350f' }}>
                Awaiting technician dispatch
              </Text>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8 }}>
              <Statistic
                title={<span style={{ color: '#1d4ed8', fontWeight: 600 }}>In Progress</span>}
                value={stats.inProgressComplaints}
                prefix={<SyncOutlined spin={stats.inProgressComplaints > 0} style={{ color: '#0284c7' }} />}
                valueStyle={{ color: '#1d4ed8', fontWeight: 700 }}
              />
              <Text style={{ fontSize: 12, color: '#1e3a8a' }}>
                Maintenance currently active
              </Text>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8 }}>
              <Statistic
                title={<span style={{ color: '#047857', fontWeight: 600 }}>Resolved</span>}
                value={stats.resolvedComplaints}
                prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ color: '#047857', fontWeight: 700 }}
              />
              <Text style={{ fontSize: 12, color: '#064e3b' }}>
                Work orders successfully completed
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Admin Modules Navigation */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            className="aqua-card"
            title={<span style={{ fontWeight: 600, color: '#0f172a' }}>👥 Registered Users Directory</span>}
            extra={
              <Button type="link" onClick={() => navigate('/admin/users')}>
                Open Directory <ArrowRightOutlined />
              </Button>
            }
          >
            <Paragraph style={{ color: '#64748b' }}>
              View all citizen profiles, email accounts, assigned roles, and registration dates stored in MongoDB Atlas.
            </Paragraph>
            <Button
              type="primary"
              style={{ background: '#0284c7' }}
              onClick={() => navigate('/admin/users')}
            >
              Open Users Management
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            className="aqua-card"
            title={<span style={{ fontWeight: 600, color: '#0f172a' }}>📋 Community Complaints Redressal</span>}
            extra={
              <Button type="link" onClick={() => navigate('/admin/complaints')}>
                Review Complaints <ArrowRightOutlined />
              </Button>
            }
          >
            <Paragraph style={{ color: '#64748b' }}>
              Inspect water pipeline damage, leakages, and contamination reports across all wards. Update resolution statuses from Pending to Resolved.
            </Paragraph>
            <Button
              type="default"
              style={{ borderColor: '#0284c7', color: '#0284c7' }}
              onClick={() => navigate('/admin/complaints')}
            >
              Manage Complaints
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
