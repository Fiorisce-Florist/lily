"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  // useSyncExternalStore is the correct way to handle SSR hydration without
  // triggering a setState-in-effect. The server snapshot returns false;
  // the client snapshot returns true — no useEffect needed.
  const mounted = React.useSyncExternalStore(
    () => () => {}, // no external store to subscribe to
    () => true, // client: always mounted
    () => false // server: not yet mounted
  );

  // Sleek skeleton to match the new shape
  if (!mounted) {
    return (
      <div className="relative inline-flex h-8 w-15 shrink-0 rounded-full bg-cornsilk-200 dark:bg-neutral-800 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative inline-flex h-8 w-15 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950",
        isDark ? "bg-neutral-800 hover:bg-neutral-700" : "bg-cornsilk-300 hover:bg-cornsilk-400"
      )}
    >
      {/* Background Track Icons */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5">
        <Sun className="h-3.5 w-3.5 text-white dark:text-neutral-600 transition-colors" />
        <Moon className="h-3.5 w-3.5 text-cornsilk-500 dark:text-neutral-500 transition-colors" />
      </span>

      {/* Sliding Thumb */}
      <span
        className={cn(
          "pointer-events-none relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-sm ring-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isDark
            ? "translate-x-8 bg-neutral-950 shadow-black/50"
            : "translate-x-0.5 bg-white shadow-cornsilk-500/50"
        )}
      >
        {/* Animated Sun Icon inside thumb */}
        <Sun
          className={cn(
            "absolute h-3.5 w-3.5 transition-all duration-500 ease-in-out text-blush-500",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
        />

        {/* Animated Moon Icon inside thumb */}
        <Moon
          className={cn(
            "absolute h-3.5 w-3.5 transition-all duration-500 ease-in-out text-cornsilk-100",
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </span>
    </button>
  );
}
