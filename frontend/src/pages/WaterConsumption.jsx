import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Popconfirm,
  Tag,
  Typography,
  Space,
  message,
  Statistic,
  Alert,
  theme,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExperimentOutlined,
  CalendarOutlined,
  BarChartOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import api from '../api/axios';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const { Title, Text, Paragraph } = Typography;

const WaterConsumption = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  // Watch form fields for live total preview in modal
  const morningVal = Form.useWatch('morning', form) || 0;
  const afternoonVal = Form.useWatch('afternoon', form) || 0;
  const eveningVal = Form.useWatch('evening', form) || 0;
  const liveTotal = (Number(morningVal) + Number(afternoonVal) + Number(eveningVal)).toFixed(2);

  // Fetch user consumption records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get('/consumption');
      setRecords(res.data.data || []);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to load consumption history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Open modal for Adding
  const handleAddNew = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      date: dayjs(),
      morning: 0,
      afternoon: 0,
      evening: 0,
    });
    setModalOpen(true);
  };

  // Open modal for Editing
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      date: dayjs(record.date),
      morning: record.morning,
      afternoon: record.afternoon,
      evening: record.evening,
    });
    setModalOpen(true);
  };

  // Delete record
  const handleDelete = async (id) => {
    try {
      await api.delete(`/consumption/${id}`);
      message.success('Consumption record deleted');
      fetchRecords();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete record');
    }
  };

  // Form submission (Add or Edit)
  const onFinish = async (values) => {
    setSubmitting(true);
    const formattedDate = values.date.format('YYYY-MM-DD');

    const payload = {
      date: formattedDate,
      morning: Number(values.morning),
      afternoon: Number(values.afternoon),
      evening: Number(values.evening),
    };

    try {
      if (editingRecord) {
        await api.put(`/consumption/${editingRecord._id}`, payload);
        message.success('Consumption entry updated successfully');
      } else {
        await api.post('/consumption', payload);
        message.success('Consumption entry recorded successfully');
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save consumption record');
    } finally {
      setSubmitting(false);
    }
  };

  // Computed summary metrics
  const todayStr = dayjs().format('YYYY-MM-DD');
  const todayEntry = records.find((r) => r.date === todayStr);
  const totalVolume = records.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const avgDaily = records.length > 0 ? (totalVolume / records.length).toFixed(1) : '0';

  // Format chart data (sorted chronologically ascending)
  const chartData = [...records]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14) // Last 14 days
    .map((item) => ({
      date: item.date.slice(5), // MM-DD
      fullDate: item.date,
      total: item.total,
      morning: item.morning,
      afternoon: item.afternoon,
      evening: item.evening,
    }));

  // Table columns
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: '#0284c7' }} />
          <span style={{ fontWeight: 600 }}>{date}</span>
          {date === todayStr && <Tag color="blue">Today</Tag>}
        </Space>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Morning (L)',
      dataIndex: 'morning',
      key: 'morning',
      render: (val) => `${val} L`,
    },
    {
      title: 'Afternoon (L)',
      dataIndex: 'afternoon',
      key: 'afternoon',
      render: (val) => `${val} L`,
    },
    {
      title: 'Evening (L)',
      dataIndex: 'evening',
      key: 'evening',
      render: (val) => `${val} L`,
    },
    {
      title: 'Daily Total (L)',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <Tag
          color="cyan"
          style={{
            fontWeight: 700,
            fontSize: 13,
            padding: '2px 10px',
            borderRadius: 6,
          }}
        >
          {total} L
        </Tag>
      ),
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#0284c7' }} />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Record"
            description="Are you sure you want to delete this consumption record?"
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading && records.length === 0) {
    return <Loading tip="Fetching water consumption data..." />;
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Page Header */}
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
              💧 Water Consumption Monitoring
            </Title>
            <Paragraph style={{ color: '#e0f2fe', margin: '8px 0 0 0', fontSize: 14 }}>
              Record daily household water intake. The backend automatically computes and maintains accurate daily totals.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchRecords}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddNew}
                style={{
                  background: '#ffffff',
                  color: '#0284c7',
                  border: 'none',
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Add Consumption
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Summary KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="aqua-card">
            <Statistic
              title={<Text type="secondary">Today's Intake</Text>}
              value={todayEntry ? todayEntry.total : '--'}
              suffix={todayEntry ? 'Litres' : ''}
              prefix={<ExperimentOutlined style={{ color: '#0284c7' }} />}
              valueStyle={{ fontWeight: 700 }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {todayEntry ? 'Logged for today' : 'No entry recorded for today yet'}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="aqua-card">
            <Statistic
              title={<Text type="secondary">Average Daily Intake</Text>}
              value={records.length > 0 ? avgDaily : '--'}
              suffix={records.length > 0 ? 'L / day' : ''}
              prefix={<BarChartOutlined style={{ color: '#0ea5e9' }} />}
              valueStyle={{ fontWeight: 700 }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Calculated across {records.length} logged days
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="aqua-card">
            <Statistic
              title={<Text type="secondary">Total Volume Monitored</Text>}
              value={records.length > 0 ? totalVolume.toFixed(1) : '--'}
              suffix={records.length > 0 ? 'Litres' : ''}
              prefix={<ExperimentOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981', fontWeight: 700 }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Lifetime total logged in AquaTracker
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Consumption Trend Chart */}
      {records.length > 0 && (
        <Card
          className="aqua-card"
          title={
            <Space>
              <BarChartOutlined style={{ color: '#0284c7' }} />
              <span style={{ fontWeight: 600 }}>Daily Consumption Trend</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={token.colorBorderSecondary || '#f1f5f9'} />
                <XAxis dataIndex="date" dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit="L" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            background: token.colorBgElevated || '#ffffff',
                            color: token.colorText,
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: `1px solid ${token.colorBorderSecondary || '#e2e8f0'}`,
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: 4, color: token.colorTextHeading }}>
                            {data.fullDate}
                          </div>
                          <div style={{ color: '#0284c7', fontWeight: 600 }}>
                            Total: {data.total} Litres
                          </div>
                          <div style={{ fontSize: 12, color: token.colorTextSecondary, marginTop: 4 }}>
                            Morning: {data.morning}L | Afternoon: {data.afternoon}L | Evening: {data.evening}L
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" fill="#0284c7" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Consumption History Table */}
      <Card
        className="aqua-card"
        title={
          <span style={{ fontWeight: 600 }}>
            📋 Consumption History Logs ({records.length})
          </span>
        }
      >
        {records.length === 0 ? (
          <EmptyState
            title="No Consumption Records Yet"
            subTitle="Start tracking your household water intake by adding your first daily record."
            actionText="Log Water Intake"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew} style={{ background: '#0284c7' }}>
                Add First Consumption Entry
              </Button>
            }
          />
        ) : (
          <Table
            columns={columns}
            dataSource={records}
            rowKey="_id"
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 600 }}
          />
        )}
      </Card>

      {/* Add / Edit Consumption Modal */}
      <Modal
        title={
          <span style={{ fontWeight: 700 }}>
            {editingRecord ? '✏️ Edit Water Consumption' : '💧 Log Daily Water Consumption'}
          </span>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="date"
            label={<span style={{ fontWeight: 600 }}>Consumption Date</span>}
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%', borderRadius: 8 }} format="YYYY-MM-DD" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                name="morning"
                label={<span style={{ fontWeight: 600 }}>Morning (L)</span>}
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber
                  min={0}
                  step={0.5}
                  precision={2}
                  style={{ width: '100%', borderRadius: 8 }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="afternoon"
                label={<span style={{ fontWeight: 600 }}>Afternoon (L)</span>}
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber
                  min={0}
                  step={0.5}
                  precision={2}
                  style={{ width: '100%', borderRadius: 8 }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="evening"
                label={<span style={{ fontWeight: 600 }}>Evening (L)</span>}
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber
                  min={0}
                  step={0.5}
                  precision={2}
                  style={{ width: '100%', borderRadius: 8 }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Live Calculated Total Banner */}
          <Alert
            message={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Calculated Total Intake:</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#0284c7' }}>
                  {liveTotal} Litres
                </span>
              </div>
            }
            description="The backend strictly re-computes total = morning + afternoon + evening."
            type="info"
            showIcon
            style={{ marginBottom: 20, borderRadius: 8 }}
          />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{ background: '#0284c7', fontWeight: 600 }}
              >
                {editingRecord ? 'Update Record' : 'Save Consumption'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WaterConsumption;
