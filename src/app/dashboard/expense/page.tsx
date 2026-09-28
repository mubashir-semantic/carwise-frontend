"use client";

import React, { useState, useEffect, useCallback } from "react";
import ExpenseHistoryList from "./_components/ExpenseHistoryList";
import ExpenseTips from "./_components/ExpenseTips";
import AddExpenseModal from "../_components/AddExpenseModal";
import api from "@/services/api";
import toast from "react-hot-toast";

// Exported interface for ExpenseHistoryList.tsx
export interface VehicleItem {
  _id: string;
  carName?: string;
  modelYear?: string;
  licenseNumber: string;
  createdAt: string;
}

export default function ExpenseHistoryPage() {
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/vehicles");
      setVehicles(res.data || []);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      toast.error("Failed to load vehicle records.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchVehicles();
  }, [fetchVehicles]);

  const handleAddExpense = (vehicle: VehicleItem) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full items-start relative pb-16 lg:pb-10">
      {/* LEFT SIDE: Main Expense Content */}
      <div className="flex-1 w-full flex flex-col">
        {/* Figma Heading: Clean title without top button */}
        <h1 className="text-text-heading font-bold text-[22px] sm:text-[26px] mb-6 sm:mb-8">
          Expense History
        </h1>

        {/* Vehicles Expense List */}
        <ExpenseHistoryList
          data={vehicles}
          isLoading={isLoading}
          onAddExpense={handleAddExpense}
        />
      </div>

      {/* RIGHT SIDE: Tips Box */}
      <div className="w-full xl:w-[350px] shrink-0">
        <ExpenseTips />
      </div>

      {/* Centralized Add Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicle(null);
        }}
        onSuccess={fetchVehicles}
        endpoint="/expense-history"
        titleLabel={
          selectedVehicle?.carName
            ? `Add Expense - ${selectedVehicle.carName}`
            : "Add Expense History"
        }
      />
    </div>
  );
}
