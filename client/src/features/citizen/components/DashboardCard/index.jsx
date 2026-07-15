import React from 'react';

export default function DashboardCard({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
