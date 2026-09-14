"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpFormValues } from "@/utilities/validations";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast"; // <-- Toast Import kiya

import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import OtpInput from "@/components/OtpInput";
import AuthLink from "@/components/AuthLink";

// 1. OTP Form Component (Jisme API Logic hai)
function OTPForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // REAL API CALL FOR VERIFY OTP
  const onSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        email,
        otp: data.otp,
      });

      toast.success("OTP Verified Successfully! Please login.");
      // YEH LINE AAPKO LOGIN PAR REDIRECT KAREGI
      router.push("/login");
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Invalid or expired OTP.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // REAL API CALL FOR RESEND OTP
  const handleResend = async () => {
    if (!email) {
      toast.error("Email is missing. Please signup again.");
      return;
    }

    setIsResending(true);
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("A new OTP has been sent to your email.");
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to resend OTP.";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-sm w-full max-w-lg ml-auto">
      <h1 className="text-3xl font-bold text-black mb-2">Verify your email</h1>
      <p className="text-gray-500 mb-8 text-sm leading-relaxed">
        We have sent a 6-digit OTP to{" "}
        <span className="font-semibold text-black">
          {email || "your registered email address"}
        </span>
        . Please enter it below to verify your account.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        <div className="flex flex-col w-full">
          <Controller
            name="otp"
            control={control}
            render={({ field: { onChange, value } }) => (
              <OtpInput length={6} value={value} onChange={onChange} />
            )}
          />

          {errors.otp && (
            <p className="text-red-500 text-xs mt-3 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </form>

      <div className="mt-8 text-sm text-gray-600 text-center">
        <p>Didn&apos;t receive the code?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="mt-2 font-bold text-black hover:text-brandOrange transition-colors duration-200"
        >
          {isResending ? "Sending..." : "Resend OTP"}
        </button>
      </div>

      <div className="mt-6 text-center">
        <AuthLink href="/login">Back to Login</AuthLink>
      </div>
    </div>
  );
}

// 2. MAIN PAGE COMPONENT
export default function OTPPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-25">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Side: Consistent Illustration Area */}
          <div className="flex justify-center items-center relative w-full py-10">
            <div className="absolute -top-3 -left-4 w-[400px] h-[400px] md:w-[450px] md:h-[450px] z-0">
              <Image
                src="/Vector.png"
                alt="Background Design"
                fill
                sizes="(max-width: 768px) 400px, 450px"
                className="object-contain"
                priority
              />
            </div>
            <div className="w-[470px] h-[470px] bg-lightBlue rounded-full flex items-center justify-center relative z-10">
              <Image
                src="/car-service-repair-illustration.png"
                alt="Car Service Illustration"
                width={360}
                height={360}
                className="object-contain z-20 w-[360px] h-[360px]"
                priority
              />
            </div>
          </div>

          {/* Right Side: Suspense Boundary for useSearchParams */}
          <Suspense
            fallback={
              <div className="flex justify-center items-center w-full max-w-lg ml-auto h-64 text-gray-500">
                Loading form...
              </div>
            }
          >
            <OTPForm />
          </Suspense>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
