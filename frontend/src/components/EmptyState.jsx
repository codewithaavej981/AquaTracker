import React from 'react';
import { Result, Button, theme } from 'antd';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({
  status = 'info',
  title = 'No Data Available',
  subTitle = 'There is currently no information to display.',
  actionText,
  actionLink,
  extra,
}) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <div
      style={{
        padding: '32px 16px',
        background: token.colorBgContainer,
        borderRadius: 10,
        border: `1px solid ${token.colorBorderSecondary || '#e2e8f0'}`,
      }}
    >
      <Result
        status={status}
        title={<span style={{ color: token.colorTextHeading, fontWeight: 600 }}>{title}</span>}
        subTitle={<span style={{ color: token.colorTextSecondary }}>{subTitle}</span>}
        extra={
          extra ||
          (actionText && actionLink ? (
            <Button
              type="primary"
              style={{ background: '#0284c7' }}
              onClick={() => navigate(actionLink)}
            >
              {actionText}
            </Button>
          ) : null)
        }
      />
    </div>
  );
};

export default EmptyState;
