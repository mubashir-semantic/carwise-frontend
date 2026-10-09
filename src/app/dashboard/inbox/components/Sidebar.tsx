"use client";

import { useState } from "react";
import Image from "next/image";
import { UserContact } from "@/hooks/useChat";

interface SidebarProps {
  contacts: UserContact[];
  activeContact: UserContact | null;
  setActiveContact: (contact: UserContact) => void;
  onlineUsers: string[];
}

export const getDisplayName = (user: UserContact) => {
  const rawName =
    user.username || user.name || user.email?.split("@")[0] || "User";
  return rawName
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getAvatar = (name: string) => {
  const AVATAR_COLORS = [
    "F5924A",
    "6A4BFC",
    "10B981",
    "EF4444",
    "0D8ABC",
    "E83E8C",
    "20C997",
    "F5A623",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const bgColor = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&bold=true`;
};

export default function Sidebar({
  contacts,
  activeContact,
  setActiveContact,
  onlineUsers,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "name">("recent");

  const filteredContacts = contacts
    .filter((contact) =>
      activeTab === "unread" ? (contact.unread || 0) > 0 : true,
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return (
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
        );
      }
      return getDisplayName(a).localeCompare(getDisplayName(b));
    });

  return (
    <div className="w-[320px] border-r border-border-main flex flex-col shrink-0 bg-surface">
      <div className="flex items-center justify-between px-6 h-[72px] border-b border-border-subtle shrink-0 relative">
        <div className="flex space-x-6 text-[14px] font-medium">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-1 transition-colors ${activeTab === "all" ? "text-text-main border-b-2 border-primary translate-y-[1px]" : "text-text-muted hover:text-text-main"}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`pb-1 transition-colors ${activeTab === "unread" ? "text-text-main border-b-2 border-primary translate-y-[1px]" : "text-text-muted hover:text-text-main"}`}
          >
            Unread
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="text-text-secondary text-[12px] flex items-center hover:text-text-main bg-surface-subtle px-2.5 py-1.5 rounded-lg border border-border-subtle"
          >
            Filter <span className="ml-1 text-[10px]">▼</span>
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-surface border border-border-subtle shadow-md rounded-xl p-1.5 w-36 z-30">
              <button
                onClick={() => {
                  setSortBy("recent");
                  setShowFilterDropdown(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${sortBy === "recent" ? "bg-primary-tint text-primary font-semibold" : "text-text-main hover:bg-surface-subtle"}`}
              >
                Sort by Recent
              </button>
              <button
                onClick={() => {
                  setSortBy("name");
                  setShowFilterDropdown(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${sortBy === "name" ? "bg-primary-tint text-primary font-semibold" : "text-text-main hover:bg-surface-subtle"}`}
              >
                Sort by Name
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <p className="p-6 text-center text-text-muted text-sm">
            No contacts found.
          </p>
        ) : (
          filteredContacts.map((contact) => {
            const isActive = activeContact?._id === contact._id;
            const displayName = getDisplayName(contact);

            // MAGIC FIX: React "0" print issue fixed here
            const isUnread = (contact.unread || 0) > 0;

            const isOnline = onlineUsers.includes(contact._id);

            let avatarSrc = contact.avatar;
            if (!avatarSrc || avatarSrc.includes("ui-avatars.com")) {
              avatarSrc = getAvatar(displayName);
            }

            return (
              <div
                key={contact._id}
                onClick={() => setActiveContact(contact)}
                className={`flex items-start p-4 cursor-pointer transition-colors border-l-[3px] ${isActive ? "bg-primary-tint border-primary" : "bg-surface border-transparent hover:bg-surface-subtle"}`}
              >
                <div className="relative shrink-0 mr-3">
                  <Image
                    src={avatarSrc}
                    alt={displayName}
                    width={42}
                    height={42}
                    unoptimized
                    className="rounded-full object-cover shadow-sm h-[42px] w-[42px]"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-success border-2 border-surface rounded-full"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4
                      className={`text-[13px] truncate ${
                        isActive
                          ? "font-bold text-secondary"
                          : isUnread
                            ? "font-bold text-text-main"
                            : "font-semibold text-text-main"
                      }`}
                    >
                      {displayName}
                    </h4>
                    {contact.lastMessageTime && (
                      <span
                        className={`text-[10px] ml-2 shrink-0 ${
                          isActive
                            ? "text-primary font-bold"
                            : isUnread
                              ? "text-primary font-semibold"
                              : "text-text-muted"
                        }`}
                      >
                        {new Date(contact.lastMessageTime).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p
                      className={`text-[12px] truncate mr-2 ${
                        isActive
                          ? "text-secondary font-medium"
                          : isUnread
                            ? "text-text-main font-medium"
                            : "text-text-secondary"
                      }`}
                    >
                      {contact.lastMessage || contact.email}
                    </p>
                    {isUnread && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mr-1"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
