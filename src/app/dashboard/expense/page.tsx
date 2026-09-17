"use client";

import React, { useState, useEffect } from "react";
import ExpenseHistoryList from "./_components/ExpenseHistoryList";
import ExpenseTips from "./_components/ExpenseTips";
import AddExpenseModal from "../_components/AddExpenseModal";
import api from "@/services/api";
import toast from "react-hot-toast";

interface ExpenseItem {
  _id: string;
  title: string;
  cost: number;
  servicingDetails: string;
  category: string;
  expenseDate: string;
  status: string;
  createdAt: string;
}

export default function ExpenseHistoryPage() {
  const [expenseData, setExpenseData] = useState<ExpenseItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    api
      .get("/expense-history")
      .then((res) => {
        if (isMounted) setExpenseData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching expense history:", err);
        if (isMounted) toast.error("Failed to load expense history records.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshData = async () => {
    try {
      const res = await api.get("/expense-history");
      setExpenseData(res.data);
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full items-start relative pb-10">
      {/* LEFT SIDE: Main Expense Content */}
      <div className="flex-1 w-full flex flex-col space-y-6">
        {/* Header with Title and Add Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-[#1a103c] font-bold text-2xl">Expense History</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#ff904d] hover:bg-[#e67e3d] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <span>+ Add Expense</span>
          </button>
        </div>

        {/* Expense List Component */}
        <ExpenseHistoryList data={expenseData} isLoading={isLoading} />
      </div>

      {/* RIGHT SIDE: Tips Box */}
      <div className="w-full xl:w-[340px] flex-shrink-0">
        <ExpenseTips />
      </div>

      {/* Centralized Add Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshData}
        endpoint="/expense-history"
        titleLabel="Add Expense History"
      />
    </div>
  );
}
