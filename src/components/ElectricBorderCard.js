import React from 'react';

const ElectricBorderCard = ({ children, className = '', enabled = true }) => {
  const finalClassName = `electric-border-card ${!enabled ? 'disabled' : ''} ${className}`;
  
  return (
    <div className={finalClassName}>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default ElectricBorderCard;