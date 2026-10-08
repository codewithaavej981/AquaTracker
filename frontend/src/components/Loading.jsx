import React from 'react';
import { Spin, theme } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = ({ tip = 'Loading AquaTracker...', fullScreen = false }) => {
  const { token } = theme.useToken();
  const antIcon = <LoadingOutlined style={{ fontSize: 32, color: '#0284c7' }} spin />;

  const containerStyle = fullScreen
    ? {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: token.colorBgLayout,
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
        <span style={{ marginTop: 16, color: token.colorTextSecondary, fontSize: 14, fontWeight: 500 }}>
          {tip}
        </span>
      )}
    </div>
  );
};

export default Loading;
