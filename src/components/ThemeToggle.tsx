"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Modern React way to check client mount without triggering ESLint cascading render warning
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div className="w-9 h-9" />; // SSR Placeholder spacing
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-[10px] flex items-center justify-center border border-border-main bg-surface text-text-main hover:text-primary hover:border-primary/40 transition-colors cursor-pointer shadow-2xs"
      aria-label="Toggle Theme"
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
    >
      {isDark ? (
        <FiSun size={18} className="text-warning transition-transform" />
      ) : (
        <FiMoon
          size={18}
          className="text-text-secondary transition-transform"
        />
      )}
    </button>
  );
}
