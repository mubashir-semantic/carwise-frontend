"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/services/api";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationModal from "./NotificationModal";

const capitalizeWords = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function DashboardHeader() {
  const [userName, setUserName] = useState<string>("User");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fetch function (Bina synchronous setIsLoading ke)
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await api.get("/users/profile");
      const userData = response.data?.user || response.data;

      if (userData) {
        const rawName = userData.username || userData.name || "User";
        const formattedName = capitalizeWords(rawName);
        setUserName(formattedName);

        if (userData.avatar) {
          setUserAvatar(userData.avatar);
        } else {
          setUserAvatar(
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              formattedName,
            )}&background=f5924a&color=fff&bold=true`,
          );
        }
      }
    } catch (error) {
      console.error("Error fetching user profile in header:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserProfile();

    const handleProfileUpdate = () => {
      fetchUserProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [fetchUserProfile]);

  // Dropdown ke bahar click hone par modal close karne ke liye
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <button className="hidden sm:inline-flex bg-primary hover:opacity-90 transition-opacity text-white px-5 lg:px-6 py-2 rounded-lg font-semibold text-[13px] lg:text-[14px] shadow-sm whitespace-nowrap">
          Get The App
        </button>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group transition-opacity hover:opacity-90"
          title="Go to Settings"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-surface-subtle border border-border-main shrink-0 transition-transform group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                userAvatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userName,
                )}&background=f5924a&color=fff&bold=true`
              }
              alt={userName}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="hidden sm:inline text-[14px] sm:text-[15px] font-medium tracking-wide text-white group-hover:text-primary transition-colors truncate max-w-[140px] md:max-w-none">
            {isLoading ? "..." : `${userName}`}
          </span>
        </Link>

        {/* Notification Bell Dropdown Container */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center p-1 focus:outline-none"
            aria-label="Open notifications"
          >
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
          </button>

          {showNotifications && (
            <div className="absolute right-0 sm:-right-4 top-full mt-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <NotificationModal />
            </div>
          )}
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
