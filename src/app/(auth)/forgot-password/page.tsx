"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/utilities/validations";
import { useRouter } from "next/navigation"; // <-- Router import kiya
import api from "@/services/api"; // <-- API service import ki
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import AuthLink from "@/components/AuthLink";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // <-- Router initialize kiya

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // 1. Asli API Call for Forgot Password
      const response = await api.post("/auth/forgot-password", {
        email: data.email,
      });

      // 2. Success Toast
      toast.success(response.data.message || "OTP sent to your email!");
      reset();

      // 3. Redirect to Reset Password page aur email URL mein pass kar di
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      // 4. Error Handling
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to send OTP. Please try again.";
      toast.error(errorMessage || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-25">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
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

          <div className="bg-white p-10 rounded-2xl shadow-sm w-full max-w-lg ml-auto">
            <h1 className="text-3xl font-bold text-black mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Don&apos;t worry! Enter your registered email address below and we
              will send you an OTP to reset your password.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-6"
            >
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 px-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-sm text-center">
              <p className="text-gray-600">
                Remember your password?{" "}
                <AuthLink href="/login">Back to Login</AuthLink>
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
