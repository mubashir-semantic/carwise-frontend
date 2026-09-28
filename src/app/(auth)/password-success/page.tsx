"use client";

import Image from "next/image";
import Link from "next/link";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export default function PasswordSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-subtle text-text-main">
      <Header />

      <main className="grow flex items-center justify-center py-12 sm:py-16 lg:py-20 bg-surface-subtle">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Side: Consistent Illustration Area */}
          <div className="flex justify-center items-center relative w-full py-6">
            <div className="absolute -top-4 -left-4 w-[380px] h-[380px] md:w-[450px] md:h-[450px] z-0 pointer-events-none">
              <Image
                src="/Vector.png"
                alt="Background Design"
                fill
                sizes="(max-width: 768px) 380px, 450px"
                className="object-contain"
                priority
              />
            </div>

            <div className="w-[360px] h-[360px] sm:w-[430px] sm:h-[430px] bg-blue-tint rounded-full flex items-center justify-center relative z-10 overflow-hidden shadow-xs">
              <Image
                src="/car-service-repair-illustration.png"
                alt="Car Service Illustration"
                width={350}
                height={350}
                className="object-contain z-20 mix-blend-multiply w-[350px] h-[350px]"
                priority
              />
            </div>
          </div>

          {/* Right Side: Success Message Card Area */}
          <div className="bg-surface border border-border-main/60 p-8 sm:p-10 rounded-[24px] shadow-[0_10px_35px_rgba(0,0,0,0.05)] w-full max-w-lg mx-auto md:ml-auto text-center">
            {/* Success Checkmark Circle */}
            <div className="w-16 h-16 bg-success/15 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-text-heading mb-3">
              Password Changed!
            </h1>

            <p className="text-text-secondary mb-8 text-sm leading-relaxed">
              Your password has been successfully updated. You can now log in to
              your account using your new password.
            </p>

            <div className="pt-2">
              <Link href="/login" className="w-full block">
                <Button className="w-full">Back to Login</Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
