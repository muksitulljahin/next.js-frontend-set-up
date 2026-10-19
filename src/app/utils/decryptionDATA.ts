import { FrontDecryptTokenx } from "./Decryption";

/**
 * Utility to decrypt data if the application is in production mode.
 * In development, it returns the data as-is.
 * @param data - The data to potentially decrypt (usually an encrypted string in production).
 * @returns The decrypted and parsed data, or the original data.
 */
export const isProduction =
  process.env.NEXT_PUBLIC_NODE_ENV === "production" ||
  process.env.NODE_ENV === "production";

export const DecryptData = (data: any) => {
  console.log("DEBUG [DecryptData]:", {
    isProduction,
    envNodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
    keyLength: process.env.NEXT_PUBLIC_FRONT_ENCRYPTION_KEY?.length || 0,
    dataType: typeof data,
    data,
  });

  // Decrypt if data is explicitly marked as encrypted, or if we are in production and it's a string
  const shouldDecrypt =
    (data && typeof data === "object" && data.encrypted === true) ||
    (isProduction && (typeof data === "string" || typeof data?.data === "string"));

  if (shouldDecrypt) {
    // Handle both direct string and object format { data: '...', encrypted: true }
    const encryptedString = typeof data === "string" ? data : data?.data;
    console.log("DEBUG [DecryptData] encryptedString:", encryptedString);

    if (typeof encryptedString === "string") {
      try {
        const decrypted = FrontDecryptTokenx(encryptedString);
        console.log("DEBUG [DecryptData] decrypted result:", decrypted);
        if (decrypted) {
          // Attempt to parse if it's a JSON string
          try {
            return JSON.parse(decrypted);
          } catch {
            return decrypted;
          }
        } else {
          console.error("❌ Decryption failed: Decrypted output is null. Check your NEXT_PUBLIC_FRONT_ENCRYPTION_KEY.");
          return null; // Return null to prevent passing encrypted string to UI mapping functions
        }
      } catch (error) {
        console.error("Decryption utility error:", error);
        return null;
      }
    }
  }

  // Always unwrap the { data, encrypted } response format if present
  if (
    data &&
    typeof data === "object" &&
    "encrypted" in data &&
    "data" in data
  ) {
    return data.data;
  }

  return data;
};
