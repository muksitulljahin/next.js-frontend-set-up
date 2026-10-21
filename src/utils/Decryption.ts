import CryptoJS from "crypto-js";

// --- Constants ---
const ENCRYPTION_KEY_GET = process.env.NEXT_PUBLIC_FRONT_ENCRYPTION_KEY;

const IV_LENGTH = 20;

/**
 * Retrieves the encryption key from environment variables.
 * Parses it securely using CryptoJS Utf8 for use in AES encryption/decryption.
 * @returns The parsed CryptoJS WordArray key or null if missing/invalid.
 */
const getEncryptionKey = () => {
  if (!ENCRYPTION_KEY_GET) {
    console.warn(
      "⚠️ Missing NEXT_PUBLIC_FRONT_ENCRYPTION_KEY environment variable.",
    );
    return null;
  }
  try {
    return CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY_GET);
  } catch (err) {
    console.error("❌ Failed to parse ENCRYPTION_KEY:", err);
    return null;
  }
};

// --- Encryption ---
/**
 * Encrypts a string token using AES-CBC encryption.
 * It generates a random Initialization Vector (IV), encrypts the payload,
 * and returns a Base64 encoded string combining both IV and ciphertext.
 *
 * @param token - The raw string data to execute encryption on.
 * @returns Base64 encoded encrypted token, or null if encryption fails.
 */
export const FrontEncryptToken = (token: string): string | null => {
  const key = getEncryptionKey();
  if (!key) return null;

  try {
    // Generate random 16-byte IV
    const iv = CryptoJS.lib.WordArray.random(IV_LENGTH);

    const encrypted = CryptoJS.AES.encrypt(token, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Combine IV + encrypted data
    const combined = iv.toString(CryptoJS.enc.Hex) + ":" + encrypted.toString();

    // Use btoa for browser-safe Base64 encoding
    return typeof window !== "undefined"
      ? btoa(combined)
      : Buffer.from(combined).toString("base64");
  } catch (err) {
    console.error("❌ Encryption Error:", err);
    return null;
  }
};

// --- Decryption ---
/**
 * Decrypts a secure Token encoded by FrontEncryptToken.
 * It handles safely decoding the Base64 payload, separating the IV and ciphertext,
 * and performing AES-CBC decryption to return the original UTF-8 string.
 *
 * @param safeToken - The Base64 encoded encrypted token.
 * @returns The original decrypted string, or null on error.
 */
export const FrontDecryptTokenx = (safeToken: string): string | null => {
  const key = getEncryptionKey();
  if (!key || !safeToken) return null;

  try {
    // Decode Base64 safely
    const combined =
      typeof window !== "undefined"
        ? atob(safeToken)
        : Buffer.from(safeToken, "base64").toString("utf8");

    const [ivHex, encrypted] = combined.split(":");
    if (!ivHex || !encrypted) return null;

    const iv = CryptoJS.enc.Hex.parse(ivHex);

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedString || null;
  } catch (err) {
    console.error("❌ Decrypt Error:", err);
    return null;
  }
};
