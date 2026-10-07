import React from 'react';
import EmptyState from '../components/EmptyState';

const MyComplaintsPlaceholder = () => {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <EmptyState
        status="info"
        title="My Complaints Directory"
        subTitle="This module is scheduled for Phase 2 (30%). You will be able to review all your filed complaints, track status changes (Pending → In Progress → Resolved), and view timestamps."
        actionText="Back to Dashboard"
        actionLink="/dashboard"
      />
    </div>
  );
};

export default MyComplaintsPlaceholder;
