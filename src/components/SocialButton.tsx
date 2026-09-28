import React from "react";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

export default function SocialButton({
  icon,
  className = "",
  ...props
}: SocialButtonProps) {
  return (
    <button
      {...props}
      className={`flex justify-center items-center py-2.5 h-11 border border-border-main bg-surface rounded-[10px] hover:bg-surface-subtle hover:border-primary/40 transition-all duration-200 w-full cursor-pointer shadow-2xs ${className}`}
    >
      {icon}
    </button>
  );
}
