"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import AddServiceModal from "../_components/AddExpenseModal";

// Define our tabs
const tabs = ["In-progress", "Completed", "Pending"] as const;
type TabType = (typeof tabs)[number];

interface ServiceItem {
  _id: string;
  title: string;
  serviceCenter: string;
  cost: number;
  serviceDate: string;
  status: string;
  createdAt: string;
}

export default function ServiceHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("In-progress");
  const [serviceData, setServiceData] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch data cleanly without triggering cascading re-render warnings
  useEffect(() => {
    const fetchServiceHistory = async () => {
      try {
        const response = await api.get("/service-history");
        setServiceData(response.data);
      } catch (error) {
        console.error("Error fetching service history:", error);
        toast.error("Failed to load service history records.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceHistory();
  }, []);

  const filteredData = serviceData.filter((item) => {
    const itemStatus = item.status.toLowerCase();
    const currentTab = activeTab.toLowerCase();

    if (currentTab === "in-progress") {
      return itemStatus === "in-progress" || itemStatus === "ongoing";
    }
    return itemStatus === currentTab;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-[#34d399] text-white";
      case "in-progress":
      case "ongoing":
        return "bg-[#ff904d] text-white";
      case "pending":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header with Tabs and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 mb-8 pt-2 pb-4 gap-4">
        {/* Tabs Header */}
        <div className="flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-[16px] transition-colors relative font-medium ${
                activeTab === tab
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-[#ff904d]" />
              )}
            </button>
          ))}
        </div>

        {/* Add Service Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#ff904d] hover:bg-[#e67e3d] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <span>+ Add Service</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="text-[#9ca3af] text-[11px] font-normal uppercase tracking-wider border-b border-gray-100">
              <th className="pb-6 pt-2 w-[25%]">License - problem</th>
              <th className="pb-6 pt-2 w-[20%]">Workshop name</th>
              <th className="pb-6 pt-2 w-[20%]">Booking type</th>
              <th className="pb-6 pt-2 w-[20%]">Date</th>
              <th className="pb-6 pt-2 w-[15%]">Status</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-400 text-sm animate-pulse"
                >
                  Loading service records from database...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-50 last:border-none"
                >
                  <td className="py-6 text-[13px] text-gray-800 font-medium">
                    {item.title}
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#d32f2f] text-white flex items-center justify-center font-bold text-[10px]">
                        T
                      </div>
                      <span className="text-[13px] text-gray-800 font-medium">
                        {item.serviceCenter}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 text-[13px] text-gray-800 font-medium flex items-center gap-2 mt-2">
                    <span className="w-[5px] h-[5px] rounded-full bg-[#1a103c]"></span>
                    Rs. {item.cost}
                  </td>
                  <td className="py-6">
                    <div className="flex flex-col">
                      <span className="text-[13px] text-gray-800 font-medium">
                        {item.serviceDate}
                      </span>
                      <span className="text-[11px] text-gray-400 mt-0.5">
                        Added: {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-6">
                    <span
                      className={`px-3 py-1.5 rounded-[4px] text-[11px] font-semibold tracking-wide ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-400 text-sm"
                >
                  No records found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={async () => {
          // Re-fetch data on success
          try {
            const response = await api.get("/service-history");
            setServiceData(response.data);
          } catch (error) {
            console.error("Error refreshing data:", error);
          }
        }}
      />
    </div>
  );
}
