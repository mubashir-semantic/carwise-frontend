"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { VehicleItem } from "../page";

interface ExpenseHistoryListProps {
  data: VehicleItem[];
  isLoading: boolean;
  onAddExpense: (vehicle: VehicleItem) => void;
}

export default function ExpenseHistoryList({
  data,
  isLoading,
  onAddExpense,
}: ExpenseHistoryListProps) {
  // Exact Figma Date Format: "12.02.22"
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "12.02.22";
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      return `${day}.${month}.${year}`;
    } catch {
      return "12.02.22";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-16 text-center text-text-muted text-sm animate-pulse">
        Loading vehicle expense cards...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-surface p-12 rounded-[20px] border border-border-main text-center text-text-muted text-sm shadow-xs">
        No vehicles found. Add a vehicle first to manage its expense history.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col space-y-4 sm:space-y-5">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-surface border border-border-main rounded-[20px] p-4 sm:p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          {/* Left section: Peach container with car + vehicle info */}
          <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
            {/* Soft Peach Rounded Container */}
            <div className="relative w-[110px] h-[85px] sm:w-[130px] sm:h-[95px] bg-primary-tint rounded-[16px] shrink-0 flex items-center justify-center p-2 overflow-hidden">
              <Image
                src="/Group 20398.png"
                alt={item.carName || "Car"}
                fill
                className="object-contain p-1"
                sizes="(max-width: 640px) 110px, 130px"
              />
            </div>

            {/* Vehicle Details */}
            <div className="flex flex-col min-w-0">
              <h3 className="text-[16px] sm:text-[17px] font-bold text-text-heading truncate">
                {item.carName || "Mercedez S-Benz"}
                {item.modelYear ? `(${item.modelYear})` : "(2020)"}
              </h3>
              <p className="text-[13px] text-text-secondary mt-0.5 font-medium truncate">
                Licensee – {item.licenseNumber}
              </p>
              <p className="text-[12px] text-text-muted mt-1.5 font-normal">
                Added Date : {formatDate(item.createdAt)}
              </p>
            </div>
          </div>

          {/* Right section: ADD EXPENSE HISTORY at top right, View full history at bottom right */}
          <div className="flex sm:flex-col justify-between sm:justify-between items-end w-full sm:w-auto sm:self-stretch pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle">
            {/* Add Expense Action Button */}
            <button
              onClick={() => onAddExpense(item)}
              className="text-[11px] sm:text-[12px] font-bold text-text-heading uppercase tracking-wider flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer group"
            >
              <span>ADD EXPENSE HISTORY</span>
              <span className="w-[18px] h-[18px] rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-bold shadow-xs group-hover:scale-105 transition-transform">
                +
              </span>
            </button>

            {/* View Full History Link */}
            <Link
              href={`/dashboard/expense/${item._id}`}
              className="text-[12px] sm:text-[13px] font-medium text-text-heading underline underline-offset-4 hover:text-primary transition-colors cursor-pointer"
            >
              View full history
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
