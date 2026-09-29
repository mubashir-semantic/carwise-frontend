"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaChartLine,
} from "react-icons/fa";
import api from "@/services/api";
import ThemeToggle from "@/components/theme/ThemeToggle";
import NotificationModal from "@/app/dashboard/_components/NotificationModal";

const capitalizeWords = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function Header() {
  const router = useRouter();

  // Component States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("User");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Refs for outside click detection
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fetch user profile and validate authentication
  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(true);

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
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchUserProfile();
    }, 0);

    const handleProfileUpdate = () => fetchUserProfile();
    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [fetchUserProfile]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setShowUserMenu(false);
    router.push("/login");
  };

  return (
    <header className="bg-header-bg text-white w-full sticky top-0 z-30 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center px-4 sm:px-8 lg:px-12 py-3.5 w-full mx-auto">
        {/* Brand Logo */}
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="text-primary text-2xl sm:text-3xl font-bold tracking-wide shrink-0"
        >
          CarWise
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-[15px] font-medium text-white/90">
          <Link href="/" className="hover:text-primary transition-colors">
            Front
          </Link>
          <Link href="/menu" className="hover:text-primary transition-colors">
            Menu
          </Link>
          <Link href="/order" className="hover:text-primary transition-colors">
            Order
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-6">
          <button className="hidden sm:inline-flex bg-primary hover:opacity-90 transition-opacity text-white px-5 lg:px-6 py-2 rounded-lg font-semibold text-[13px] lg:text-[14px] shadow-sm whitespace-nowrap">
            Get The App
          </button>

          {isAuthenticated ? (
            <>
              {/* User Profile Menu (Avatar) */}
              <div
                className="relative"
                ref={userMenuRef}
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="flex items-center gap-2 sm:gap-3 cursor-pointer group focus:outline-none py-1"
                >
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-surface-subtle border border-border-main shrink-0 transition-transform group-hover:scale-105">
                    {userAvatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full animate-pulse bg-border-subtle"></div>
                    )}
                  </div>
                  <span className="hidden sm:inline text-[14px] sm:text-[15px] font-medium tracking-wide text-white group-hover:text-primary transition-colors truncate max-w-[140px]">
                    {isLoading ? "..." : userName}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full pt-2 w-56 z-50">
                    <div className="bg-surface border border-border-subtle rounded-xl shadow-lg py-2 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-border-subtle mb-1">
                        <p className="text-sm text-text-secondary">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-text-main truncate">
                          {userName}
                        </p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-main hover:bg-surface-subtle hover:text-primary transition-colors"
                      >
                        <FaChartLine /> Dashboard
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-main hover:bg-surface-subtle hover:text-primary transition-colors"
                      >
                        <FaCog /> Settings
                      </Link>

                      <div className="my-1 border-t border-border-subtle"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <FaSignOutAlt /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="relative cursor-pointer hover:text-primary text-white/90 transition-colors p-1 focus:outline-none"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" />
                  </svg>
                  <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-header-bg"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-3 z-50">
                    <NotificationModal />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Guest Actions */}
              <button
                type="button"
                className="cursor-pointer text-white/90 hover:text-primary transition-colors p-1"
                aria-label="Shopping Cart"
              >
                <FaShoppingCart size={19} />
              </button>
              <Link
                href="/login"
                className="cursor-pointer text-white/90 hover:text-primary transition-colors p-1 flex items-center gap-2"
                aria-label="User Login"
              >
                <FaUser size={19} />
              </Link>
            </>
          )}

          {/* Theme Toggle at the very end */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
