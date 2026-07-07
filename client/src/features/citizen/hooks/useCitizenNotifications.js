import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { citizenService } from '../services/citizenService';

export function useCitizenNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = citizenService.getNotifications(currentUser.uid, (data) => {
      setNotifications(data);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (notificationId) => {
    try {
      await citizenService.markNotificationRead(notificationId);
      setNotifications(notifications.map((n) => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      setError(err);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return { notifications, unreadCount, loading, error, markAsRead, markAllAsRead };
}
