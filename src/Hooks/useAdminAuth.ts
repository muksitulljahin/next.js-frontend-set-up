"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthUser, UserProfile } from "./user.type";
import { getAdminInfo } from "./AuthDataHub";

/**
 * Custom hook for managing user authentication state and remote data fetching.
 * It uses TanStack Query to fetch remote user info if tokens are present,
 * and interacts with the Zustand `useAuthStore` for local token storage.
 *
 * @returns An object containing user info, authentication status, and methods to set auth or logout.
 */
export const useAdminAuth = () => {
  const queryClient = useQueryClient();
  const {
    accessToken,
    refreshToken,
    isHydrated,
    user: localUser,
    setAuth: storeSetAuth,
    clearAuth,
  } = useAuthStore();

  const {
    data: adminData,
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["user-info"],
    queryFn: getAdminInfo,
    // Enable if we have a refresh token OR an access token
    enabled: isHydrated && (!!accessToken || !!refreshToken),
    retry: 1, // Retry once to allow interceptor to refresh token
    refetchOnWindowFocus: false,
  });

  /**
   * Updates the authentication state with new user details and tokens.
   * Also invalidates the "user-info" query to refetch fresh data.
   *
   * @param data - Object containing the authenticated user and their tokens (access & refresh).
   */
  const setAuth = async (data: {
    user: AuthUser;
    tokens: { accessToken: string; refreshToken: string };
  }) => {
    storeSetAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken);
    await queryClient.invalidateQueries({ queryKey: ["user-info"] });
  };

  /**
   * Clears the user's authentication state, removes cached user info,
   * and optionally redirects the user to the home page.
   *
   * @param shouldRedirect - If true, redirects the user to the root path ('/').
   */
  const logout = async (shouldRedirect = false) => {
    clearAuth();
    // Clear query cache and then refetch to ensure the unauthenticated state is recognized
    queryClient.setQueryData(["user-info"], null);
    await refetch();

    if (shouldRedirect) {
      window.location.href = "/join";
    }
  };

  return {
    localUser,
    isLoading,
    isAuthenticated: !!adminData,
    isError,
    setAuth,
    logout,
    refetch,
    isHydrated,
  };
};
