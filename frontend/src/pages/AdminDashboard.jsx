import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, Typography, Tag, Space, Alert } from 'antd';
import {
  TeamOutlined,
  AlertOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const { Title, Paragraph } = Typography;

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adminVerified, setAdminVerified] = useState(false);
  const [checkingApi, setCheckingApi] = useState(false);

  const verifyAdminPrivileges = async () => {
    setCheckingApi(true);
    try {
      const res = await api.get('/auth/admin-check');
      if (res.status === 200) {
        setAdminVerified(true);
      }
    } catch (err) {
      setAdminVerified(false);
    } finally {
      setCheckingApi(false);
    }
  };

  useEffect(() => {
    verifyAdminPrivileges();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Welcome Banner */}
      <Card
        className="aqua-card"
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
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
              ADMINISTRATIVE CONTROL PANEL
            </Tag>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
              System Administrator: {user?.name || 'Admin'} 🛡️
            </Title>
            <Paragraph style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: 14 }}>
              Municipal water management command center. Supervise citizen accounts, review grievance logs, and coordinate resolutions.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined spin={checkingApi} />}
                onClick={verifyAdminPrivileges}
                style={{
                  background: '#0284c7',
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                Re-Verify Token
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Admin Token Verification Banner */}
      {adminVerified ? (
        <Alert
          message="Admin Route Guard & Backend Authorization Verified"
          description="Backend admin middleware successfully validated JWT role === 'admin'. Both client-side and server-side authorization are actively enforced."
          type="success"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      ) : (
        <Alert
          message="Verifying Administrative Authorization..."
          description="Contacting backend /api/auth/admin-check endpoint..."
          type="info"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      )}

      {/* Administrative Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="aqua-card">
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>System Users</span>}
              value="---"
              prefix={<TeamOutlined style={{ color: '#0284c7' }} />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              Phase 3 admin directory module
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="aqua-card">
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>Total Complaints</span>}
              value="---"
              prefix={<AlertOutlined style={{ color: '#ef4444' }} />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              Pending, in-progress & resolved
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="aqua-card">
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>Security Protocol</span>}
              value="JWT + bcrypt"
              prefix={<SafetyCertificateOutlined style={{ color: '#7c3aed' }} />}
              valueStyle={{ color: '#7c3aed', fontWeight: 700, fontSize: 20 }}
            />
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              Secured Role-Based Access
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="aqua-card">
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>API Health</span>}
              value="Operational"
              prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981', fontWeight: 700, fontSize: 20 }}
            />
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              Port 5000 Express Server
            </div>
          </Card>
        </Col>
      </Row>

      {/* Admin Modules Navigation */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            className="aqua-card"
            title={<span style={{ fontWeight: 600, color: '#0f172a' }}>👥 User Directory</span>}
            extra={
              <Button type="link" onClick={() => navigate('/admin/users')}>
                Manage <ArrowRightOutlined />
              </Button>
            }
          >
            <Paragraph style={{ color: '#64748b' }}>
              Audit all registered citizen profiles, registration timestamps, and activity statuses.
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
            title={<span style={{ fontWeight: 600, color: '#0f172a' }}>📋 Grievances Oversight</span>}
            extra={
              <Button type="link" onClick={() => navigate('/admin/complaints')}>
                Review <ArrowRightOutlined />
              </Button>
            }
          >
            <Paragraph style={{ color: '#64748b' }}>
              Review pipeline damage reports, leakage emergencies, and water quality issues. Update resolution statuses from Pending to Resolved.
            </Paragraph>
            <Button
              type="default"
              style={{ borderColor: '#0284c7', color: '#0284c7' }}
              onClick={() => navigate('/admin/complaints')}
            >
              Open Complaints Management
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
