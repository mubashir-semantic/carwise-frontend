"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to load your added vehicles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVehicles();
  }, []);

  return (
    <div className="flex flex-col space-y-5 w-full">
      {/* --- Card 1: Your Added Car --- */}
      <div className="bg-white border border-gray-200 rounded-[20px] px-6 pt-2 pb-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Header Section */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/Group 20388.png"
                alt="Added Car Icon"
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
            <h3 className="text-gray-800 font-semibold text-[16px]">
              Your added car{" "}
              <span className="text-gray-400 font-normal">
                ({vehicles.length})
              </span>
            </h3>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-gray-600 text-[14px] hover:text-gray-900 transition-colors cursor-pointer"
          >
            <span className="w-[18px] h-[18px] rounded-full bg-[#ff904d] text-white flex items-center justify-center text-sm leading-none pb-0.5">
              +
            </span>
            Want to add new car?
          </button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col mt-2">
          {isLoading ? (
            <div className="py-4 text-center text-gray-400 text-sm animate-pulse">
              Loading your vehicles...
            </div>
          ) : vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="grid grid-cols-3 items-center py-3.5 border-b border-gray-50 last:border-none"
              >
                {/* Column 1: License Number */}
                <div className="text-gray-700 text-[14px] font-medium text-left truncate pr-2">
                  {vehicle.licenseNumber}
                </div>

                {/* Column 2: Brand Logo & Dynamic Name */}
                <div className="flex items-center justify-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-red-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">
                      {(vehicle.carName || "M").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-800 text-[14px] font-medium truncate">
                    {vehicle.carName || "Mercedez S-Benz"}
                  </span>
                </div>

                {/* Column 3: Added Date */}
                <div className="text-gray-500 text-[13px] text-right whitespace-nowrap">
                  Added Date :{" "}
                  {new Date(vehicle.createdAt)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, ".")}
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-400 text-sm">
              No cars added yet. Click above to add your first vehicle!
            </div>
          )}
        </div>
      </div>

      {/* --- Card 2: Your Ongoing Servicing Car --- */}
      <div className="bg-white border border-gray-200 rounded-[20px] px-6 pt-2 pb-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/Group 20389.png"
                alt="Ongoing Car Icon"
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            <h3 className="text-gray-800 font-semibold text-[16px]">
              Your ongoing servicing car
            </h3>
          </div>
          <button className="text-gray-500 text-[13px] hover:text-gray-800 transition-colors">
            View all
          </button>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-gray-700 text-[14px]">
            #42424 - Car Oil Repair
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-red-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">T</span>
            </div>
            <span className="text-gray-800 text-[14px] font-medium">
              Bildialog Asane
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-gray-700 text-[14px]">11.02.2022</span>
            <div className="relative cursor-pointer text-gray-500 hover:text-[#ff904d] transition-colors">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <button className="bg-[#ff904d] text-white px-5 py-1.5 rounded-[8px] text-[13px] font-medium hover:bg-opacity-90 transition-colors">
              Ongoing
            </button>
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
