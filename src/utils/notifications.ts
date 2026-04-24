import { useState, useEffect } from 'react';

export interface INotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'follow_request';
  userId: string;
  userName: string;
  userImage: string | null;
  postId?: number;
  postImage?: string | null;
  content?: string;
  date: string;
  isRead: boolean;
}

const STORAGE_KEY = 'insta_notifications';

export const getNotifications = (): INotification[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addNotification = (notif: Omit<INotification, 'id' | 'date' | 'isRead'>) => {
  if (typeof window === 'undefined') return;
  const current = getNotifications();
  
  // Prevent duplicate notifications of same type from same user within short time
  const isDuplicate = current.some(n => 
    n.type === notif.type && 
    n.userId === notif.userId && 
    (notif.postId ? n.postId === notif.postId : true) &&
    !n.isRead
  );
  
  if (isDuplicate && notif.type !== 'comment') return;

  const newNotif: INotification = {
    ...notif,
    id: Date.now().toString(),
    date: 'Just now',
    isRead: false,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newNotif, ...current]));
  window.dispatchEvent(new Event('notifications_updated'));
};

export const deleteNotification = (id: string) => {
    if (typeof window === 'undefined') return;
    const current = getNotifications();
    const updated = current.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('notifications_updated'));
};

export const markAllAsRead = () => {
  if (typeof window === 'undefined') return;
  const current = getNotifications();
  const updated = current.map(n => ({ ...n, isRead: true }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notifications_updated'));
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    const update = () => setNotifications(getNotifications());
    update();
    window.addEventListener('notifications_updated', update);
    return () => window.removeEventListener('notifications_updated', update);
  }, []);

  return notifications;
};
