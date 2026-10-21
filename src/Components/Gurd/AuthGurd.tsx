"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/Hook/auth/useUserAuth";
import CommonLoader from "@/Components/Common/CommonLoader";

interface AuthGurdProps {
  children: React.ReactNode;
}

export default function AuthGurd({ children }: AuthGurdProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useUserAuth();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);


  if (!isHydrated) {
    return <CommonLoader  />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
