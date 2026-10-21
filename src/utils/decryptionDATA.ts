import { FrontDecryptTokenx } from "./Decryption";

/**
 * Utility to decrypt data if the application is in production mode.
 * In development, it returns the data as-is.
 * @param data - The data to potentially decrypt (usually an encrypted string in production).
 * @returns The decrypted and parsed data, or the original data.
 */
export const DecryptData = <T = unknown>(data: T): unknown => {
  const isProduction =
    process.env.NEXT_PUBLIC_NODE_ENV === "production" ||
    process.env.NODE_ENV === "production";

  const dataRecord =
    data && typeof data === "object"
      ? (data as Record<string, unknown>)
      : null;

  // Decrypt if data is explicitly marked as encrypted, or if we are in production and it's a string
  const shouldDecrypt =
    (dataRecord !== null && dataRecord.encrypted === true) ||
    (isProduction &&
      (typeof data === "string" || typeof dataRecord?.data === "string"));

  if (shouldDecrypt) {
    // Handle both direct string and object format { data: '...', encrypted: true }
    const encryptedString =
      typeof data === "string" ? data : (dataRecord?.data as string | undefined);

    if (typeof encryptedString === "string") {
      try {
        const decrypted = FrontDecryptTokenx(encryptedString);
        if (decrypted) {
          // Attempt to parse if it's a JSON string
          try {
            return JSON.parse(decrypted);
          } catch {
            return decrypted;
          }
        } else {
          console.error(
            "❌ Decryption failed: Decrypted output is null. Check your NEXT_PUBLIC_FRONT_ENCRYPTION_KEY."
          );
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
    dataRecord !== null &&
    "encrypted" in dataRecord &&
    "data" in dataRecord
  ) {
    return dataRecord.data;
  }

  return data;
};
