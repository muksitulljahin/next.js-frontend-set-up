/**
 * Represents the essential authentication details of an admin / user.
 */
export interface AuthUser {
  id?: number | string;
  _id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  phone?:
    | string
    | {
        number: string;
        countryCode: string;
        isVerified?: boolean;
      };
  picture?: string;
  role: string;
  createdAt?: string;
}

export interface ClientProfile {
  id?: number | string;
  _id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  picture?: string;
  role: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Legacy alias
export type UserProfile = ClientProfile;
export type AdminProfile = ClientProfile;
