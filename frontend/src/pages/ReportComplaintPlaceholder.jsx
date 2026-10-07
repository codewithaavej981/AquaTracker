import React from 'react';
import EmptyState from '../components/EmptyState';

const ReportComplaintPlaceholder = () => {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <EmptyState
        status="info"
        title="Report Water Grievance"
        subTitle="This module is scheduled for Phase 2 (30%). You will be able to file complaints for Water Leakage, Low Water Pressure, Dirty Water, Pipeline Damage, etc., complete with location and priority tags."
        actionText="Back to Dashboard"
        actionLink="/dashboard"
      />
    </div>
  );
};

export default ReportComplaintPlaceholder;
