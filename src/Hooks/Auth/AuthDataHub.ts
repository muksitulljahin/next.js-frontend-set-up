import api from "./axiosinstance";

export const useUserLogin = async (payload: { phone: string }) => {
  const res = await api.post("/user/request-otp", payload);
  return res?.data;
};

// --- User Auth ---
export const UserLogin = async (payload: {
  email?: string;
  phoneNumber?: string;
  password?: string;
}) => {
  const res = await api.post("/Users/login", payload);
  return res?.data;
};

export const UserRequestOtp = async (payload: {
  email?: string;
  phone?: string;
  countryCode: string;
}) => {
  const res = await api.post("/User/request-otp", payload);
  return res?.data;
};

export const verifyUserOtp = async (otp: string) => {
  const res = await api.post("/Users/verify-otp", { otp });
  return res?.data;
};

export const UserVerifyOtp = async (payload: {
  email?: string;
  phone?: string;
  countryCode: string;
  otp: string;
}) => {
  const res = await api.post("/Users/verify-otp", payload);
  return res?.data;
};
export const useUserVerify = async (payload: {
  phone: string;
  otp: string;
  firstName?: string;
  lastName?: string;
  referralCode?: string;
}) => {
  const res = await api.post("/user/verify-otp", payload);
  return res?.data;
};

export const getUserInfo = async () => {
  const res = await api.get("/Users/profile");
  return res?.data?.data;
};

export const useUpdateUserInfo = async (payload: {
  firstName: string;
  lastName: string;
  gender: string;
  referralCode?: string;
}) => {
  const res = await api.post("/user/complete-profile", payload);
  return res?.data;
};

export const getDashboardStats = async () => {
  const res = await api.get("/User/dashboard-stats");
  return res?.data?.data;
};
