"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import AddVehicleModal from "@/components/ui/AddVehicleModal";
import api from "@/services/api";
import toast from "react-hot-toast";

interface Vehicle {
  _id: string;
  licenseNumber: string;
  carName?: string;
  modelYear?: string;
  createdAt: string;
}

export default function CarStatus() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to load your added vehicles.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchVehicles();
  }, [fetchVehicles]);

  return (
    <div className="flex flex-col space-y-4 sm:space-y-5 w-full">
      {/* --- Card 1: Your Added Car --- */}
      <div className="bg-surface border border-border-main rounded-[20px] px-4 sm:px-6 pt-3.5 pb-4 shadow-xs hover:shadow-sm transition-shadow">
        {/* Header Section */}
        <div className="flex justify-between items-center pb-3 border-b border-border-subtle gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0">
              <Image
                src="/Group 20388.png"
                alt="Added Car Icon"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 36px, 44px"
              />
            </div>
            <h3 className="text-text-main font-semibold text-[15px] sm:text-[16px] whitespace-nowrap">
              Your added car{" "}
              <span className="text-text-muted font-normal">
                ({vehicles.length})
              </span>
            </h3>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-text-secondary text-[12px] sm:text-[14px] hover:text-primary transition-colors cursor-pointer shrink-0"
          >
            <span className="w-[18px] h-[18px] rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold leading-none shadow-xs">
              +
            </span>
            <span className="hidden xs:inline">Want to add new car?</span>
            <span className="xs:hidden">Add Car</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col mt-1 divide-y divide-border-subtle">
          {isLoading ? (
            <div className="py-5 text-center text-text-muted text-sm animate-pulse">
              Loading your vehicles...
            </div>
          ) : vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="grid grid-cols-3 items-center py-3.5 text-xs sm:text-[14px]"
              >
                {/* Column 1: License Number */}
                <div className="text-text-main font-semibold truncate pr-2 text-left">
                  {vehicle.licenseNumber}
                </div>

                {/* Column 2: Brand Logo & Name */}
                <div className="flex items-center justify-center gap-2 min-w-0 px-1">
                  <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 bg-primary flex items-center justify-center shadow-xs">
                    <span className="text-white text-[9px] sm:text-[10px] font-bold">
                      {(vehicle.carName || "M").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-text-main font-medium truncate">
                    {vehicle.carName || "Mercedez S-Benz"}
                  </span>
                </div>

                {/* Column 3: Added Date */}
                <div className="text-text-muted text-[11px] sm:text-[13px] text-right whitespace-nowrap">
                  <span className="hidden sm:inline">Added Date : </span>
                  {new Date(vehicle.createdAt)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, ".")}
                </div>
              </div>
            ))
          ) : (
            <div className="py-5 text-center text-text-muted text-sm">
              No cars added yet. Click above to add your first vehicle!
            </div>
          )}
        </div>
      </div>

      {/* --- Card 2: Your Ongoing Servicing Car --- */}
      <div className="bg-surface border border-border-main rounded-[20px] px-4 sm:px-6 pt-3.5 pb-4 shadow-xs hover:shadow-sm transition-shadow">
        {/* Header Section */}
        <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0">
              <Image
                src="/Group 20389.png"
                alt="Ongoing Car Icon"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 36px, 44px"
              />
            </div>
            <h3 className="text-text-main font-semibold text-[15px] sm:text-[16px]">
              Your ongoing servicing car
            </h3>
          </div>
          <button className="text-text-secondary text-[12px] sm:text-[13px] hover:text-text-main transition-colors cursor-pointer">
            View all
          </button>
        </div>

        {/* Content Section */}
        <div className="pt-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Side: Title & Center */}
          <div className="flex items-center justify-between md:justify-start gap-4">
            <span className="text-text-main text-[13px] sm:text-[14px] font-medium">
              #42424 - Car Oil Repair
            </span>
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 bg-error flex items-center justify-center shadow-xs">
                <span className="text-white text-[9px] sm:text-[10px] font-bold">
                  T
                </span>
              </div>
              <span className="text-text-secondary text-[13px] sm:text-[14px] font-medium">
                Bildialog Asane
              </span>
            </div>
          </div>

          {/* Right Side: Date, Icon & Status */}
          <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 border-t md:border-t-0 pt-2.5 md:pt-0 border-border-subtle">
            <span className="text-text-muted text-[12px] sm:text-[14px]">
              11.02.2022
            </span>

            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer text-text-secondary hover:text-primary transition-colors">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
              </div>

              <button className="bg-primary hover:opacity-90 text-white px-4 sm:px-5 py-1.5 rounded-[8px] text-[12px] sm:text-[13px] font-medium transition-opacity shadow-xs cursor-pointer">
                Ongoing
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchVehicles}
      />
    </div>
  );
}
