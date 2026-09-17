"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "@/services/api";
import Modal from "./Modal";
import FloatingInput from "./FloatingInput";
import Image from "next/image";
import axios from "axios";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddVehicleModal({
  isOpen,
  onClose,
  onSuccess,
}: AddVehicleModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [carName, setCarName] = useState("Mercedez S-Benz");
  const [modelYear, setModelYear] = useState("2018");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setStep(1);
    setLicenseNumber("");
    setCarName("Mercedez S-Benz");
    setModelYear("2018");
    setIsConfirmed(false);
    setIsLoading(false);
    onClose();
  };

  // Step 1: Validation before moving to confirmation
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (licenseNumber.trim().length < 3) {
      toast.error("License number must be at least 3 characters");
      return;
    }
    setStep(2);
  };

  // Step 2: Actual API Call to NestJS Backend
  const handleFinalSubmit = async () => {
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      const response = await api.post("/vehicles", {
        licenseNumber: licenseNumber.trim(),
        carName: carName.trim(),
        modelYear: modelYear.trim(),
      });

      if (response.status === 201) {
        toast.success("Vehicle Added Successfully! 🎉");
        handleClose();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Vehicle API Error:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to add vehicle. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col items-center px-6 pt-8 pb-10 sm:px-10">
        <div className="relative w-[220px] h-[140px] mb-10 pointer-events-none">
          <Image
            src="/Group 20398.png"
            alt="Add Vehicle Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>

        {step === 1 && (
          <form
            onSubmit={handleInitialSubmit}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full max-w-[320px] mb-10">
              <FloatingInput
                label="Type your license number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#ff904d] hover:bg-[#e67e3d] text-white font-semibold py-2.5 px-14 rounded-[12px] transition-colors shadow-sm text-[15px] cursor-pointer"
            >
              Submit
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-8 h-8 mb-2">
              <svg
                viewBox="0 0 100 100"
                fill="#fdb385"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M43.5 12.5C65.5 -2.5 87.5 12.5 93.5 39.5C99.5 66.5 73.5 90.5 48.5 95.5C23.5 100.5 2.5 76.5 1.5 50.5C0.5 24.5 21.5 27.5 43.5 12.5Z" />
              </svg>
            </div>

            {/* Editable Car Name & Model Year */}
            <div className="w-full flex flex-col items-center mb-5 space-y-1">
              <input
                type="text"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                placeholder="Car Name"
                className="text-[#1a103c] text-xl font-bold text-center border-b border-dashed border-gray-300 hover:border-[#ff904d] focus:border-[#ff904d] focus:outline-none transition-colors px-2 py-0.5 max-w-[280px]"
                title="Click to edit car name"
              />
              <input
                type="text"
                value={modelYear}
                onChange={(e) => setModelYear(e.target.value)}
                placeholder="Year"
                className="text-[#1a103c] text-[15px] font-medium text-center border-b border-dashed border-gray-300 hover:border-[#ff904d] focus:border-[#ff904d] focus:outline-none transition-colors px-2 py-0.5 w-24"
                title="Click to edit model year"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer mb-6 group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="peer appearance-none w-[18px] h-[18px] border-[1.5px] border-gray-300 rounded-[4px] checked:bg-[#ff904d] checked:border-[#ff904d] transition-colors cursor-pointer"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                />
                <svg
                  className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-500 text-[13px] select-none group-hover:text-gray-700 transition-colors">
                Yes, This is my information. I am clarifying it.
              </span>
            </label>

            <button
              onClick={handleFinalSubmit}
              disabled={!isConfirmed || isLoading}
              className={`relative font-semibold py-2.5 px-12 rounded-[12px] transition-all text-[15px] flex items-center justify-center min-w-[140px] cursor-pointer ${
                isConfirmed && !isLoading
                  ? "bg-[#ff904d] hover:bg-[#e67e3d] text-white shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Yes, Add"
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
