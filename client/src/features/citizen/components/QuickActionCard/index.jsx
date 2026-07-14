import React from 'react';

export default function QuickActionCard({ icon: Icon, label, description, onClick, className = '', accent = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-4 sm:p-5 shadow-sm transition-all text-left group ${accent
        ? 'bg-primary text-white border-primary hover:border-primary-hover hover:shadow-md'
        : 'bg-card border-border hover:border-primary hover:shadow-md' } ${className}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`p-3 rounded-lg transition-colors shrink-0 ${accent ? 'bg-white/20 group-hover:bg-white/30' : 'bg-primary/10 group-hover:bg-primary/20'}`}>
          <Icon className={`w-5 h-5 ${accent ? 'text-white' : 'text-primary'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium mb-1 truncate">{label}</p>
          <p className="text-sm text-muted line-clamp-2">{description}</p>
        </div>
      </div>
    </button>
  );
}
