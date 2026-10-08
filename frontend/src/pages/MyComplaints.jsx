import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Statistic,
  Descriptions,
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../api/axios';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const COMPLAINT_TYPES = [
  'Water Leakage',
  'No Water Supply',
  'Low Water Pressure',
  'Dirty Water',
  'Pipeline Damage',
  'Other',
];

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingComplaint, setViewingComplaint] = useState(null);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editForm] = Form.useForm();
  const navigate = useNavigate();

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data.data || []);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Delete complaint
  const handleDelete = async (id) => {
    try {
      await api.delete(`/complaints/${id}`);
      message.success('Complaint deleted successfully');
      fetchComplaints();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete complaint');
    }
  };

  // Open edit modal
  const handleEdit = (complaint) => {
    setEditingComplaint(complaint);
    editForm.setFieldsValue({
      type: complaint.type,
      location: complaint.location,
      description: complaint.description,
      priority: complaint.priority,
    });
    setEditModalOpen(true);
  };

  // Submit edit
  const onFinishEdit = async (values) => {
    setSubmitting(true);
    try {
      await api.put(`/complaints/${editingComplaint._id}`, values);
      message.success('Complaint updated successfully');
      setEditModalOpen(false);
      fetchComplaints();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update complaint');
    } finally {
      setSubmitting(false);
    }
  };

  // Status Badge Renderer
  const renderStatus = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <Tag
            color="warning"
            icon={<ClockCircleOutlined />}
            style={{ fontWeight: 600, padding: '2px 8px', borderRadius: 12 }}
          >
            Pending
          </Tag>
        );
      case 'In Progress':
        return (
          <Tag
            color="processing"
            icon={<SyncOutlined spin />}
            style={{ fontWeight: 600, padding: '2px 8px', borderRadius: 12 }}
          >
            In Progress
          </Tag>
        );
      case 'Resolved':
        return (
          <Tag
            color="success"
            icon={<CheckCircleOutlined />}
            style={{ fontWeight: 600, padding: '2px 8px', borderRadius: 12 }}
          >
            Resolved
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Priority Tag Renderer
  const renderPriority = (priority) => {
    const colorMap = {
      High: 'red',
      Medium: 'orange',
      Low: 'blue',
    };
    return (
      <Tag color={colorMap[priority] || 'default'} style={{ fontWeight: 600 }}>
        {priority}
      </Tag>
    );
  };

  // Metrics
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  // Table columns
  const columns = [
    {
      title: 'Complaint Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span style={{ fontWeight: 600 }}>{type}</span>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
      render: (loc) => <span>{loc}</span>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => renderPriority(priority),
      filters: [
        { text: 'High', value: 'High' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Low', value: 'Low' },
      ],
      onFilter: (value, record) => record.priority === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatus(status),
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Resolved', value: 'Resolved' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Filed Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: '#0284c7' }} />}
            onClick={() => setViewingComplaint(record)}
          >
            View
          </Button>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#0ea5e9' }} />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Complaint"
            description="Are you sure you want to delete this complaint record?"
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading && complaints.length === 0) {
    return <Loading tip="Loading complaints registry..." />;
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
              📢 My Complaints Directory
            </Title>
            <Paragraph style={{ color: '#e0f2fe', margin: '8px 0 0 0', fontSize: 14 }}>
              Track the live resolution status of your reported water leakages, supply outages, and quality grievances.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} className="responsive-banner-col">
            <Space wrap className="responsive-banner-actions">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchComplaints}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/report-complaint')}
                style={{
                  background: '#ffffff',
                  color: '#0284c7',
                  border: 'none',
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Report New Complaint
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="aqua-card">
            <Statistic
              title={<Text type="secondary">Pending Reviews</Text>}
              value={pendingCount}
              prefix={<ClockCircleOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ color: '#f59e0b', fontWeight: 700 }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Awaiting municipal administration triage
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="aqua-card">
            <Statistic
              title={<Text type="secondary">In Progress</Text>}
              value={inProgressCount}
              prefix={<SyncOutlined spin={inProgressCount > 0} style={{ color: '#0284c7' }} />}
              valueStyle={{ color: '#0284c7', fontWeight: 700 }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Maintenance technicians dispatched
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="aqua-card">
            <Statistic
              title={<Text type="secondary">Resolved Grievances</Text>}
              value={resolvedCount}
              prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981', fontWeight: 700 }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Successfully completed work orders
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Complaints Table */}
      <Card
        className="aqua-card"
        title={
          <span style={{ fontWeight: 600 }}>
            📋 Registered Grievances ({complaints.length})
          </span>
        }
      >
        {complaints.length === 0 ? (
          <EmptyState
            title="No Complaints Lodged"
            subTitle="You have not filed any water issues or grievances yet."
            actionText="Report a Grievance"
            actionLink="/report-complaint"
          />
        ) : (
          <Table
            columns={columns}
            dataSource={complaints}
            rowKey="_id"
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 650 }}
          />
        )}
      </Card>

      {/* View Complaint Modal */}
      <Modal
        title={
          <span style={{ fontWeight: 700 }}>
            🔍 Complaint Details #{viewingComplaint?._id.slice(-6)}
          </span>
        }
        open={!!viewingComplaint}
        onCancel={() => setViewingComplaint(null)}
        footer={[
          <Button key="close" type="primary" style={{ background: '#0284c7' }} onClick={() => setViewingComplaint(null)}>
            Close
          </Button>,
        ]}
        centered
        width={650}
        style={{ maxWidth: '95vw', top: 20 }}
      >
        {viewingComplaint && (
          <Descriptions
            bordered
            column={1}
            style={{ marginTop: 16 }}
            labelStyle={{ fontWeight: 600 }}
          >
            <Descriptions.Item label="Grievance Type">
              <span style={{ fontWeight: 700 }}>{viewingComplaint.type}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Resolution Status">
              {renderStatus(viewingComplaint.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              {renderPriority(viewingComplaint.priority)}
            </Descriptions.Item>
            <Descriptions.Item label="Incident Location">
              <span style={{ wordBreak: 'break-word' }}>{viewingComplaint.location}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Detailed Description">
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {viewingComplaint.description}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Lodged At">
              {dayjs(viewingComplaint.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="Last Update">
              {dayjs(viewingComplaint.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Edit Complaint Modal */}
      <Modal
        title={<span style={{ fontWeight: 700 }}>✏️ Edit Complaint Details</span>}
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        width={560}
        style={{ maxWidth: '95vw', top: 20 }}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={onFinishEdit}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="type"
            label={<span style={{ fontWeight: 600 }}>Grievance Category</span>}
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select options={COMPLAINT_TYPES.map((t) => ({ label: t, value: t }))} />
          </Form.Item>

          <Form.Item
            name="location"
            label={<span style={{ fontWeight: 600 }}>Location / Landmark</span>}
            rules={[
              { required: true, message: 'Please provide location' },
              { min: 3, message: 'Must be at least 3 characters' },
            ]}
          >
            <Input placeholder="e.g. Sector 4, Opposite Water Tank" />
          </Form.Item>

          <Form.Item
            name="priority"
            label={<span style={{ fontWeight: 600 }}>Urgency / Priority</span>}
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: 'Low - Minor issue', value: 'Low' },
                { label: 'Medium - Standard service impact', value: 'Medium' },
                { label: 'High - Emergency / Severe leakage', value: 'High' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span style={{ fontWeight: 600 }}>Issue Description</span>}
            rules={[
              { required: true, message: 'Please describe the problem' },
              { min: 10, message: 'Must be at least 10 characters' },
            ]}
          >
            <TextArea rows={4} placeholder="Describe the water pipeline or supply issue..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{ background: '#0284c7', fontWeight: 600 }}
              >
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyComplaints;
