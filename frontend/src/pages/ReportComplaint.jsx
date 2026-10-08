import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Radio,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Alert,
  message,
} from 'antd';
import {
  FormOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const COMPLAINT_TYPES = [
  { label: '💧 Water Leakage (Street or Pipeline leak)', value: 'Water Leakage' },
  { label: '🚫 No Water Supply (Total disruption)', value: 'No Water Supply' },
  { label: '📉 Low Water Pressure (Insufficient flow)', value: 'Low Water Pressure' },
  { label: '🟤 Dirty / Contaminated Water (Muddy, odor, or discolored)', value: 'Dirty Water' },
  { label: '🛠️ Pipeline Damage (Burst or broken main)', value: 'Pipeline Damage' },
  { label: '❓ Other Civic Water Issue', value: 'Other' },
];

const ReportComplaint = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Submits complaint to backend; backend strictly forces status: "Pending"
      await api.post('/complaints', {
        type: values.type,
        location: values.location.trim(),
        description: values.description.trim(),
        priority: values.priority,
      });

      message.success('Complaint reported successfully! Your grievance is now Pending administrative review.');
      navigate('/complaints', { replace: true });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit complaint. Please try again.';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
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
        <Row align="middle" justify="space-between">
          <Col xs={24} md={18}>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
              📢 Report a Water Grievance
            </Title>
            <Paragraph style={{ color: '#e0f2fe', margin: '8px 0 0 0', fontSize: 14 }}>
              Submit civic water concerns directly to municipal administrators. Initial status is logged as Pending.
            </Paragraph>
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'right' }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/complaints')}
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
            >
              My Complaints
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Form Card */}
      <Card className="aqua-card">
        <Alert
          message="Direct Administrative Redressal"
          description="Your complaint will be assigned to municipal maintenance engineers. You can track progress live in the My Complaints section."
          type="info"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8, background: '#f0f9ff', border: '1px solid #bae6fd' }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ priority: 'Medium' }}
          requiredMark="optional"
        >
          {/* Complaint Type */}
          <Form.Item
            name="type"
            label={
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                <FormOutlined style={{ marginRight: 6, color: '#0284c7' }} />
                Grievance Category
              </span>
            }
            rules={[{ required: true, message: 'Please select a grievance type' }]}
          >
            <Select
              placeholder="Select water issue category"
              options={COMPLAINT_TYPES}
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          {/* Location */}
          <Form.Item
            name="location"
            label={
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                <EnvironmentOutlined style={{ marginRight: 6, color: '#0284c7' }} />
                Incident Location & Landmark
              </span>
            }
            rules={[
              { required: true, message: 'Please specify the location' },
              { min: 3, message: 'Location must be at least 3 characters long' },
            ]}
          >
            <Input
              placeholder="e.g. Shivaji Nagar, Near Overhead Tank, Ward 4"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          {/* Priority */}
          <Form.Item
            name="priority"
            label={<span style={{ fontWeight: 600, color: '#0f172a' }}>Urgency Level</span>}
            rules={[{ required: true, message: 'Please select priority' }]}
          >
            <Radio.Group buttonStyle="solid" size="large">
              <Radio.Button value="Low">Low (Minor / Dripping)</Radio.Button>
              <Radio.Button value="Medium">Medium (Regular Supply Issue)</Radio.Button>
              <Radio.Button value="High" style={{ color: '#ef4444' }}>
                High (Major Burst / Heavy Contamination)
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* Description */}
          <Form.Item
            name="description"
            label={
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                <FileTextOutlined style={{ marginRight: 6, color: '#0284c7' }} />
                Detailed Description
              </span>
            }
            rules={[
              { required: true, message: 'Please describe the problem' },
              { min: 10, message: 'Description must be at least 10 characters long' },
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Provide specific details about the issue: duration, severity, exact location details, etc."
              showCount
              maxLength={1000}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 8 }}>
            <Space size="middle">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                icon={<SendOutlined />}
                style={{
                  background: '#0284c7',
                  fontWeight: 600,
                  height: 44,
                  padding: '0 28px',
                  borderRadius: 8,
                  boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
                }}
              >
                Submit Grievance
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/complaints')}
                style={{ height: 44, borderRadius: 8 }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ReportComplaint;
