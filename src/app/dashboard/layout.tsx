"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import Header from "../../components/layout/Header";
import BottomNavigation from "./_components/BottomNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login");
    } else {
      // Async defer taake ESLint cascading render warning na de
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 0);
    }
  }, [router]);

  // Jab tak token verify nahi hota, pura dashboard block rahega
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-app-bg text-text-main">
      {/* Top Header */}
      <Header />

      {/* Body Area */}
      <div className="flex flex-1 items-start w-full">
        {/* Left Sidebar: Sticky on desktop, hidden on mobile */}
        <aside className="hidden lg:block shrink-0 sticky top-0 self-start">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile/Tablet Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
