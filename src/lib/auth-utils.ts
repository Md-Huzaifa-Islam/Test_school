import crypto from "crypto";

/**
 * Generate a random OTP (One-Time Password)
 * @param length - Length of the OTP (default: 6)
 * @returns string - The generated OTP
 */
export function generateOTP(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}

/**
 * Generate a secure random token for email verification or password reset
 * @param length - Length of the token in bytes (default: 32)
 * @returns string - The generated token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Hash a token for secure storage
 * @param token - The token to hash
 * @returns string - The hashed token
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generate expiration time for tokens
 * @param minutes - Minutes from now (default: 10)
 * @returns Date - The expiration date
 */
export function generateExpirationTime(minutes: number = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * Check if a date has expired
 * @param expirationDate - The expiration date to check
 * @returns boolean - True if expired, false otherwise
 */
export function isExpired(expirationDate: Date): boolean {
  return new Date() > expirationDate;
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns boolean - True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

/**
 * Generate a verification code with expiration
 * @param length - Length of the code (default: 6)
 * @param expirationMinutes - Expiration time in minutes (default: 10)
 * @returns object - Contains code and expiration date
 */
export function generateVerificationCode(
  length: number = 6,
  expirationMinutes: number = 10
) {
  return {
    code: generateOTP(length),
    expiresAt: generateExpirationTime(expirationMinutes),
  };
}

/**
 * Generate email verification token with expiration
 * @param expirationHours - Expiration time in hours (default: 24)
 * @returns object - Contains token and expiration date
 */
export function generateEmailVerificationToken(expirationHours: number = 24) {
  const token = generateSecureToken();
  return {
    token,
    hashedToken: hashToken(token),
    expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
  };
}

/**
 * Generate password reset token with expiration
 * @param expirationMinutes - Expiration time in minutes (default: 60)
 * @returns object - Contains token and expiration date
 */
export function generatePasswordResetToken(expirationMinutes: number = 60) {
  const token = generateSecureToken();
  return {
    token,
    hashedToken: hashToken(token),
    expiresAt: generateExpirationTime(expirationMinutes),
  };
}
