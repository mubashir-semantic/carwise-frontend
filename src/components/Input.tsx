"use client";

import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={inputType}
          {...props}
          className={`border-b border-border-main pb-2.5 bg-transparent outline-none focus:border-primary text-sm text-text-main placeholder:text-text-muted transition-colors w-full ${
            isPassword ? "pr-8" : ""
          } ${className || ""}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 bottom-2.5 text-text-muted hover:text-primary focus:outline-none transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <MdVisibilityOff size={18} />
            ) : (
              <MdVisibility size={18} />
            )}
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
