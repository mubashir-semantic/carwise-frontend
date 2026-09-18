import React from "react";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FloatingInput({ label, ...props }: FloatingInputProps) {
  return (
    <div className="relative w-full">
      {/* Actual Input Field */}
      <input
        {...props}
        className="w-full bg-surface border border-border-main rounded-[12px] px-4 py-3.5 text-text-main text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors peer"
        placeholder=" "
      />

      {/* Floating Label */}
      <label className="absolute left-3 -top-2.5 bg-surface px-1.5 text-xs text-text-muted peer-focus:text-primary transition-colors pointer-events-none">
        {label}
      </label>
    </div>
  );
}
