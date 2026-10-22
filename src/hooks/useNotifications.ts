"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";

export interface NotificationSender {
  _id: string;
  username?: string;
  name?: string;
  avatar?: string;
}

export interface NotificationData {
  _id: string;
  type: "info" | "action";
  text: string;
  highlightText?: string;
  actionType?: "payment";
  actionStatus?: "pending" | "paid" | "skipped";
  isRead: boolean;
  createdAt: string;
  sender?: NotificationSender | null;
}

export function useNotifications(limit = 10, pollMs = 30000) {
  const [items, setItems] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined" || !localStorage.getItem("accessToken")) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/notifications", { params: { limit } });
      const data = res.data?.data ?? res.data;
      setItems(data?.notifications ?? []);
      setUnreadCount(data?.unreadCount ?? 0);
      setTotal(data?.total ?? 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    const first = setTimeout(refresh, 0);
    const timer = setInterval(refresh, pollMs);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [refresh, pollMs]);

  const markRead = useCallback(
    (id: string) => {
      const target = items.find((n) => n._id === id);
      if (!target || target.isRead) return;

      setItems((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      api.patch(`/notifications/${id}/read`).catch(refresh);
    },
    [items, refresh],
  );

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    api.patch("/notifications/read-all").catch(refresh);
  }, [refresh]);

  const remove = useCallback(
    (id: string) => {
      const target = items.find((n) => n._id === id);
      if (!target) return;

      setItems((prev) => prev.filter((n) => n._id !== id));
      setTotal((t) => Math.max(0, t - 1));
      if (!target.isRead) setUnreadCount((c) => Math.max(0, c - 1));

      api.delete(`/notifications/${id}`).then(refresh).catch(refresh);
    },
    [items, refresh],
  );

  const performAction = useCallback(
    async (id: string, action: "pay" | "skip") => {
      try {
        await api.patch(`/notifications/${id}/action`, { action });
      } catch (error) {
        console.error("Error performing notification action:", error);
      }
      await refresh();
    },
    [refresh],
  );

  return {
    items,
    unreadCount,
    total,
    loading,
    refresh,
    markRead,
    markAllRead,
    performAction,
    remove,
  };
}
