import React from "react";

// Professional Type Definition for Input Props
interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FloatingInput({ label, ...props }: FloatingInputProps) {
  return (
    <div className="relative w-full">
      {/* Actual Input Field */}
      <input
        {...props}
        className="w-full border border-gray-300 rounded-[12px] px-4 py-3.5 text-gray-800 text-sm focus:outline-none focus:border-[#ff904d] focus:ring-1 focus:ring-[#ff904d] transition-colors peer"
        placeholder=" " // Space is important for the floating CSS trick
      />

      {/* Floating Label (Figma design ke mutabiq border ke upar) */}
      <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-400 peer-focus:text-[#ff904d] transition-colors">
        {label}
      </label>
    </div>
  );
}
