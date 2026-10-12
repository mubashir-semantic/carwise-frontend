"use client";

import React, { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useMyAvatar } from "@/hooks/useMyAvatar";
  import NotificationItem from "./components/NotificationItem";
const PAGE_SIZE = 20;

export default function NotificationsPage() {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const myAvatar = useMyAvatar();

  const {
    items,
    unreadCount,
    total,
    loading,
    markRead,
    markAllRead,
    performAction,
    remove,
  } = useNotifications(limit);

  const visibleItems =
    tab === "unread" ? items.filter((n) => !n.isRead) : items;
  const hasMore = items.length < total;

  return (
    <div className="p-6 sm:p-8 max-w-3xl w-full mx-auto">
      {/* Title row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-heading">
            Notifications
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-[13px] font-semibold text-primary hover:opacity-80 transition-opacity cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-subtle mb-4 text-[14px] font-medium">
        {(["all", "unread"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`pb-2 capitalize transition-colors cursor-pointer ${
              tab === t
                ? "text-text-main border-b-2 border-primary"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-surface rounded-[20px] border border-border-main overflow-hidden divide-y divide-border-subtle">
        {loading ? (
          <p className="px-6 py-12 text-center text-sm text-text-muted">
            Loading...
          </p>
        ) : visibleItems.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-text-muted">
            {tab === "unread"
              ? "No unread notifications."
              : "No notifications yet."}
          </p>
        ) : (
          visibleItems.map((item) => (
            <NotificationItem
              key={item._id}
              item={item}
              selfAvatar={myAvatar}
              onRead={markRead}
              onAction={performAction}
              onDelete={remove}
            />
          ))
        )}
      </div>

      {/* Load more */}
      {hasMore && !loading && (
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="px-6 py-2 rounded-lg border border-border-main bg-surface text-[13px] font-semibold text-text-main hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
