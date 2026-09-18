import React from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import Container from "@/components/Container";

export default function Footer() {
  return (
    <footer className="bg-header-bg text-white w-full border-t border-border-main/20">
      <Container className="pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <div className="text-3xl text-primary font-bold tracking-wide mb-2">
              CarWise
            </div>
            <p className="text-sm font-normal text-white/70 mb-7 max-w-sm leading-relaxed">
              Leverandør av maskiner og forbruksartikler til bedrifter som
              arbeider med Miljøsanering-og Asbestsanering.
            </p>
            <div className="flex flex-col space-y-3 text-sm font-normal text-white/80">
              <div className="flex items-center space-x-3">
                <FaEnvelope size={15} className="text-primary" />
                <span>bildialog@yahoocmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt size={15} className="text-primary" />
                <span>Bergen, Norway</span>
              </div>
            </div>
          </div>

          {/* Pages Links */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-[17px] mb-5 text-white">Pages</h3>
            <ul className="flex flex-col space-y-3 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Front
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-primary transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="hover:text-primary transition-colors"
                >
                  Order
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-4">
            <h3 className="font-semibold text-[17px] mb-5 text-white">
              Company
            </h3>
            <ul className="flex flex-col space-y-3 text-sm text-white/70">
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="hover:text-primary transition-colors"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Term of use
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  className="hover:text-primary transition-colors"
                >
                  Career
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-white/60 gap-4">
          <p>© 2026 CarWise | Powered by CarWise</p>
          <div className="flex space-x-3.5">
            <a
              href="#"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:text-primary hover:border-primary transition-colors"
            >
              <FaFacebook size={14} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:text-primary hover:border-primary transition-colors"
            >
              <FaInstagram size={14} />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
