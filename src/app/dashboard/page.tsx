"use client";

import { useState } from "react";
import HeroBanner from "./_components/HeroBanner";
import StatsCards from "./_components/StatsCards";
import CarStatus from "./_components/CarStatus";
import RightSidebar from "./_components/RightSidebar";
import AddExpenseModal from "./_components/AddExpenseModal";

export default function DashboardPage() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  return (
    <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 w-full mt-2 sm:mt-4 min-w-0">
      {/* 1. MIDDLE COLUMN */}
      <div className="flex-1 min-w-0 flex flex-col space-y-6">
        <HeroBanner />
        <StatsCards />
        <CarStatus />
      </div>

      {/* 2. RIGHT COLUMN */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col space-y-6">
        <RightSidebar onAddExpense={() => setIsExpenseModalOpen(true)} />
      </div>

      {/* 3. ADD EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <AddExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSuccess={() => {
            setIsExpenseModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
