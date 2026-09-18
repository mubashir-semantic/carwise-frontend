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
import api from "@/services/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import AuthLink from "@/components/AuthLink";

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

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
      const response = await api.post("/auth/reset-password", {
        email: email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      toast.success(response.data?.message || "Password reset successfully!");
      reset();
      router.push("/password-success");
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to reset password. Please try again.";
      toast.error(errorMessage || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border-main/60 p-8 sm:p-10 rounded-[24px] shadow-[0_10px_35px_rgba(0,0,0,0.05)] w-full max-w-lg mx-auto md:ml-auto">
      <h1 className="text-3xl font-bold text-text-heading mb-2">
        Set new password
      </h1>
      <p className="text-text-secondary mb-8 text-sm leading-relaxed">
        Please enter the 6-digit OTP sent to{" "}
        <span className="font-semibold text-text-heading">
          {email || "your email"}
        </span>{" "}
        and your new password below.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-5"
      >
        <div>
          <Input
            type="text"
            placeholder="6-Digit OTP"
            maxLength={6}
            {...register("otp")}
          />
          {errors.otp && (
            <p className="text-error text-xs mt-1.5 px-1">
              {errors.otp.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="New Password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-error text-xs mt-1.5 px-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Confirm New Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-error text-xs mt-1.5 px-1">
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

export default function ResetPasswordPage() {
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

          {/* Right Side: Suspense Boundary for useSearchParams */}
          <Suspense
            fallback={
              <div className="flex justify-center items-center w-full max-w-lg ml-auto h-64 text-text-muted">
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
