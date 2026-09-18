"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/services/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardHeader() {
  const [userName, setUserName] = useState<string>("User");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        const userData = response.data?.user || response.data;

        if (userData && userData.username) {
          setUserName(userData.username);
        } else if (userData && userData.name) {
          setUserName(userData.name);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <header className="bg-header-bg text-white flex justify-between items-center px-4 sm:px-8 lg:px-12 py-3.5 w-full sticky top-0 z-30 shadow-sm">
      {/* Left: Logo */}
      <Link
        href="/dashboard"
        className="text-primary text-2xl sm:text-3xl font-bold tracking-wide shrink-0"
      >
        CarWise
      </Link>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-8 lg:gap-10 text-[15px] font-medium text-white/90">
        <Link href="/about" className="hover:text-primary transition-colors">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-primary transition-colors">
          Contact Us
        </Link>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
        {/* Get The App Button */}
        <button className="hidden sm:inline-flex bg-primary hover:opacity-90 transition-opacity text-white px-5 lg:px-6 py-2 rounded-lg font-semibold text-[13px] lg:text-[14px] shadow-sm whitespace-nowrap">
          Get The App
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-surface-subtle border border-border-main shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                userName,
              )}&background=f5924a&color=fff&bold=true`}
              alt="User Avatar"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="hidden sm:inline text-[14px] sm:text-[15px] font-medium tracking-wide text-white truncate max-w-[120px] md:max-w-none">
            {isLoading ? "..." : `Hii, ${userName}`}
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center p-1">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="fill-primary"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" />
          </svg>
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-header-bg"></span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
