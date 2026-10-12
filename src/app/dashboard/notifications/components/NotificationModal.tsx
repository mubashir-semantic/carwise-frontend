"use client";

import React from "react";
import Link from "next/link";
import type { NotificationData } from "@/hooks/useNotifications";
import NotificationItem from "./NotificationItem";

interface NotificationModalProps {
  items: NotificationData[];
  unreadCount: number;
  loading: boolean;
  selfAvatar?: string;
  onRead: (id: string) => void;
  onReadAll: () => void;
  onAction: (id: string, action: "pay" | "skip") => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function NotificationModal({
  items,
  unreadCount,
  loading,
  selfAvatar,
  onRead,
  onReadAll,
  onAction,
  onDelete,
  onClose,
}: NotificationModalProps) {
  return (
    <div className="w-[450px] max-w-[92vw] bg-surface rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-border-main overflow-hidden font-sans flex flex-col text-left transition-colors duration-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-[19px] font-bold text-text-heading tracking-tight">
          Notification
        </h2>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onReadAll}
            className="text-[12.5px] font-medium text-primary hover:opacity-80 transition-opacity cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[480px] overflow-y-auto divide-y divide-border-subtle scrollbar-thin">
        {loading ? (
          <p className="px-6 py-10 text-center text-[13px] text-text-muted">
            Loading...
          </p>
        ) : items.length === 0 ? (
          <p className="px-6 py-10 text-center text-[13px] text-text-muted">
            No notifications yet.
          </p>
        ) : (
          items.map((item) => (
            <NotificationItem
              key={item._id}
              item={item}
              selfAvatar={selfAvatar}
              onRead={onRead}
              onAction={onAction}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border-subtle bg-surface py-3.5 text-center">
        <Link
          href="/dashboard/notifications"
          onClick={onClose}
          className="text-[13px] font-medium text-text-secondary hover:text-text-heading transition-colors inline-block w-full"
        >
          See all
        </Link>
      </div>
    </div>
  );
}
