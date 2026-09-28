import React from "react";
import Link from "next/link";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import Container from "@/components/Container";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="bg-header-bg text-white w-full sticky top-0 z-30 shadow-xs">
      <Container className="py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <Link
          href="/dashboard"
          className="text-2xl sm:text-3xl text-primary font-bold tracking-wide shrink-0"
        >
          CarWise
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8 lg:space-x-10 text-[15px] font-normal text-white/90">
          <Link href="/" className="hover:text-primary transition-colors">
            Front
          </Link>
          <Link href="/menu" className="hover:text-primary transition-colors">
            Menu
          </Link>
          <Link href="/order" className="hover:text-primary transition-colors">
            Order
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-5 sm:space-x-6">
          <button className="bg-primary text-white px-5 sm:px-6 py-2 rounded-[8px] font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-2xs">
            Get The App
          </button>
          <button
            type="button"
            className="cursor-pointer text-white/90 hover:text-primary transition-colors p-1"
            aria-label="Shopping Cart"
          >
            <FaShoppingCart size={19} />
          </button>
          <button
            type="button"
            className="cursor-pointer text-white/90 hover:text-primary transition-colors p-1"
            aria-label="User Account"
          >
            <FaUser size={19} />
          </button>
          <ThemeToggle/>
        </div>
      </Container>
    </header>
  );
}
