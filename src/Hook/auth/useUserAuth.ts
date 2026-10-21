"use client";

import { AuthUser, ClientProfile } from "../../type/auth/user.type";
import { useAuthStore } from "@/Store/useAuthStore";
import { getUserInfo } from "./AuthDataHub";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserAuth = () => {
  const queryClient = useQueryClient();
  const {
    accessToken,
    isHydrated,
    user: localUser,
    setAuth: storeSetAuth,
    clearAuth,
  } = useAuthStore();

  const {
    data: remoteUser,
    isLoading: isRemoteLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["user-info"],
    queryFn: getUserInfo,
    enabled: isHydrated && !!accessToken,
    retry: 1, // Retry once to allow interceptor or token check
    refetchOnWindowFocus: false,
  });

  const setAuth = async (data: {
    user: AuthUser;
    tokens: { accessToken: string; refreshToken?: string | null };
  }) => {
    storeSetAuth(
      data.user,
      data.tokens.accessToken,
      data.tokens.refreshToken || null
    );
    await queryClient.invalidateQueries({ queryKey: ["user-info"] });
  };

  const logout = async () => {
    clearAuth();
    queryClient.setQueryData(["user-info"], null);
    await queryClient.removeQueries({ queryKey: ["user-info"] });
  };

  const clientInfo = (remoteUser as ClientProfile | null) || (localUser as ClientProfile | null);
  const email = clientInfo?.email || localUser?.email;
  const phoneNumber = clientInfo?.phoneNumber || localUser?.phoneNumber;

  const clientFullName =
    clientInfo?.name ||
    `${clientInfo?.firstName || ""} ${clientInfo?.lastName || ""}`.trim() ||
    localUser?.name ||
    `${localUser?.firstName || ""} ${localUser?.lastName || ""}`.trim() ||
    "Admin";

  const contactInfo = email || phoneNumber || "No contact info";
  const role = clientInfo?.role || localUser?.role || "admin";
  const clientId = clientInfo?.id || clientInfo?._id || localUser?.id || localUser?._id;

  const isAuthenticated = isHydrated && !!accessToken;

  return {
    clientInfo,
    clientId,
    accessToken,
    firstName: clientInfo?.firstName || localUser?.firstName,
    lastName: clientInfo?.lastName || localUser?.lastName,
    phoneNumber,
    email,
    address: clientInfo?.address || localUser?.address,
    role,
    clientFullName,
    contactInfo,
    localUser,
    isLoading: isRemoteLoading,
    isSettled: isHydrated && !isRemoteLoading,
    isAuthenticated,
    isError,
    setAuth,
    logout,
    refetch,
    isHydrated,
  };
};
