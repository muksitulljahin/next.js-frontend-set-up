import { AuthState } from "@/type/auth/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Global Zustand store to manage user authentication state.
 * It persists the state to `localStorage` to keep the user logged in across page reloads.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isHydrated: false,
      setAuth: (user, accessToken, refreshToken = null) => {
        if (typeof window !== "undefined") {
          const fullName =
            user?.name ||
            `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
          document.cookie = `NEXT_STUDENT_NAME=${encodeURIComponent(fullName)}; path=/; max-age=31536000`;
        }
        set({ user, accessToken, refreshToken: refreshToken || null });
      },
      clearAuth: () => {
        if (typeof window !== "undefined") {
          document.cookie =
            "NEXT_STUDENT_NAME=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        set({ user: null, accessToken: null, refreshToken: null });
      },
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
