import React from 'react';
import CitizenDashboardLayout from '../layouts/CitizenDashboardLayout';
import NotificationCard from '../components/NotificationCard';
import EmptyState from '../components/EmptyState';
import { useCitizenNotifications } from '../hooks/useCitizenNotifications';

export default function Notifications() {
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useCitizenNotifications();

  const groupedNotifications = {
    today: notifications.filter((n) => {
      const diff = Date.now() - n.timestamp.getTime();
      return diff < 86400000;
    }),
    yesterday: notifications.filter((n) => {
      const diff = Date.now() - n.timestamp.getTime();
      return diff >= 86400000 && diff < 172800000;
    }),
    older: notifications.filter((n) => {
      const diff = Date.now() - n.timestamp.getTime();
      return diff >= 172800000;
    }),
  };

  return (
    <CitizenDashboardLayout title="Notifications">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Notifications</h2>
            <p className="text-muted">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary hover:underline shrink-0"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 && (
          <EmptyState
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            )}
            title="No notifications"
            description="You're all caught up! Check back later for updates."
          />
        )}

        {notifications.length > 0 && (
          <div className="space-y-6">
            {groupedNotifications.today.length > 0 && (
              <div>
                <h3 className="font-medium mb-3 text-sm text-muted uppercase tracking-wide">Today</h3>
                <div className="space-y-3">
                  {groupedNotifications.today.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedNotifications.yesterday.length > 0 && (
              <div>
                <h3 className="font-medium mb-3 text-sm text-muted uppercase tracking-wide">Yesterday</h3>
                <div className="space-y-3">
                  {groupedNotifications.yesterday.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedNotifications.older.length > 0 && (
              <div>
                <h3 className="font-medium mb-3 text-sm text-muted uppercase tracking-wide">Older</h3>
                <div className="space-y-3">
                  {groupedNotifications.older.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CitizenDashboardLayout>
  );
}
