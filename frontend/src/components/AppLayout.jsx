import React, { useState, useEffect } from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content, Footer } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 992);
  const { token } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleMenu = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: token.colorBgLayout,
        transition: 'background-color 0.25s ease',
        overflowX: 'hidden',
        maxWidth: '100vw',
      }}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Layout
        style={{
          background: token.colorBgLayout,
          minWidth: 0,
          overflowX: 'hidden',
        }}
      >
        <Header
          collapsed={collapsed}
          isMobile={isMobile}
          mobileOpen={mobileOpen}
          onToggleMenu={handleToggleMenu}
        />
        <Content
          style={{
            margin: isMobile ? '12px 10px' : '20px 16px',
            minHeight: 280,
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </Content>
        <Footer
          className="aqua-footer"
          style={{
            textAlign: 'center',
            color: token.colorTextTertiary || '#94a3b8',
            fontSize: 12,
            background: 'transparent',
            padding: '16px 12px',
          }}
        >
          AquaTracker © 2026 — Water Consumption Monitoring & Grievance Reporting System (MSBTE Micro-Project)
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
