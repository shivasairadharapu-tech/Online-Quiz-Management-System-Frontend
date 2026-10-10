import React from 'react';

export const ProgressBar = ({ current, total, percentage, height = 8, color = 'primary' }) => {
  const pct = percentage !== undefined ? percentage : total > 0 ? (current / total) * 100 : 0;
  const safePct = Math.min(100, Math.max(0, pct));

  return (
    <div className="progress-bar-container" style={{ height: `${height}px` }}>
      <div
        className={`progress-bar-fill progress-${color}`}
        style={{ width: `${safePct}%` }}
      />
    </div>
  );
};

export default ProgressBar;
