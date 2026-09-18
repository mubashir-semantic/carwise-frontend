"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

const tabs = ["In-progress", "Completed", "Pending"] as const;
type TabType = (typeof tabs)[number];

interface ServiceItem {
  _id: string;
  title: string;
  serviceCenter: string;
  cost?: number;
  bookingType?: string;
  serviceDate: string;
  status: string;
  createdAt: string;
}

export default function ServiceHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Completed");
  const [serviceData, setServiceData] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchServiceHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/service-history");
      setServiceData(response.data || []);
    } catch (error) {
      console.error("Error fetching service history:", error);
      toast.error("Failed to load service history records.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchServiceHistory();
  }, [fetchServiceHistory]);

  const filteredData = serviceData.filter((item) => {
    const itemStatus = (item.status || "").toLowerCase().trim();
    const currentTab = activeTab.toLowerCase().trim();

    if (currentTab === "in-progress") {
      return itemStatus === "in-progress" || itemStatus === "ongoing";
    }
    return itemStatus === currentTab;
  });

  const formatMainDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatCreatedDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return `Created ${d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })}`;
    } catch {
      return "";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const s = (status || "").toLowerCase().trim();
    if (s === "completed") return "bg-success text-white";
    if (s === "in-progress" || s === "ongoing") return "bg-primary text-white";
    if (s === "pending") return "bg-warning text-white";
    return "bg-surface-subtle text-text-secondary";
  };

  return (
    <div className="flex flex-col w-full px-2 sm:px-4 lg:px-6 pt-2 pb-20">
      {/* Tabs Header with Full-Width Grey Border Line */}
      <div className="w-full border-b border-border-main mb-8">
        <div className="flex items-center gap-10 sm:gap-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-[15px] sm:text-[16px] transition-colors cursor-pointer ${
                activeTab === tab
                  ? "text-text-heading font-medium"
                  : "text-text-muted font-normal hover:text-text-main"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full -mb-[1.5px]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table View */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[780px]">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="pb-4 font-normal text-[12px] text-text-muted w-[28%]">
                License - problem
              </th>
              <th className="pb-4 font-normal text-[12px] text-text-muted w-[22%]">
                Workshop name
              </th>
              <th className="pb-4 font-normal text-[12px] text-text-muted w-[20%]">
                Booking type
              </th>
              <th className="pb-4 font-normal text-[12px] text-text-muted w-[18%]">
                Date
              </th>
              <th className="pb-4 font-normal text-[12px] text-text-muted w-[12%]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-center text-text-muted text-sm animate-pulse"
                >
                  Loading service records...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-center text-text-muted text-sm"
                >
                  No dynamic records found in {activeTab}.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-border-subtle last:border-none hover:bg-surface-subtle/50 transition-colors"
                >
                  {/* Column 1: License - problem */}
                  <td className="py-4 sm:py-5 text-[13px] text-text-main font-medium">
                    {item.title?.startsWith("#")
                      ? item.title
                      : `#42424 - ${item.title}`}
                  </td>

                  {/* Column 2: Workshop name */}
                  <td className="py-4 sm:py-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[22px] h-[22px] rounded-full bg-error text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs">
                        T
                      </div>
                      <span className="text-[13px] text-text-main font-medium truncate">
                        {item.serviceCenter || "Bildialog Asane"}
                      </span>
                    </div>
                  </td>

                  {/* Column 3: Booking type */}
                  <td className="py-4 sm:py-5">
                    <div className="flex items-center gap-2 text-[13px] text-text-main font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                      <span>
                        {item.bookingType || `Rs. ${item.cost || 4500}`}
                      </span>
                    </div>
                  </td>

                  {/* Column 4: Date */}
                  <td className="py-4 sm:py-5">
                    <div className="flex flex-col">
                      <span className="text-[13px] text-text-main font-medium leading-tight">
                        {formatMainDate(item.serviceDate)}
                      </span>
                      {item.createdAt && (
                        <span className="text-[11px] text-text-muted mt-1 font-normal">
                          {formatCreatedDate(item.createdAt)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Column 5: Status Badge */}
                  <td className="py-4 sm:py-5">
                    <span
                      className={`inline-block px-3 py-1 rounded-[5px] text-[11px] font-medium tracking-wide shadow-xs capitalize ${getStatusBadgeClass(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
