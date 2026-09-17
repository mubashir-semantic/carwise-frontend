"use client";

import React from "react";

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

interface ExpenseHistoryListProps {
  data: ExpenseItem[];
  isLoading: boolean;
}

export default function ExpenseHistoryList({
  data,
  isLoading,
}: ExpenseHistoryListProps) {
  if (isLoading) {
    return (
      <div className="w-full py-12 text-center text-gray-400 text-sm animate-pulse">
        Loading expense records from database...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col space-y-4">
      {data.length > 0 ? (
        data.map((item) => (
          <div
            key={item._id}
            className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900">
                {item.title}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {item.servicingDetails}
              </span>
              <span className="text-[11px] text-gray-400 mt-1">
                Date: {item.expenseDate}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-base font-bold text-[#ff904d]">
                Rs. {item.cost}
              </span>
              <span className="mt-1 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700">
                {item.status}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-12 rounded-[16px] border border-gray-100 text-center text-gray-400 text-sm">
          No expense records found. Click &quot;+ Add Expense&quot; to add one.
        </div>
      )}
    </div>
  );
}
