"use client";

import React from "react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: "action" | "comment";
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  highlightText?: string;
  time: string;
  isUnread?: boolean;
}

export default function NotificationModal() {
  const notifications: NotificationItem[] = [
    {
      id: "1",
      type: "action",
      user: {
        name: "Ray Arnold",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      },
      text: "asked for payment. Would you like to pay to him now or skip?",
      time: "Yesterday at 11:42 PM",
      isUnread: true,
    },
    {
      id: "2",
      type: "comment",
      user: {
        name: "Ray Arnold",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      },
      text: "left 6 comments on",
      highlightText: "Isla Nublar SOC2 compliance report",
      time: "Yesterday at 11:42 PM",
      isUnread: true,
    },
    {
      id: "3",
      type: "comment",
      user: {
        name: "Ray Arnold",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      },
      text: "left 6 comments on",
      highlightText: "Isla Nublar SOC2 compliance report",
      time: "Yesterday at 11:42 PM",
      isUnread: true,
    },
    {
      id: "4",
      type: "comment",
      user: {
        name: "Ray Arnold",
        avatar:
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
      },
      text: "left 6 comments on",
      highlightText: "Isla Nublar SOC2 compliance report",
      time: "Yesterday at 11:42 PM",
      isUnread: true,
    },
  ];

  return (
    <div className="w-[450px] max-w-[92vw] bg-surface rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-border-main overflow-hidden font-sans flex flex-col text-left transition-colors duration-200">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border-subtle">
        <h2 className="text-[19px] font-bold text-text-heading tracking-tight">
          Notification
        </h2>
      </div>

      {/* Notifications List */}
      <div className="max-h-[480px] overflow-y-auto divide-y divide-border-subtle scrollbar-thin">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 px-5 py-4 transition-colors ${
              item.type === "action"
                ? "bg-primary-tint/40 dark:bg-surface-subtle"
                : "bg-surface hover:bg-surface-subtle"
            }`}
          >
            {/* Cyan Unread Dot */}
            <div className="pt-2.5 shrink-0">
              <span
                className={`block w-[7px] h-[7px] rounded-full ${
                  item.isUnread ? "bg-[#52BFE8]" : "bg-transparent"
                }`}
              />
            </div>

            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-subtle border border-border-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.user.avatar}
                alt={item.user.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div className="flex-1 text-[13.5px] leading-[1.45] text-text-secondary">
              <p>
                <span className="font-bold text-text-heading">
                  {item.user.name}
                </span>{" "}
                {item.text}{" "}
                {item.highlightText && (
                  <span className="font-bold text-text-heading">
                    {item.highlightText}
                  </span>
                )}
              </p>

              {/* Action Buttons */}
              {item.type === "action" && (
                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    className="px-7 py-2 bg-primary hover:opacity-90 text-white text-[13px] font-semibold rounded-lg shadow-xs transition-opacity active:scale-95 cursor-pointer"
                  >
                    Pay
                  </button>
                  <button
                    type="button"
                    className="px-7 py-2 bg-secondary hover:opacity-90 text-white text-[13px] font-semibold rounded-lg shadow-xs transition-opacity active:scale-95 cursor-pointer"
                  >
                    Skip
                  </button>
                </div>
              )}

              {/* Timestamp */}
              <span className="block text-[11.5px] text-text-muted font-normal mt-2">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border-subtle bg-surface py-3.5 text-center">
        <Link
          href="/dashboard/notifications"
          className="text-[13px] font-medium text-text-secondary hover:text-text-heading transition-colors inline-block w-full"
        >
          See all
        </Link>
      </div>
    </div>
  );
}
