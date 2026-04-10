/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export type NotificationType = "registration" | "company" | "booking" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  link?: string | null;
  time: string; // ISO string
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refresh: () => void;
  /** Latest SSE event channel + data (components can react to any channel) */
  lastEvent: { channel: string; data: any } | null;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  loading: true,
  markAsRead: () => {},
  markAllAsRead: () => {},
  refresh: () => {},
  lastEvent: null,
});

export const useNotifications = () => useContext(NotificationContext);

/** Request browser notification permission and show a desktop notification */
function showDesktopNotification(title: string, body: string, link?: string | null) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    const n = new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag: `notif-${Date.now()}`,
    });
    if (link) {
      n.onclick = () => { window.focus(); window.location.href = link; };
    }
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastEvent, setLastEvent] = useState<{ channel: string; data: any } | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.data) setNotifications(json.data);
    } catch {
      // silently fail
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial fetch + request desktop notification permission
  useEffect(() => {
    fetchNotifications();
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [fetchNotifications]);

  // SSE connection
  useEffect(() => {
    const es = new EventSource("/api/sse?channels=notifications,companies");
    eventSourceRef.current = es;

    es.addEventListener("notifications", (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        setLastEvent({ channel: "notifications", data: payload });

        if (payload.event === "new_notification") {
          setNotifications((prev) => [payload.data, ...prev]);
          // Desktop push
          showDesktopNotification(payload.data.title, payload.data.description, payload.data.link);
        } else if (payload.event === "all_read") {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }
      } catch {}
    });

    es.addEventListener("companies", (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        setLastEvent({ channel: "companies", data: payload });
      } catch {}
    });

    es.onerror = () => {
      // Browser will auto-reconnect SSE
    };

    return () => { es.close(); };
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    } catch {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications", { method: "PATCH" });
    } catch {}
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refresh: () => fetchNotifications(true),
        lastEvent,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
