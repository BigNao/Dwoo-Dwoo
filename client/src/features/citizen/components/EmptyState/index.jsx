import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="p-4 bg-muted/20 rounded-full mb-4">
          <Icon className="w-8 h-8 text-muted" />
        </div>
      )}
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-sm mb-4">{description}</p>
      {action && action}
    </div>
  );
}
