/**
 * Represents the essential authentication details of a user.
 * Used for basic session management and identifying the current logged-in user.
 */
export interface AuthUser {
  _id: string;
  phone:
    | string
    | {
        number: string;
        countryCode: string;
        isVerified?: boolean;
      };
  firstName?: string;
  lastName?: string;
  email?: string;
  role: string;
}

/**
 * Represents the complete profile of a user, extending the basic AuthUser.
 * Includes additional metadata such as referral info, permissions, and status.
 */
export interface UserProfile extends AuthUser {
  email?: string;
  profilePhoto?: any;
  createdAt?: string;
  updatedAt?: string;
  profileImage?: string;
}

/**
 * Represents the summary statistics displayed on the admin dashboard.
 */
