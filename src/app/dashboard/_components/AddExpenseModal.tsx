"use client";

import React, { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  endpoint?: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-surface border border-border-main rounded-[22px] w-full max-w-lg p-7 sm:p-9 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-text-muted hover:text-text-main text-2xl font-light leading-none transition-colors cursor-pointer"
        >
          &times;
        </button>

        {/* Centered Heading */}
        <h3 className="text-[20px] sm:text-[22px] font-bold text-text-heading text-center mb-6">
          {titleLabel}
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Title & Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-text-main mb-1.5">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-surface border border-border-main rounded-[10px] text-[14px] text-text-main focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. Fuel Refill"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-main mb-1.5">
                Cost
              </label>
              <input
                type="number"
                required
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-surface border border-border-main rounded-[10px] text-[14px] text-text-main focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. 5000"
              />
            </div>
          </div>

          {/* Row 2: Servicing Details */}
          <div>
            <label className="block text-[13px] font-medium text-text-main mb-1.5">
              Servicing details
            </label>
            <textarea
              rows={3}
              required
              value={formData.servicingDetails}
              onChange={(e) =>
                setFormData({ ...formData, servicingDetails: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-surface border border-border-main rounded-[12px] text-[14px] text-text-main focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Enter details..."
            />
          </div>

          {/* Row 3: Category */}
          <div>
            <label className="block text-[13px] font-medium text-text-main mb-1.5">
              Category
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-surface border border-border-main rounded-[10px] text-[14px] text-text-main focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Fuel">Fuel</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Repair">Repair Work</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Row 4: Dashed Upload Box */}
          <div>
            <label className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border-main rounded-[12px] cursor-pointer bg-surface-subtle hover:bg-surface-subtle/80 transition-colors">
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <p className="text-[12px] text-text-secondary font-medium">
                  {fileName ? (
                    <span className="text-primary font-semibold">
                      {fileName}
                    </span>
                  ) : (
                    "Click here to upload your receipt / drag and drop"
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

          {/* Row 5: Centered Submit Button */}
          <div className="pt-3 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-2.5 bg-primary hover:opacity-90 text-white text-[14px] font-semibold rounded-[10px] shadow-xs transition-opacity disabled:opacity-50 cursor-pointer min-w-[150px]"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
