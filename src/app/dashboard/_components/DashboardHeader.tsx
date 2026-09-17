"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/services/api";

export default function DashboardHeader() {
  const [userName, setUserName] = useState<string>("User");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        console.log("Full Profile Response:", response.data);

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
    <header className="bg-[#1a103c] text-white flex justify-between items-center px-8 lg:px-12 py-4 w-full">
      {/* Left: Logo */}
      <Link
        href="/dashboard"
        className="text-[#ff904d] text-3xl font-bold tracking-wide"
      >
        CarWise
      </Link>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-10 text-[15px] font-medium">
        <Link href="/about" className="hover:text-[#ff904d] transition-colors">
          About Us
        </Link>
        <Link
          href="/contact"
          className="hover:text-[#ff904d] transition-colors"
        >
          Contact Us
        </Link>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-8">
        <button className="bg-[#ff904d] hover:bg-[#e67e3d] transition-colors text-white px-6 py-2.5 rounded-[8px] font-semibold text-[14px] shadow-sm">
          Get The App
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-600">
            {/* Awesome Auto-Avatar Generator based on User Name */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ui-avatars.com/api/?name=${userName}&background=ff904d&color=fff&bold=true`}
              alt="User Avatar"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-[15px] font-medium tracking-wide">
            {isLoading ? (
              <span className="animate-pulse text-gray-400">Loading...</span>
            ) : (
              `Hii, ${userName}`
            )}
          </span>
        </div>

        {/* Notification Bell (Pixel-perfect as per Figma) */}
        <div className="relative cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
          {/* Filled Orange Bell Icon */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#ff904d"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" />
          </svg>

          {/* Red Notification Dot */}
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-[#1a103c] translate-x-[2px] -translate-y-[2px]"></span>
        </div>
      </div>
    </header>
  );
}
