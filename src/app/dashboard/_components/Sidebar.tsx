"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FiGrid,
  FiClock,
  FiTool,
  FiMessageSquare,
  FiSettings,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", icon: FiGrid, path: "/dashboard" },
  { name: "Expense history", icon: FiClock, path: "/dashboard/expense" },
  { name: "Service history", icon: FiTool, path: "/dashboard/service-history" },
  { name: "Inbox", icon: FiMessageSquare, path: "/dashboard/inbox" },
  { name: "Setting", icon: FiSettings, path: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    // 1. "justify-between" hata diya hai yahan se
    <aside className="sticky top-0 w-64 bg-sidebarBg h-screen flex flex-col py-6 px-4 border-r border-gray-100 overflow-y-auto">
      {" "}
      {/* 2. Menu ko 'flex-1' div mein daal diya taake yeh poori empty space cover kar le */}
      <div className="flex-1 mt-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-darkPurple text-white shadow-md"
                    : "text-black hover:bg-lightBg hover:text-darkPurple"
                }`}
              >
                <item.icon
                  size={20}
                  className={isActive ? "text-white" : "text-black"}
                />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      {/* 3. mt-10 ki jagah 'mt-auto' lagaya hai taake yeh bottom par chala jaye */}
      <div className="bg-lightOrange p-5 rounded-2xl flex flex-col items-center text-center mt-auto border border-brandOrange/20">
        <div className="relative w-full h-24 mb-3 flex justify-center">
          <Image
            src="/Group 20373.png"
            alt="Upgrade to Premium"
            width={130}
            height={90}
            className="object-contain"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>
        <h4 className="text-sm font-bold text-darkPurple mb-1">
          Update to premium
        </h4>
        <p className="text-xs text-gray-500 mb-4">and get 40% discount</p>
        <button className="w-full bg-brandOrange hover:bg-darkPurple text-white text-xs font-semibold py-2.5 rounded-lg transition-colors">
          Book Service
        </button>
      </div>
    </aside>
  );
}
