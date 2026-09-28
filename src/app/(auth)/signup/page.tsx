"use client";

import { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "@/utilities/validations";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import Input from "@/components/Input";
import Button from "@/components/Button";
import SocialButton from "@/components/SocialButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import AuthLink from "@/components/AuthLink";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      await api.post("/auth/signup", {
        username: data.username,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
      });

      toast.success("Signup Successful! Please check your email for the OTP.");
      router.push(`/otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Signup failed. Please try again.";

      toast.error(errorMessage || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-subtle text-text-main">
      <Header />

      {/* Main Container with Soft Background */}
      <main className="grow flex items-center justify-center py-12 sm:py-16 lg:py-20 bg-surface-subtle">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Side: Illustration Area */}
          <div className="flex justify-center items-center relative w-full py-6">
            {/* Background Blob */}
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

            {/* Light Blue Accent Circle */}
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

          {/* Right Side: White Card with Shadow */}
          <div className="bg-surface border border-border-main/60 p-8 sm:p-10 rounded-[24px] shadow-[0_10px_35px_rgba(0,0,0,0.05)] w-full max-w-lg mx-auto md:ml-auto">
            <h1 className="text-3xl font-bold text-text-heading mb-2">
              Create an account
            </h1>
            <p className="text-text-secondary mb-7 text-sm">
              Lets get started with us.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-4"
              autoComplete="off"
            >
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  autoComplete="off"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-error text-xs mt-1.5 px-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="tel"
                  placeholder="Mobile number"
                  autoComplete="off"
                  {...register("mobile")}
                />
                {errors.mobile && (
                  <p className="text-error text-xs mt-1.5 px-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="new-email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-error text-xs mt-1.5 px-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-error text-xs mt-1.5 px-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-error text-xs mt-1.5 px-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="pt-3">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Get OTP"}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="grow border-border-main" />
              <span className="px-3 text-text-muted text-xs">or</span>
              <hr className="grow border-border-main" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-3.5">
              <SocialButton icon={<FcGoogle size={22} />} />
              <SocialButton
                icon={<FaFacebook size={22} className="text-[#1877f2]" />}
              />
              <SocialButton
                icon={<FaInstagram size={22} className="text-[#e4405f]" />}
              />
            </div>

            <p className="text-center mt-7 text-[13px] text-text-secondary">
              Already have an account? <AuthLink href="/login">Log in</AuthLink>
            </p>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
