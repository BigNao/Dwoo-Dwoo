import React from 'react';

export default function DashboardCard({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-card rounded-lg border border-border shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
