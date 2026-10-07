import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const homePath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            style={{ background: '#0284c7' }}
            onClick={() => navigate(homePath)}
          >
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
