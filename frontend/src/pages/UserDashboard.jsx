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
  Table,
  Spin,
} from 'antd';
import {
  ExperimentOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const { Title, Text, Paragraph } = Typography;

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [consumptions, setConsumptions] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Fetch real user data from MongoDB
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [consRes, compRes] = await Promise.all([
        api.get('/consumption'),
        api.get('/complaints'),
      ]);
      setConsumptions(consRes.data.data || []);
      setComplaints(compRes.data.data || []);
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const todayStr = dayjs().format('YYYY-MM-DD');
  const currentMonthPrefix = dayjs().format('YYYY-MM');

  // Compute Today's Intake
  const todayRecord = consumptions.find((c) => c.date === todayStr);
  const todayValue = todayRecord ? `${todayRecord.total} Litres` : '-- Litres';

  // Compute Monthly Average
  const monthRecords = consumptions.filter((c) => c.date && c.date.startsWith(currentMonthPrefix));
  const monthTotal = monthRecords.reduce((sum, c) => sum + (c.total || 0), 0);
  const monthlyAvgValue =
    monthRecords.length > 0
      ? `${(monthTotal / monthRecords.length).toFixed(1)} L / day`
      : '-- L / day';

  // Compute Active Complaints (Pending + In Progress)
  const activeComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;

  const currentDateDisplay = dayjs().format('dddd, MMMM D, YYYY');

  // Mini columns for recent consumption preview
  const recentConsumptionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <span style={{ fontWeight: 600 }}>
          {date} {date === todayStr && <Tag color="blue">Today</Tag>}
        </span>
      ),
    },
    {
      title: 'Morning',
      dataIndex: 'morning',
      key: 'morning',
      render: (v) => `${v} L`,
    },
    {
      title: 'Afternoon',
      dataIndex: 'afternoon',
      key: 'afternoon',
      render: (v) => `${v} L`,
    },
    {
      title: 'Evening',
      dataIndex: 'evening',
      key: 'evening',
      render: (v) => `${v} L`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (t) => (
        <Tag color="cyan" style={{ fontWeight: 700 }}>
          {t} L
        </Tag>
      ),
    },
  ];

  // Mini columns for recent complaints preview
  const recentComplaintsColumns = [
    {
      title: 'Issue',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <span style={{ fontWeight: 600 }}>{type}</span>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (p) => {
        const color = p === 'High' ? 'red' : p === 'Medium' ? 'orange' : 'blue';
        return <Tag color={color}>{p}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'Pending') {
          return <Tag color="warning" icon={<ClockCircleOutlined />}>Pending</Tag>;
        }
        if (status === 'In Progress') {
          return <Tag color="processing" icon={<SyncOutlined spin />}>In Progress</Tag>;
        }
        return <Tag color="success" icon={<CheckCircleOutlined />}>Resolved</Tag>;
      },
    },
  ];

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
            <div style={{ color: '#bae6fd', fontSize: 13, marginBottom: 12 }}>
              <CalendarOutlined style={{ marginRight: 6 }} />
              {currentDateDisplay}
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchDashboardData}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                style={{
                  background: '#ffffff',
                  color: '#0284c7',
                  border: 'none',
                  fontWeight: 600,
                }}
                onClick={() => navigate('/water-consumption')}
              >
                Log Consumption
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Real Metric KPI Cards */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* Today's Intake */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="aqua-card">
              <Statistic
                title={<Text type="secondary" style={{ fontWeight: 500 }}>Today's Water Intake</Text>}
                value={todayValue}
                prefix={<ExperimentOutlined style={{ color: '#0284c7' }} />}
                valueStyle={{ fontWeight: 700, fontSize: 22 }}
              />
              <div style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {todayRecord ? 'Real log from database' : 'No consumption logged today'}
                </Text>
              </div>
            </Card>
          </Col>

          {/* Monthly Average */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="aqua-card">
              <Statistic
                title={<Text type="secondary" style={{ fontWeight: 500 }}>Monthly Average</Text>}
                value={monthlyAvgValue}
                prefix={<ExperimentOutlined style={{ color: '#0ea5e9' }} />}
                valueStyle={{ fontWeight: 700, fontSize: 22 }}
              />
              <div style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {monthRecords.length > 0 ? `Computed from ${monthRecords.length} day(s)` : 'No logs recorded this month'}
                </Text>
              </div>
            </Card>
          </Col>

          {/* Active Complaints */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="aqua-card">
              <Statistic
                title={<Text type="secondary" style={{ fontWeight: 500 }}>Active Complaints</Text>}
                value={`${activeComplaintsCount} Active Complaints`}
                prefix={<AlertOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ fontWeight: 700, fontSize: 20 }}
              />
              <div style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {activeComplaintsCount > 0 ? 'Pending or in maintenance' : '0 unresolved grievances'}
                </Text>
              </div>
            </Card>
          </Col>

          {/* Account Status */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="aqua-card">
              <Statistic
                title={<Text type="secondary" style={{ fontWeight: 500 }}>Account Standing</Text>}
                value="Active"
                prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ color: '#10b981', fontWeight: 700, fontSize: 22 }}
              />
              <div style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Verified Citizen Account
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>

      {/* Real Data Preview Cards */}
      <Row gutter={[16, 16]}>
        {/* Recent Water Consumption */}
        <Col xs={24} lg={12}>
          <Card
            className="aqua-card"
            title={
              <Space>
                <ExperimentOutlined style={{ color: '#0284c7' }} />
                <span style={{ fontWeight: 600 }}>
                  Recent Water Consumption Logs
                </span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/water-consumption')}>
                View All <ArrowRightOutlined />
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            {consumptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Text type="secondary">No consumption entries recorded yet.</Text>
                <div style={{ marginTop: 12 }}>
                  <Button
                    type="primary"
                    size="small"
                    style={{ background: '#0284c7' }}
                    onClick={() => navigate('/water-consumption')}
                  >
                    Log First Entry
                  </Button>
                </div>
              </div>
            ) : (
              <Table
                columns={recentConsumptionColumns}
                dataSource={consumptions.slice(0, 4)}
                rowKey="_id"
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>

        {/* Recent Complaints */}
        <Col xs={24} lg={12}>
          <Card
            className="aqua-card"
            title={
              <Space>
                <AlertOutlined style={{ color: '#f59e0b' }} />
                <span style={{ fontWeight: 600 }}>
                  Recent Reported Grievances
                </span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/complaints')}>
                View All <ArrowRightOutlined />
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            {complaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Text type="secondary">No grievances or pipeline issues reported.</Text>
                <div style={{ marginTop: 12 }}>
                  <Button
                    type="default"
                    size="small"
                    style={{ borderColor: '#0284c7', color: '#0284c7' }}
                    onClick={() => navigate('/report-complaint')}
                  >
                    Report an Issue
                  </Button>
                </div>
              </div>
            ) : (
              <Table
                columns={recentComplaintsColumns}
                dataSource={complaints.slice(0, 4)}
                rowKey="_id"
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
