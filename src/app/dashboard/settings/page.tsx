"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import api from "@/services/api";
import Input from "@/components/Input";

type TabType = "overview" | "profile" | "passwords" | "notifications";

const capitalizeWords = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic User State
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    customerId: "",
    email: "",
    address: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationOption, setNotificationOption] = useState<
    "device" | "mail" | "dont_send"
  >("device");

  // 1. FETCH PROFILE FROM BACKEND
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/users/profile");
      const user = response.data?.user || response.data;

      if (user) {
        const rawName = user.username || user.name || "User";
        const formattedFullName = capitalizeWords(rawName);

        const nameParts = formattedFullName.trim().split(" ");
        const fName = user.firstName
          ? capitalizeWords(user.firstName)
          : nameParts[0] || "";
        const lName = user.lastName
          ? capitalizeWords(user.lastName)
          : nameParts.slice(1).join(" ") || "";

        const generatedCustomerId =
          user.customerId ||
          (user._id
            ? `CW-${user._id.slice(-6).toUpperCase()}`
            : "Not assigned");

        setProfileData({
          firstName: fName,
          lastName: lName,
          fullName: formattedFullName,
          customerId: generatedCustomerId,
          email: user.email || "",
          address: user.address || "",
          avatar:
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              formattedFullName,
            )}&background=f5924a&color=fff&bold=true`,
        });
      }
    } catch (error) {
      console.error("Error fetching user profile in Settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserProfile();
  }, []);

  // 2. IMAGE UPLOAD HANDLER
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 2MB limit
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. IMAGE DELETE HANDLER
  const handleDeleteImage = () => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profileData.fullName || "User",
    )}&background=f5924a&color=fff&bold=true`;

    setProfileData((prev) => ({
      ...prev,
      avatar: defaultAvatar,
    }));
    toast.success("Picture removed");
  };

  // 4. BACKEND UPDATE PROFILE (PUT /users/profile)
  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    try {
      const combinedUsername =
        `${profileData.firstName} ${profileData.lastName}`.trim();
      const finalUsername = capitalizeWords(
        combinedUsername || profileData.fullName,
      );

      const payload = {
        username: finalUsername,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        address: profileData.address,
        avatar: profileData.avatar,
      };

      // Backend PUT endpoint call
      const res = await api.put("/users/profile", payload);

      toast.success(res.data?.message || "Profile updated successfully!");

      setProfileData((prev) => ({
        ...prev,
        fullName: finalUsername,
      }));

      setActiveTab("overview");
    } catch (error) {
      const msg = isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to update profile";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Backend logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.clear();

      document.cookie =
        "auth_flow_step=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";

      toast.success("Logged out successfully");
      router.replace("/login");
    }
  };

  // 6. CHANGE PASSWORD HANDLER
  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success(res.data?.message || "Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setActiveTab("overview");
    } catch (error) {
      const msg = isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to change password";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    fetchUserProfile(); // Revert unsaved edits
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setActiveTab("overview");
  };

  const handleDeactivate = () => {
    if (confirm("Are you sure you want to deactivate your account?")) {
      toast.error("Account deactivation initiated.");
    }
  };

  return (
    <div className="w-full bg-surface min-h-[88vh] px-6 sm:px-10 lg:px-14 py-8 text-text-main transition-colors duration-200">
      {/* Hidden File Input for Picture Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Dynamic Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-text-heading tracking-tight mb-8">
        {activeTab === "overview" && "Settings"}
        {activeTab === "profile" && "Settings/Profile base"}
        {activeTab === "passwords" && "Settings/Passwords"}
        {activeTab === "notifications" && "Settings/Notification"}
      </h1>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
        {/* Left Side: Content */}
        <div className="lg:col-span-7 flex flex-col pt-1">
          {/* ================= VIEW 1: OVERVIEW ================= */}
          {activeTab === "overview" && (
            <div>
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-border-subtle shadow-xs mb-10 bg-surface-subtle">
                {isLoading ? (
                  <div className="w-full h-full animate-pulse bg-surface-subtle" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileData.avatar}
                    alt={profileData.fullName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col text-[14px] sm:text-[15px]">
                <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-border-subtle">
                  <span className="w-44 text-text-heading font-medium shrink-0">
                    Full Name
                  </span>
                  <span className="text-text-secondary mt-1 sm:mt-0 font-normal">
                    {isLoading ? "Loading..." : profileData.fullName || "User"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-border-subtle">
                  <span className="w-44 text-text-heading font-medium shrink-0">
                    Customer ID
                  </span>
                  <span className="text-text-secondary mt-1 sm:mt-0 font-normal">
                    {isLoading ? "..." : profileData.customerId}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-border-subtle">
                  <span className="w-44 text-text-heading font-medium shrink-0">
                    Email Address
                  </span>
                  <span className="text-text-secondary mt-1 sm:mt-0 font-normal">
                    {isLoading ? "..." : profileData.email}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start py-4 border-b border-border-subtle">
                  <span className="w-44 text-text-heading font-medium shrink-0 pt-0.5">
                    Home address
                  </span>
                  <span
                    className={`mt-1 sm:mt-0 font-normal max-w-sm leading-relaxed ${
                      !profileData.address
                        ? "text-text-muted italic"
                        : "text-text-secondary"
                    }`}
                  >
                    {isLoading
                      ? "..."
                      : profileData.address || "Not provided yet"}
                  </span>
                </div>
              </div>

              <div className="mt-14">
                <button
                  type="button"
                  onClick={handleDeactivate}
                  className="inline-flex items-center gap-2.5 text-error hover:opacity-80 font-medium text-[14px] transition-opacity cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Deactive my account</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= VIEW 2: PROFILE BASE (FUNCTIONAL) ================= */}
          {activeTab === "profile" && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 border border-border-subtle bg-surface-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileData.avatar}
                    alt={profileData.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-primary-tint hover:opacity-90 text-primary text-[13px] font-semibold rounded-lg transition-opacity cursor-pointer"
                  >
                    Upload New Picture
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="px-4 py-2 bg-surface border border-border-main hover:bg-surface-subtle text-error text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <h2 className="text-[16px] font-bold text-text-heading mb-5">
                Account Information
              </h2>

              <div className="flex flex-col space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-normal text-text-secondary mb-1.5">
                      First name
                    </label>
                    <Input
                      type="text"
                      placeholder="First name"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-text-secondary mb-1.5">
                      Last name
                    </label>
                    <Input
                      type="text"
                      placeholder="Last name"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-normal text-text-secondary mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={profileData.email}
                    disabled
                    className="opacity-70 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-text-secondary mb-1.5">
                    Home address
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your home address"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-10">
                <button
                  type="button"
                  onClick={handleDiscard}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-border-main text-text-main hover:bg-surface-subtle rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary hover:opacity-90 text-white rounded-lg text-sm font-semibold shadow-xs transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ================= VIEW 3: PASSWORDS ================= */}
          {activeTab === "passwords" && (
            <div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 mb-8 border border-border-subtle bg-surface-subtle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileData.avatar}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-[16px] font-bold text-text-heading mb-5">
                Password Information
              </h2>

              <div className="flex flex-col space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-normal text-text-secondary mb-1.5">
                    Old password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-text-secondary mb-1.5">
                    New password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-text-secondary mb-1.5">
                    Confirm new password
                  </label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-10">
                <button
                  type="button"
                  onClick={handleDiscard}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-border-main text-text-main hover:bg-surface-subtle rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary hover:opacity-90 text-white rounded-lg text-sm font-semibold shadow-xs transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ================= VIEW 4: NOTIFICATIONS ================= */}
          {activeTab === "notifications" && (
            <div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 mb-8 border border-border-subtle bg-surface-subtle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileData.avatar}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-[16px] font-bold text-text-heading mb-6">
                Alert & Notification
              </h2>

              <div className="flex flex-col space-y-4 max-w-lg">
                <label className="flex items-center gap-3.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="notification"
                    checked={notificationOption === "device"}
                    onChange={() => setNotificationOption("device")}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span className="text-[13.5px] text-text-main">
                    Send me message & payment notification in my device
                  </span>
                </label>

                <label className="flex items-center gap-3.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="notification"
                    checked={notificationOption === "mail"}
                    onChange={() => setNotificationOption("mail")}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span className="text-[13.5px] text-text-main">
                    Send me message & payment notification in my mail
                  </span>
                </label>

                <label className="flex items-center gap-3.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="notification"
                    checked={notificationOption === "dont_send"}
                    onChange={() => setNotificationOption("dont_send")}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span className="text-[13.5px] text-text-main">
                    Dont&apos;send
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 mt-12">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="px-6 py-2 border border-border-main text-text-main hover:bg-surface-subtle rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Preferences updated!");
                    setActiveTab("overview");
                  }}
                  className="px-6 py-2 bg-primary hover:opacity-90 text-white rounded-lg text-sm font-semibold shadow-xs transition-opacity cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT CARD: ACCOUNT ================= */}
        <div className="lg:col-span-5 w-full max-w-md ml-auto">
          <div className="bg-surface border border-border-main p-6 sm:p-8 shadow-xs flex flex-col justify-between min-h-[520px] transition-colors duration-200">
            <div>
              <h2 className="text-[17px] font-bold text-text-heading mb-6">
                Account
              </h2>

              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3.5 py-3 rounded-xl text-[14px] font-medium transition-colors text-left cursor-pointer ${
                    activeTab === "profile"
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-heading"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      activeTab === "profile"
                        ? "bg-primary-tint text-primary"
                        : "bg-surface-subtle text-text-muted"
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span>Profile base</span>
                </button>

                <div className="border-b border-border-subtle" />

                <button
                  type="button"
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3.5 py-3 rounded-xl text-[14px] font-medium transition-colors text-left cursor-pointer ${
                    activeTab === "notifications"
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-heading"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      activeTab === "notifications"
                        ? "bg-primary-tint text-primary"
                        : "bg-surface-subtle text-text-muted"
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                  </div>
                  <span>Notification Settings</span>
                </button>

                <div className="border-b border-border-subtle" />

                <button
                  type="button"
                  onClick={() => setActiveTab("passwords")}
                  className={`w-full flex items-center gap-3.5 py-3 rounded-xl text-[14px] font-medium transition-colors text-left cursor-pointer ${
                    activeTab === "passwords"
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-heading"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      activeTab === "passwords"
                        ? "bg-primary-tint text-primary"
                        : "bg-surface-subtle text-text-muted"
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </div>
                  <span>Passwords</span>
                </button>
              </div>
            </div>

            {/* Log Out Button */}
            <div className="pt-8">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-3 text-primary hover:opacity-80 font-semibold text-[14px] transition-opacity cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full border border-primary flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
