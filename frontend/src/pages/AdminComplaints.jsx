import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Select,
  Modal,
  Form,
  Radio,
  Descriptions,
  message,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  ReloadOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../api/axios';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const { Title, Paragraph, Text } = Typography;

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modal states
  const [viewingComplaint, setViewingComplaint] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [submittingStatus, setSubmittingStatus] = useState(false);
  const [statusForm] = Form.useForm();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (priorityFilter !== 'ALL') params.priority = priorityFilter;

      const res = await api.get('/admin/complaints', { params });
      setComplaints(res.data.data || []);
    } catch (err) {
      console.error('Error fetching admin complaints:', err);
      message.error(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, priorityFilter]);

  // Open Status Update Modal
  const handleOpenStatusModal = (record) => {
    setSelectedComplaint(record);
    statusForm.setFieldsValue({ status: record.status });
    setStatusModalOpen(true);
  };

  // Submit Status Change (Admin only)
  const onFinishStatusUpdate = async (values) => {
    if (!selectedComplaint) return;
    setSubmittingStatus(true);
    try {
      await api.patch(`/admin/complaints/${selectedComplaint._id}/status`, {
        status: values.status,
      });
      message.success(`Status updated to "${values.status}" successfully!`);
      setStatusModalOpen(false);
      fetchComplaints();
    } catch (err) {
      console.error('Error updating complaint status:', err);
      message.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmittingStatus(false);
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

  // Table Columns
  const columns = [
    {
      title: 'Complaint Category',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <span style={{ fontWeight: 600 }}>{type}</span>,
    },
    {
      title: 'Citizen',
      key: 'citizen',
      render: (_, record) => {
        const citizenName = record.userId?.name || 'Citizen';
        const citizenEmail = record.userId?.email || 'N/A';
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>
              {citizenName}
            </span>
            <Text type="secondary" style={{ fontSize: 11 }}>{citizenEmail}</Text>
          </div>
        );
      },
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
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatus(status),
    },
    {
      title: 'Date Filed',
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
            type="primary"
            size="small"
            icon={<EditOutlined />}
            style={{
              background: '#0284c7',
              borderRadius: 6,
              fontWeight: 500,
            }}
            onClick={() => handleOpenStatusModal(record)}
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  if (loading && complaints.length === 0) {
    return <Loading tip="Loading global complaints registry..." />;
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
              📋 Grievances Oversight & Status Control
            </Title>
            <Paragraph style={{ color: '#e0f2fe', margin: '8px 0 0 0', fontSize: 14 }}>
              Review community reports across all residential sectors and advance resolution workflows (Pending &rarr; In Progress &rarr; Resolved).
            </Paragraph>
          </Col>
          <Col xs={24} md={8} className="responsive-banner-col">
            <Space wrap className="responsive-banner-actions">
              <Button
                icon={<ReloadOutlined spin={loading} />}
                onClick={fetchComplaints}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Filter Toolbar Card */}
      <Card className="aqua-card" style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Space wrap size="middle">
              <div>
                <Text type="secondary" style={{ fontWeight: 600, marginRight: 8 }}>
                  <FilterOutlined style={{ marginRight: 4 }} />
                  Filter Status:
                </Text>
                <Select
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                  style={{ width: 140 }}
                  options={[
                    { label: 'All Statuses', value: 'ALL' },
                    { label: 'Pending', value: 'Pending' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Resolved', value: 'Resolved' },
                  ]}
                />
              </div>

              <div>
                <Text type="secondary" style={{ fontWeight: 600, marginRight: 8 }}>
                  Priority:
                </Text>
                <Select
                  value={priorityFilter}
                  onChange={(val) => setPriorityFilter(val)}
                  style={{ width: 130 }}
                  options={[
                    { label: 'All Priorities', value: 'ALL' },
                    { label: 'High', value: 'High' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'Low', value: 'Low' },
                  ]}
                />
              </div>
            </Space>
          </Col>

          <Col xs={24} md={8} className="responsive-banner-col">
            <Text type="secondary" style={{ fontSize: 13 }}>
              Displaying <b>{complaints.length}</b> grievances
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Complaints Table Card */}
      <Card className="aqua-card">
        {complaints.length === 0 ? (
          <EmptyState
            title="No Matching Complaints"
            subTitle="No grievance records match the current filter selection."
          />
        ) : (
          <Table
            columns={columns}
            dataSource={complaints}
            rowKey="_id"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      {/* View Complaint Details Modal */}
      <Modal
        title={
          <span style={{ fontWeight: 700 }}>
            🔍 Complaint Case #{viewingComplaint?._id.slice(-6)}
          </span>
        }
        open={!!viewingComplaint}
        onCancel={() => setViewingComplaint(null)}
        footer={[
          <Button
            key="statusBtn"
            type="primary"
            style={{ background: '#0284c7' }}
            onClick={() => {
              const rec = viewingComplaint;
              setViewingComplaint(null);
              handleOpenStatusModal(rec);
            }}
          >
            Change Status
          </Button>,
          <Button key="close" onClick={() => setViewingComplaint(null)}>
            Close
          </Button>,
        ]}
        centered
        width={680}
        style={{ maxWidth: '95vw', top: 20 }}
      >
        {viewingComplaint && (
          <Descriptions
            bordered
            column={1}
            style={{ marginTop: 16 }}
            labelStyle={{ fontWeight: 600 }}
          >
            <Descriptions.Item label="Grievance Category">
              <span style={{ fontWeight: 700 }}>{viewingComplaint.type}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Citizen Applicant">
              <Space wrap>
                <UserOutlined style={{ color: '#0284c7' }} />
                <span style={{ wordBreak: 'break-word' }}>
                  {viewingComplaint.userId?.name || 'Citizen'} ({viewingComplaint.userId?.email || 'N/A'})
                </span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Resolution Status">
              {renderStatus(viewingComplaint.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Priority Level">
              {renderPriority(viewingComplaint.priority)}
            </Descriptions.Item>
            <Descriptions.Item label="Incident Location">
              <Space wrap>
                <EnvironmentOutlined style={{ color: '#0284c7' }} />
                <span style={{ wordBreak: 'break-word' }}>{viewingComplaint.location}</span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Problem Description">
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, wordBreak: 'break-word' }}>
                {viewingComplaint.description}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Lodged Timestamp">
              {dayjs(viewingComplaint.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="Last Administrative Action">
              {dayjs(viewingComplaint.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Update Complaint Status Modal (Admin Only) */}
      <Modal
        title={
          <span style={{ fontWeight: 700 }}>
            🛠️ Update Complaint Status #{selectedComplaint?._id.slice(-6)}
          </span>
        }
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        width={540}
        style={{ maxWidth: '95vw', top: 20 }}
      >
        <div style={{ marginBottom: 16, marginTop: 8 }}>
          <Text type="secondary" style={{ wordBreak: 'break-word' }}>
            Category: <b>{selectedComplaint?.type}</b> | Location: <b>{selectedComplaint?.location}</b>
          </Text>
        </div>

        <Form
          form={statusForm}
          layout="vertical"
          onFinish={onFinishStatusUpdate}
        >
          <Form.Item
            name="status"
            label={<span style={{ fontWeight: 600 }}>Resolution Stage</span>}
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Radio.Group buttonStyle="solid" size="large" style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio.Button
                  value="Pending"
                  style={{
                    width: '100%',
                    minHeight: 44,
                    height: 'auto',
                    padding: '10px 14px',
                    lineHeight: 1.4,
                    whiteSpace: 'normal',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ClockCircleOutlined style={{ marginRight: 8, color: '#f59e0b', flexShrink: 0 }} />
                  <span>Pending (Awaiting Initial Assessment)</span>
                </Radio.Button>
                <Radio.Button
                  value="In Progress"
                  style={{
                    width: '100%',
                    minHeight: 44,
                    height: 'auto',
                    padding: '10px 14px',
                    lineHeight: 1.4,
                    whiteSpace: 'normal',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <SyncOutlined style={{ marginRight: 8, color: '#0284c7', flexShrink: 0 }} />
                  <span>In Progress (Maintenance Team Dispatched)</span>
                </Radio.Button>
                <Radio.Button
                  value="Resolved"
                  style={{
                    width: '100%',
                    minHeight: 44,
                    height: 'auto',
                    padding: '10px 14px',
                    lineHeight: 1.4,
                    whiteSpace: 'normal',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CheckCircleOutlined style={{ marginRight: 8, color: '#10b981', flexShrink: 0 }} />
                  <span>Resolved (Issue Fixed & Verified)</span>
                </Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
            <Space wrap>
              <Button onClick={() => setStatusModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submittingStatus}
                style={{ background: '#0284c7', fontWeight: 600 }}
              >
                Apply Status Change
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminComplaints;
