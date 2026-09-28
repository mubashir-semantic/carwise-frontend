"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import { useParams } from "next/navigation";
import AddExpenseModal from "../../_components/AddExpenseModal";
import api from "@/services/api";
import toast from "react-hot-toast";

interface ExpenseRecord {
  _id: string;
  category: string;
  title: string;
  serviceCenter?: string;
  cost: number;
  expenseDate: string;
  status: string;
}

interface VehicleDetails {
  _id: string;
  carName?: string;
  modelYear?: string;
  licenseNumber: string;
}

// Fallback demo items if backend has no records yet
const fallbackExpenses: ExpenseRecord[] = [
  {
    _id: "exp-1",
    category: "1",
    title: "#42424 - Car Oil Repair",
    serviceCenter: "Bildialog Asane",
    cost: 450,
    expenseDate: "Thu, 20 Feb 2021",
    status: "Completed",
  },
  {
    _id: "exp-2",
    category: "2",
    title: "#42424 - Brake Pad Check",
    serviceCenter: "Bildialog Asane",
    cost: 320,
    expenseDate: "Thu, 20 Feb 2021",
    status: "Completed",
  },
  {
    _id: "exp-3",
    category: "3",
    title: "#42424 - General Inspection",
    serviceCenter: "Bildialog Asane",
    cost: 541,
    expenseDate: "Thu, 20 Feb 2021",
    status: "Completed",
  },
];

export default function IndividualCarExpenseHistory({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const routerParams = useParams();
  const unwrappedParams = params ? use(params) : null;
  const vehicleId = (unwrappedParams?.id || routerParams?.id) as string;

  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      if (vehicleId) {
        // Fetch vehicle details
        try {
          const vehicleRes = await api.get(`/vehicles/${vehicleId}`);
          setVehicle(vehicleRes.data);
        } catch {
          // If individual route not implemented, set default title
          setVehicle({
            _id: vehicleId,
            carName: "Mercedez S-Benz",
            licenseNumber: "1247L3",
          });
        }
      }

      // Fetch expenses
      const expenseRes = await api.get("/expense-history");
      if (expenseRes.data && expenseRes.data.length > 0) {
        setExpenses(expenseRes.data);
      } else {
        setExpenses(fallbackExpenses);
      }
    } catch (error) {
      console.error("Error loading car expense history:", error);
      setExpenses(fallbackExpenses);
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Vehicle Expense History",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      void navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const totalCost = expenses.reduce(
    (sum, item) => sum + (Number(item.cost) || 0),
    0,
  );

  return (
    <div className="flex flex-col w-full pb-16 pt-2">
      {/* Header Section: Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-text-heading font-bold text-xl sm:text-2xl tracking-tight">
          {vehicle?.carName || "Mercedez S-Benz"}{" "}
          <span className="text-text-secondary font-semibold">
            ({vehicle?.licenseNumber || "1247L3"})
          </span>
        </h1>

        <div className="flex items-center gap-6 self-start sm:self-auto">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-text-secondary hover:text-text-main transition-colors text-sm font-medium cursor-pointer"
          >
            <span>Share</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-primary"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>

          {/* ADD EXPENSE HISTORY Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 text-primary hover:opacity-85 transition-opacity cursor-pointer group"
          >
            <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider">
              ADD EXPENSE HISTORY
            </span>
            <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shadow-xs group-hover:scale-105 transition-transform">
              +
            </span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[780px]">
          {/* Table Headers */}
          <thead>
            <tr className="text-text-muted text-[11px] font-normal uppercase tracking-wider border-b border-border-subtle">
              <th className="pb-4 w-[12%]">Category</th>
              <th className="pb-4 w-[28%]">Title</th>
              <th className="pb-4 w-[24%]">Method</th>
              <th className="pb-4 w-[16%]">Date</th>
              <th className="pb-4 w-[12%]">Status</th>
              <th className="pb-4 w-[8%] text-right pr-4">Attachment</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-text-muted text-sm animate-pulse"
                >
                  Loading expense history...
                </td>
              </tr>
            ) : (
              expenses.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="text-[13px] text-text-main border-b border-border-subtle hover:bg-surface-subtle/50 transition-colors"
                >
                  {/* Category */}
                  <td className="py-4 font-medium text-text-main">
                    {item.category || index + 1}
                  </td>

                  {/* Title */}
                  <td className="py-4 font-medium text-text-heading">
                    {item.title}
                  </td>

                  {/* Method / Workshop Name */}
                  <td className="py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-error text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs">
                        T
                      </div>
                      <span className="font-medium text-text-main">
                        {item.serviceCenter || "Bildialog Asane"}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 text-text-secondary font-normal">
                    {item.expenseDate}
                  </td>

                  {/* Status / Cost */}
                  <td className="py-4 font-bold text-text-heading">
                    ${item.cost}
                  </td>

                  {/* Paperclip Action Icon */}
                  <td className="py-4 text-right pr-4">
                    <button className="text-text-muted hover:text-text-main transition-colors inline-block cursor-pointer">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Table Footer with Total Calculation */}
          <tfoot className="border-t-2 border-border-main">
            <tr>
              <td
                colSpan={4}
                className="pt-6 text-text-heading font-bold text-[14px] sm:text-[15px]"
              >
                Total cost on this car
              </td>
              <td className="pt-6 text-text-heading font-bold text-[14px] sm:text-[15px]">
                ${totalCost}
              </td>
              <td className="pt-6 pr-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Reusable Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        endpoint="/expense-history"
        titleLabel={`Add Expense - ${vehicle?.carName || "Mercedez S-Benz"}`}
      />
    </div>
  );
}
