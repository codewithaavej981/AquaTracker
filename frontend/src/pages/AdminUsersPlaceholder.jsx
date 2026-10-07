import React from 'react';
import EmptyState from '../components/EmptyState';

const AdminUsersPlaceholder = () => {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <EmptyState
        status="info"
        title="Admin User Management Directory"
        subTitle="This module is scheduled for Phase 3 (30%). Administrators will be able to view all registered citizen users, registration dates, and account details."
        actionText="Back to Admin Dashboard"
        actionLink="/admin/dashboard"
      />
    </div>
  );
};

export default AdminUsersPlaceholder;
