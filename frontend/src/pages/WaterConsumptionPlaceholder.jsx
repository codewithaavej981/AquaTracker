import React from 'react';
import EmptyState from '../components/EmptyState';

const WaterConsumptionPlaceholder = () => {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <EmptyState
        status="info"
        title="Water Consumption Module"
        subTitle="This module is scheduled for Phase 2 (30%). You will be able to log daily morning, afternoon, and evening consumption in litres with automatic backend summation and Recharts visualizations."
        actionText="Back to Dashboard"
        actionLink="/dashboard"
      />
    </div>
  );
};

export default WaterConsumptionPlaceholder;
