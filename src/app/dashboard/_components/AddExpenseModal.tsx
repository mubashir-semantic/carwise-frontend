"use client";

import React, { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  endpoint?: string; // e.g. "/expense-history" or "/service-history"
  titleLabel?: string;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSuccess,
  endpoint = "/expense-history",
  titleLabel = "Add Expense History",
}: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    cost: "",
    servicingDetails: "",
    expenseDate: new Date().toLocaleDateString(),
    status: "Completed",
    category: "General",
  });

  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post(endpoint, {
        title: formData.title,
        cost: Number(formData.cost),
        servicingDetails: formData.servicingDetails,
        category: formData.category,
        expenseDate: formData.expenseDate,
        status: formData.status,
      });
      toast.success("Record added successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating record:", error);
      toast.error("Failed to add record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] w-full max-w-xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">{titleLabel}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light px-2 py-1 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-medium uppercase text-gray-400 mb-1.5 tracking-wider">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-[10px] text-sm focus:outline-none focus:border-[#ff904d] text-gray-800"
                placeholder="e.g. Fuel Refill"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase text-gray-400 mb-1.5 tracking-wider">
                Cost
              </label>
              <input
                type="number"
                required
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-[10px] text-sm focus:outline-none focus:border-[#ff904d] text-gray-800"
                placeholder="e.g. 5000"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase text-gray-400 mb-1.5 tracking-wider">
              Servicing details
            </label>
            <textarea
              rows={4}
              required
              value={formData.servicingDetails}
              onChange={(e) =>
                setFormData({ ...formData, servicingDetails: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-[10px] text-sm focus:outline-none focus:border-[#ff904d] text-gray-800 resize-none"
              placeholder="Enter details..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase text-gray-400 mb-1.5 tracking-wider">
              Category
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-[10px] text-sm focus:outline-none focus:border-[#ff904d] bg-white text-gray-800 appearance-none cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Fuel">Fuel</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Repair">Repair Work</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          <div>
            <label className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-[12px] cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  {fileName ? (
                    <span className="text-[#ff904d] font-semibold">
                      {fileName}
                    </span>
                  ) : (
                    "Click to browse or drag and drop your files"
                  )}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#ff904d] hover:bg-[#e67e3d] text-white text-sm font-semibold rounded-[10px] shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
