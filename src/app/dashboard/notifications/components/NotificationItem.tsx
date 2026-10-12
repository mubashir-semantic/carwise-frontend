"use client";

import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import type { NotificationData } from "@/hooks/useNotifications";

export function formatNotificationTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);

  if (diffDays === 0) return `Today at ${time}`;
  if (diffDays === 1) return `Yesterday at ${time}`;
  const day = date.toLocaleDateString([], { day: "numeric", month: "short" });
  return `${day} at ${time}`;
}

const capitalizeWords = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const initialsAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=f5924a&color=fff&bold=true`;

interface NotificationItemProps {
  item: NotificationData;
  onRead: (id: string) => void;
  onAction: (id: string, action: "pay" | "skip") => void;
  onDelete: (id: string) => void;
  // Jin notifications ka sender nahi hota (vehicle, expense...) unme apna avatar
  selfAvatar?: string;
}

export default function NotificationItem({
  item,
  onRead,
  onAction,
  onDelete,
  selfAvatar,
}: NotificationItemProps) {
  const senderName = item.sender
    ? capitalizeWords(item.sender.username || item.sender.name || "User")
    : "";

  const avatar = item.sender
    ? item.sender.avatar || initialsAvatar(senderName)
    : selfAvatar || initialsAvatar("CarWise");

  const isPendingAction =
    item.type === "action" &&
    item.actionType === "payment" &&
    item.actionStatus === "pending";

  return (
    <div
      onClick={() => onRead(item._id)}
      className={`group flex items-start gap-3 px-5 py-4 transition-colors cursor-pointer ${
        item.type === "action" && item.actionStatus === "pending"
          ? "bg-primary-tint/40 dark:bg-surface-subtle"
          : "bg-surface hover:bg-surface-subtle"
      }`}
    >
      {/* Unread Dot */}
      <div className="pt-2.5 shrink-0">
        <span
          className={`block w-[7px] h-[7px] rounded-full ${
            item.isRead ? "bg-transparent" : "bg-info"
          }`}
        />
      </div>

      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-subtle border border-border-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt={senderName || "Me"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-[13.5px] leading-[1.45] text-text-secondary">
        <p>
          {senderName && (
            <>
              <span className="font-bold text-text-heading">{senderName}</span>{" "}
            </>
          )}
          {item.text}{" "}
          {item.highlightText && (
            <span className="font-bold text-text-heading">
              {item.highlightText}
            </span>
          )}
        </p>

        {isPendingAction && (
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAction(item._id, "pay");
              }}
              className="px-7 py-2 bg-primary hover:opacity-90 text-white text-[13px] font-semibold rounded-lg shadow-xs transition-opacity active:scale-95 cursor-pointer"
            >
              Pay
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAction(item._id, "skip");
              }}
              className="px-7 py-2 bg-secondary hover:opacity-90 text-white text-[13px] font-semibold rounded-lg shadow-xs transition-opacity active:scale-95 cursor-pointer"
            >
              Skip
            </button>
          </div>
        )}

        {item.type === "action" && item.actionStatus === "paid" && (
          <span className="block mt-2 text-[12px] font-semibold text-success">
            Paid
          </span>
        )}
        {item.type === "action" && item.actionStatus === "skipped" && (
          <span className="block mt-2 text-[12px] font-semibold text-text-muted">
            Skipped
          </span>
        )}

        <span className="block text-[11.5px] text-text-muted font-normal mt-2">
          {formatNotificationTime(item.createdAt)}
        </span>
      </div>

      {/* Delete: sirf hover par dikhta hai (phone par hamesha, kyunke wahan hover nahi hota) */}
      <button
        type="button"
        aria-label="Delete notification"
        title="Delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item._id);
        }}
        className="shrink-0 self-start mt-1 p-2 rounded-lg text-text-muted hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 transition-all cursor-pointer"
      >
        <FaTrashAlt size={14} />
      </button>
    </div>
  );
}
