import React from 'react';
import { Row, Col, Card, Statistic, Button, Typography, Tag, Space, Alert } from 'antd';
import {
  ExperimentOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Welcome Banner */}
      <Card
        className="aqua-card"
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #0284c7 0%, #075985 100%)',
          color: '#ffffff',
          borderRadius: 12,
          border: 'none',
        }}
      >
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Tag
              color="cyan"
              style={{
                borderRadius: 12,
                fontWeight: 600,
                marginBottom: 8,
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
              }}
            >
              CITIZEN DASHBOARD
            </Tag>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
              Welcome back, {user?.name || 'Citizen'}! 👋
            </Title>
            <Paragraph style={{ color: '#e0f2fe', margin: '8px 0 0 0', fontSize: 14 }}>
              Track daily household water consumption and report civic pipeline issues seamlessly.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <div style={{ color: '#bae6fd', fontSize: 13, marginBottom: 8 }}>
              <CalendarOutlined style={{ marginRight: 6 }} />
              {currentDate}
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                style={{
                  background: '#ffffff',
                  color: '#0284c7',
                  border: 'none',
                  fontWeight: 600,
                }}
                onClick={() => navigate('/consumption')}
              >
                Log Consumption
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Phase 1 Foundation Alert */}
      <Alert
        message="Phase 1 Active: Authentication & Foundation Ready"
        description="User session is verified via JWT. Role-based routing is actively protecting citizen and admin zones."
        type="info"
        showIcon
        style={{ marginBottom: 24, borderRadius: 8, background: '#f0f9ff', border: '1px solid #bae6fd' }}
      />

      {/* Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="aqua-card">
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>Today's Water Intake</span>}
              value="---"
              suffix="Litres"
              prefix={<ExperimentOutlined style={{ color: '#0284c7' }} />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              Phase 2 logging will populate daily stats
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="aqua-card">
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>Monthly Average</span>}
              value="---"
              suffix="L / day"
              prefix={<ExperimentOutlined style={{ color: '#0ea5e9' }} />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              Computed automatically from logs
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="aqua-card">
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>My Active Complaints</span>}
              value={0}
              prefix={<AlertOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              Water leakage & pressure grievances
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="aqua-card">
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>Account Standing</span>}
              value="Active"
              prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981', fontWeight: 700, fontSize: 20 }}
            />
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              Verified Citizen Account
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Navigation Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            className="aqua-card"
            title={
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                💧 Water Consumption Monitoring
              </span>
            }
            extra={
              <Button type="link" onClick={() => navigate('/consumption')}>
                View Module <ArrowRightOutlined />
              </Button>
            }
          >
            <Paragraph style={{ color: '#64748b' }}>
              Monitor daily water volume across Morning, Afternoon, and Evening cycles. The server
              automatically totals your input to maintain precise records.
            </Paragraph>
            <Button
              type="primary"
              style={{ background: '#0284c7' }}
              onClick={() => navigate('/consumption')}
            >
              Go to Consumption Logs
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            className="aqua-card"
            title={
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                📢 Civic Complaint Reporting
              </span>
            }
            extra={
              <Button type="link" onClick={() => navigate('/report-complaint')}>
                Report Issue <ArrowRightOutlined />
              </Button>
            }
          >
            <Paragraph style={{ color: '#64748b' }}>
              Encountering contaminated water, broken pipelines, or supply disruption? Report grievances
              directly to municipal administrative staff with priority levels.
            </Paragraph>
            <Button
              type="default"
              style={{ borderColor: '#0284c7', color: '#0284c7' }}
              onClick={() => navigate('/report-complaint')}
            >
              Lodge a Complaint
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
