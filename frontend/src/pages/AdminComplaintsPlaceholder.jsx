import React from 'react';
import EmptyState from '../components/EmptyState';

const AdminComplaintsPlaceholder = () => {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <EmptyState
        status="info"
        title="Admin Complaints Oversight & Status Management"
        subTitle="This module is scheduled for Phase 3 (30%). Administrators will be able to review all community water complaints and update grievance status (Pending → In Progress → Resolved)."
        actionText="Back to Admin Dashboard"
        actionLink="/admin/dashboard"
      />
    </div>
  );
};

export default AdminComplaintsPlaceholder;
