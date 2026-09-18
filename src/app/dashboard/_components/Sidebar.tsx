"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FiGrid,
  FiTrendingUp,
  FiFileText,
  FiInbox,
  FiSettings,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", icon: FiGrid, path: "/dashboard" },
  { name: "Expense history", icon: FiTrendingUp, path: "/dashboard/expense" },
  {
    name: "Service history",
    icon: FiFileText,
    path: "/dashboard/service-history",
  },
  { name: "Inbox", icon: FiInbox, path: "/dashboard/inbox" },
  { name: "Setting", icon: FiSettings, path: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 flex flex-col py-12 px-4 shrink-0 min-h-[calc(100vh-70px)] justify-between space-between bg-surface-subtle border-r border-border-main">
      {/* Navigation Links */}
      <nav className="space-y-1.5 w-full">
        {menuItems.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-sm ${
                isActive
                  ? "bg-secondary text-white shadow-sm"
                  : "text-text-main hover:bg-surface-subtle hover:text-text-heading"
              }`}
            >
              <item.icon
                size={19}
                className={isActive ? "text-white" : "text-text-main"}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Promo Card */}
      <div className="bg-primary-tint rounded-2xl p-5 flex flex-col items-center text-center mt-8 border border-primary/20 shadow-xs">
        <div className="relative w-full h-24 mb-2 flex justify-center">
          <Image
            src="/Group 20373.png"
            alt="Upgrade to Premium"
            width={120}
            height={85}
            className="object-contain"
            priority
          />
        </div>
        <h4 className="text-[14px] font-bold text-text-heading mb-1">
          Update to premium
        </h4>
        <p className="text-[12px] text-text-secondary mb-4">
          and get 40% discount
        </p>
        <button className="w-full bg-primary hover:opacity-90 text-white text-[12px] font-semibold py-2.5 rounded-lg transition-opacity shadow-sm">
          Book Service
        </button>
      </div>
    </div>
  );
}
