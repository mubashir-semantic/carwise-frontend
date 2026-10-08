"use client";

import React, { useState } from "react";

interface NotificationItem {
  id: string;
  sender: string;
  actionText: string;
  targetText: string;
  time: string;
  isUnread: boolean;
  avatar: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    sender: "Ray Arnold",
    actionText: "left 6 comments on",
    targetText: "Isla Nublar SOC2 compliance report",
    time: "Yesterday at 11:42 PM",
    isUnread: true,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    sender: "Ray Arnold",
    actionText: "left 6 comments on",
    targetText: "Isla Nublar SOC2 compliance report",
    time: "Yesterday at 11:42 PM",
    isUnread: true,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    sender: "Ray Arnold",
    actionText: "left 6 comments on",
    targetText: "Isla Nublar SOC2 compliance report",
    time: "Yesterday at 11:42 PM",
    isUnread: true,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    sender: "Ray Arnold",
    actionText: "left 6 comments on",
    targetText: "Isla Nublar SOC2 compliance report",
    time: "Yesterday at 11:42 PM",
    isUnread: true,
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    sender: "Ray Arnold",
    actionText: "left 6 comments on",
    targetText: "Isla Nublar SOC2 compliance report",
    time: "Yesterday at 11:42 PM",
    isUnread: true,
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    sender: "Ray Arnold",
    actionText: "left 6 comments on",
    targetText: "Isla Nublar SOC2 compliance report",
    time: "Yesterday at 11:42 PM",
    isUnread: true,
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
  },
];

export default function NotificationPage() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isUnread: false })),
    );
  };

  return (
    <div className="w-full bg-surface min-h-[85vh] px-6 sm:px-10 py-8 text-text-main transition-colors duration-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
        <h1 className="text-xl sm:text-2xl font-bold text-text-heading tracking-tight">
          Notification
        </h1>

        <button
          type="button"
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-text-secondary hover:text-text-heading transition-colors cursor-pointer"
        >
          <span>Mark all as read</span>
          <svg
            className="w-4 h-4 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-border-subtle">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-4 sm:py-5 hover:bg-surface-subtle transition-colors px-2 rounded-lg"
          >
            {/* Left Content Area */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Blue Dot */}
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  item.isUnread ? "bg-[#52BFE8]" : "bg-transparent"
                }`}
              />

              {/* User Avatar */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-surface-subtle shrink-0 border border-border-subtle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.avatar}
                  alt={item.sender}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Description */}
              <p className="text-[13px] sm:text-[14px] text-text-secondary leading-relaxed">
                <span className="font-semibold text-text-heading">
                  {item.sender}
                </span>{" "}
                {item.actionText}{" "}
                <span className="font-bold text-text-heading">
                  {item.targetText}
                </span>
              </p>
            </div>

            {/* Right Timestamp */}
            <span className="text-[11px] sm:text-xs text-text-muted shrink-0 ml-4 font-normal">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
