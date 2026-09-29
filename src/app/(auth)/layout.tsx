"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // Agar token mil gaya (user logged in hai), toh seedha dashboard bhej do
      router.replace("/dashboard");
    } else {
      // Agar token nahi hai, toh login/signup page allow karo
      // setTimeout is liye taake ESLint ki warning na aaye (jese pehle aayi thi)
      setTimeout(() => {
        setIsChecking(false);
      }, 0);
    }
  }, [router]);

  // Jab tak token check ho raha hai, screen block rakhein (flash se bachne ke liye)
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Agar user logged in nahi hai, toh login ya signup page render kardo
  return <>{children}</>;
}
