import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = ({ tip = 'Loading AquaTracker...', fullScreen = false }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 32, color: '#0284c7' }} spin />;

  const containerStyle = fullScreen
    ? {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
      }
    : {
        padding: '60px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      };

  return (
    <div style={containerStyle}>
      <Spin indicator={antIcon} />
      {tip && (
        <span style={{ marginTop: 16, color: '#64748b', fontSize: 14, fontWeight: 500 }}>
          {tip}
        </span>
      )}
    </div>
  );
};

export default Loading;
