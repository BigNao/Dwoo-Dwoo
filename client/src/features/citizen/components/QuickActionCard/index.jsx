import React from 'react';

export default function QuickActionCard({ icon: Icon, label, description, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`bg-card rounded-lg border border-border p-4 sm:p-5 shadow-sm hover:border-primary hover:shadow-md transition-all text-left group ${className}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium mb-1 truncate">{label}</p>
          <p className="text-sm text-muted line-clamp-2">{description}</p>
        </div>
      </div>
    </button>
  );
}
