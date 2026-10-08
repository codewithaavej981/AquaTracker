import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content, Footer } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: token.colorBgLayout,
        transition: 'background-color 0.25s ease',
      }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ background: token.colorBgLayout }}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: '20px 16px',
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            color: token.colorTextTertiary || '#94a3b8',
            fontSize: 12,
            background: 'transparent',
            padding: '16px 20px',
          }}
        >
          AquaTracker © 2026 — Water Consumption Monitoring & Grievance Reporting System (MSBTE Micro-Project)
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
