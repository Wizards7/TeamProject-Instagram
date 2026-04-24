"use client";

import { useState, useEffect } from 'react';

export interface INotification {
  id: string;
  type: 'like' | 'comment' | 'follow';
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
  const newNotif: INotification = {
    ...notif,
    id: Date.now().toString(),
    date: 'Just now',
    isRead: false,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newNotif, ...current]));
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
