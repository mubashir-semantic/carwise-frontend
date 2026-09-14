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
import toast from "react-hot-toast"; // <-- Toast Import kiya

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

      // <-- Alert ki jagah Toast laga diya
      toast.success("Signup Successful! Please check your email for the OTP.");
      router.push(`/otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Signup failed. Please try again.";

      // <-- Error Alert ki jagah bhi Toast laga diya
      toast.error(errorMessage || "Signup failed. Please try again.");
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

          <div className="bg-white p-10 rounded-2xl shadow-sm w-full max-w-lg ml-auto">
            <h1 className="text-3xl font-bold text-black mb-2">
              Create an account
            </h1>
            <p className="text-gray-500 mb-8 text-sm">
              Lets get started with us.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-5"
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
                  <p className="text-red-500 text-xs mt-1.5 px-1">
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
                  <p className="text-red-500 text-xs mt-1.5 px-1">
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
                  <p className="text-red-500 text-xs mt-1.5 px-1">
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
                  <p className="text-red-500 text-xs mt-1.5 px-1">
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
                  <p className="text-red-500 text-xs mt-1.5 px-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Get OTP"}
                </Button>
              </div>
            </form>

            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-200" />
              <span className="px-3 text-gray-400 text-xs">or</span>
              <hr className="flex-grow border-gray-200" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <SocialButton icon={<FcGoogle size={22} />} />
              <SocialButton
                icon={<FaFacebook size={22} className="text-blue-600" />}
              />
              <SocialButton
                icon={<FaInstagram size={22} className="text-pink-600" />}
              />
            </div>

            <p className="text-center mt-8 text-sm text-gray-600">
              Already have an account? <AuthLink href="/login">Log in</AuthLink>
            </p>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
