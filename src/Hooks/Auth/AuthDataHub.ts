import api from "./axiosinstance";

/**
 * API methods handling user login flows, OTP validation, profile completions, and info fetching.
 * Workflow: Exports direct Axios post/get wrappers targeting the `/user` boundary on the backend.
 */
export const useAdminLogin = async (payload: { phone: string }) => {
  const res = await api.post("/user/request-otp", payload);
  return res?.data;
};

// --- Admin Auth ---
export const adminLogin = async (payload: {
  email?: string;
  phoneNumber?: string;
  password?: string;
}) => {
  const res = await api.post("/admins/login", payload);
  return res?.data;
};

export const adminRequestOtp = async (payload: {
  email?: string;
  phone?: string;
  countryCode: string;
}) => {
  const res = await api.post("/admin/request-otp", payload);
  return res?.data;
};

export const verifyAdminOtp = async (otp: string) => {
  const res = await api.post("/admins/verify-otp", { otp });
  return res?.data;
};

export const adminVerifyOtp = async (payload: {
  email?: string;
  phone?: string;
  countryCode: string;
  otp: string;
}) => {
  const res = await api.post("/admins/verify-otp", payload);
  return res?.data;
};
export const useAdminVerify = async (payload: {
  phone: string;
  otp: string;
  firstName?: string;
  lastName?: string;
  referralCode?: string;
}) => {
  const res = await api.post("/user/verify-otp", payload);
  return res?.data;
};

export const getAdminInfo = async () => {
  const res = await api.get("/admins/profile");
  return res?.data?.data;
};

export const useUpdateAdminInfo = async (payload: {
  firstName: string;
  lastName: string;
  gender: string;
  referralCode?: string;
}) => {
  const res = await api.post("/user/complete-profile", payload);
  return res?.data;
};

export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard-stats");
  return res?.data?.data;
};
