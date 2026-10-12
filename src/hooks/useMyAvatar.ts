"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

// Logged-in user ka apna avatar (photo ya naam ke initials, jaise SR)
export function useMyAvatar() {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!localStorage.getItem("accessToken")) return;
      try {
        const res = await api.get("/users/profile");
        const user = res.data?.user || res.data;
        if (!user || !active) return;

        const name = user.username || user.name || "User";
        setAvatar(
          user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name,
            )}&background=f5924a&color=fff&bold=true`,
        );
      } catch (error) {
        console.error("Error fetching profile avatar:", error);
      }
    };

    const timer = setTimeout(load, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  return avatar;
}
