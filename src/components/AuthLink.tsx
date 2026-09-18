import Link, { LinkProps } from "next/link";
import React from "react";

interface AuthLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuthLink({
  children,
  className = "",
  ...props
}: AuthLinkProps) {
  return (
    <Link
      {...props}
      className={`font-semibold text-text-heading hover:text-primary underline underline-offset-4 transition-colors duration-200 cursor-pointer ${className}`}
    >
      {children}
    </Link>
  );
}
