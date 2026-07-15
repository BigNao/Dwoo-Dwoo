import React from 'react';

export default function QuickActionCard({ icon: Icon, label, description, onClick, className = '', accent = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-4 sm:p-5 shadow-sm transition-all text-left group ${accent
        ? 'bg-accent text-ink border-accent hover:bg-accent-dark hover:shadow-md'
        : 'bg-card dark:bg-asphalt-light border-border dark:border-white/10 hover:border-primary dark:hover:border-white/40 hover:shadow-md' } ${className}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`p-3 rounded-lg transition-colors shrink-0 ${accent ? 'bg-ink/10 group-hover:bg-ink/20' : 'bg-primary/10 dark:bg-white/10 group-hover:bg-primary/20 dark:group-hover:bg-white/20'}`}>
          <Icon className={`w-5 h-5 ${accent ? 'text-ink' : 'text-primary dark:text-white'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium mb-1 truncate">{label}</p>
          <p className={`text-sm line-clamp-2 ${accent ? 'text-ink/70' : 'text-muted dark:text-white/60'}`}>{description}</p>
        </div>
      </div>
    </button>
  );
}
