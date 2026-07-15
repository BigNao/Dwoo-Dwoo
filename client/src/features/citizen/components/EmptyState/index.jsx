import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="p-4 bg-muted/20 dark:bg-white/10 rounded-full mb-4">
          <Icon className="w-8 h-8 text-muted dark:text-white/40" />
        </div>
      )}
      <h3 className="font-semibold text-lg text-ink dark:text-white mb-2">{title}</h3>
      <p className="text-muted dark:text-white/60 text-sm max-w-sm mb-4">{description}</p>
      {action && action}
    </div>
  );
}
