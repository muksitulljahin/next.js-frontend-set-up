import { API } from "@/API/ROOT_API";
import api from "./useAxios";

export interface LoginPayload {
  emailOrPhone: string;
  password: string;
}

// --- Admin Auth ---
export const loginUser = async (payload: LoginPayload) => {
  const res = await api.post(API.USER_LOGIN, payload);
  return res?.data;
};

// Alias for backwards compatibility
export const useUserLogin = loginUser;

export const getUserInfo = async () => {
  const res = await api.get(API.USER_PROFILE);
  return res?.data?.data;
};
