import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { DecryptData } from "@/app/utils/decryptionDATA";

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const authorization = useAuthStore.getState().accessToken;
    const refreshToken = useAuthStore.getState().refreshToken;
    if (authorization) {
      config.headers.Authorization = `Bearer ${authorization}`;
    }
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle token expiration and decrypt data
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      response.data.data = DecryptData(response.data.data);
      console.log("response", response.data.data);
    }
    return response;
  },
  async (error) => {
    const errorData = error.response?.data as any;
    if (error.response?.status === 401 || errorData?.code === "TOKEN_EXPIRED") {
      useAuthStore.getState().clearAuth();
    }

    // Optional: Log errors that aren't 401 for debugging
    if (error.response?.status !== 401) {
      console.error("API Error:", errorData || error.message);
    }

    return Promise.reject(error);
  },
);

/**
 * Custom Axios instance configured for the application.
 * Highlights:
 * - Base URL is set from environment variables.
 * - Request Interceptor: Injects `Authorization` and `x-refresh-token` headers using the auth store.
 * - Response Interceptor: Listens for 401 Unauthorized errors or "TOKEN_EXPIRED" codes to automatically log the user out.
 */
export default api;
