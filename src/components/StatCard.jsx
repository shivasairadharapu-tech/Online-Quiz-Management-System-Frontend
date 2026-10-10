import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-card-inner">
        <div>
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">{value}</h3>
          {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="stat-icon-wrapper">
            <Icon size={26} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
