import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content, Footer } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ background: '#f8fafc' }}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: '24px',
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: 12,
            background: 'transparent',
            padding: '16px 24px',
          }}
        >
          AquaTracker © 2026 — Water Consumption Monitoring & Grievance Reporting System (MSBTE Micro-Project)
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
