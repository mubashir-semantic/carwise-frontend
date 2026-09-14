"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/utilities/validations";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api"; // <-- API import ki
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import AuthLink from "@/components/AuthLink";

// 1. Alag Form Component banaya taake useSearchParams seamlessly kaam kare
function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // URL se email get karne ke liye
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!email) {
      toast.error("Email is missing. Please go back to forgot password page.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Asli API Call for Reset Password
      const response = await api.post("/auth/reset-password", {
        email: email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      // 2. Success Toast & Reset Form
      toast.success(response.data.message || "Password reset successfully!");
      reset();

      // 3. Success Page par redirect
      router.push("/password-success");
    } catch (error) {
      // 4. Error Handling
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to reset password. Please try again.";
      toast.error(errorMessage || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-sm w-full max-w-lg ml-auto">
      <h1 className="text-3xl font-bold text-black mb-2">Set new password</h1>
      <p className="text-gray-500 mb-8 text-sm leading-relaxed">
        Please enter the 6-digit OTP sent to{" "}
        <span className="font-semibold text-black">{email}</span> and your new
        password below.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        {/* OTP Field (Nayi add ki hai) */}
        <div>
          <Input
            type="text"
            placeholder="6-Digit OTP"
            maxLength={6}
            {...register("otp")}
          />
          {errors.otp && (
            <p className="text-red-500 text-xs mt-1.5 px-1">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <Input
            type="password"
            placeholder="New Password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1.5 px-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Input
            type="password"
            placeholder="Confirm New Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1.5 px-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>

      <div className="mt-8 text-sm text-center">
        <AuthLink href="/login">Back to Login</AuthLink>
      </div>
    </div>
  );
}

// 2. MAIN PAGE COMPONENT
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-25">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Side: Illustration Area */}
          <div className="flex justify-center items-center relative w-full py-10">
            <div className="absolute top-4 -left-4 w-[400px] h-[400px] md:w-[450px] md:h-[450px] z-0">
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

          {/* Right Side: Form with Suspense Boundary */}
          <Suspense
            fallback={
              <div className="flex justify-center items-center w-full max-w-lg ml-auto h-64 text-gray-500">
                Loading form...
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
