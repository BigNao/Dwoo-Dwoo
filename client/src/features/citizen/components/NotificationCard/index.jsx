import React from 'react';

export default function NotificationCard({ notification, onRead, className = '' }) {
  const formatDate = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div
      className={`bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-4 shadow-sm hover:border-border dark:hover:border-white/20 transition-all ${!notification.read ? 'border-l-4 border-l-primary dark:border-l-accent' : ''} ${className}`}
      onClick={() => !notification.read && onRead?.(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-primary dark:bg-accent' : 'bg-muted dark:bg-white/30'}`} />
        <div className="flex-1">
          <p className="font-medium text-sm mb-1 text-ink dark:text-white">{notification.title}</p>
          <p className="text-sm text-muted dark:text-white/60 mb-2">{notification.message}</p>
          <p className="text-xs text-muted/60 dark:text-white/40">{formatDate(notification.timestamp)}</p>
        </div>
      </div>
    </div>
  );
}
