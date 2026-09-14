"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/utilities/validations";
import { useRouter } from "next/navigation";
import api from "@/services/api"; // <-- API import ki
import { isAxiosError } from "axios"; // <-- Error handling ke liye
import toast from "react-hot-toast";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import AuthLink from "@/components/AuthLink";

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);

    try {
      // 1. LocalStorage se JWT token get karein
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("You are not logged in. Please log in first.");
        router.push("/login");
        return;
      }

      // 2. Asli API Call for Change Password (Token headers mein bhej rahe hain)
      const response = await api.post(
        "/auth/change-password",
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // <-- Protected route ke liye zaroori
          },
        },
      );

      // 3. Success Toast & Form Reset
      toast.success(response.data.message || "Password changed successfully!");
      reset();

      // Optional: Agar password change hone ke baad kisi khaas page par bhejna ho
      // router.push("/password-success");
    } catch (error) {
      // 4. Error Handling (e.g. Incorrect old password)
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to change password. Please try again.";

      toast.error(errorMessage || "Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-25">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Side: Consistent Illustration Area */}
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

          {/* Right Side: Change Password Form Area */}
          <div className="bg-white p-10 rounded-2xl shadow-sm w-full max-w-lg ml-auto">
            <h1 className="text-3xl font-bold text-black mb-2">
              Change Password
            </h1>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Please enter your current password and a new secure password
              below.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-6"
            >
              {/* Old Password */}
              <div>
                <Input
                  type="password"
                  placeholder="Old Password"
                  {...register("oldPassword")}
                />
                {errors.oldPassword && (
                  <p className="text-red-500 text-xs mt-1.5 px-1">
                    {errors.oldPassword.message}
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

              {/* Confirm New Password */}
              <div>
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  {...register("confirmNewPassword")}
                />
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-xs mt-1.5 px-1">
                    {errors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-sm text-center">
              <AuthLink href="/login">Back to Login</AuthLink>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
