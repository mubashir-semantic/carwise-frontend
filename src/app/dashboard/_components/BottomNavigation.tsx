"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-transform ${
            active ? "text-white scale-105" : "text-text-main"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-9.5z" />
        </svg>
      ),
    },
    {
      label: "Inbox",
      href: "/dashboard/inbox",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-transform ${
            active ? "text-white scale-105" : "text-text-main"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <circle cx="8.5" cy="12" r="0.75" fill="currentColor" />
          <circle cx="12" cy="12" r="0.75" fill="currentColor" />
          <circle cx="15.5" cy="12" r="0.75" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-transform ${
            active ? "text-white scale-105" : "text-text-main"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5v1H5.5v-1z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md py-3 px-8 flex justify-around items-center lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-border-subtle">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-center p-1"
          >
            {isActive ? (
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/30 transition-transform active:scale-95">
                {item.icon(true)}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-subtle transition-colors">
                {item.icon(false)}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
