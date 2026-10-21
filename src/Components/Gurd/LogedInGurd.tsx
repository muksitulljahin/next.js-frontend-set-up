"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/Hook/auth/useUserAuth";
import CommonLoader from "@/Components/Common/CommonLoader";

interface LogedInGurdProps {
  children: React.ReactNode;
}

/**
 * Protects public/guest routes (e.g., `/login`).
 * - Redirects already logged-in users to `/`.
 * - Shows CommonLoader while hydrating auth state from localStorage.
 */
export default function LogedInGurd({ children }: LogedInGurdProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useUserAuth();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/");
    }
  }, [isHydrated, isAuthenticated, router]);

  // Wait until auth state is rehydrated from localStorage
  if (!isHydrated) {
    return <CommonLoader  />;
  }

  // Hold render until redirect to / takes place
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
