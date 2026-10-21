import { AuthUser } from "@/type/auth/user.type";

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setAuth: (user: AuthUser, accessToken: string, refreshToken?: string | null) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}
