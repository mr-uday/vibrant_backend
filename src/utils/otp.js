import dotenv from "dotenv";
dotenv.config();

// In-memory OTP store: { email: { otp, expiresAt } }
const otpStore = {};

/**
 * Generate a numeric OTP of length specified in .env (default 6)
 */
export function generateOtp() {
  const length = Number(process.env.OTP_LENGTH || 6);
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

/**
 * Save an OTP for a given email, with expiry in seconds from .env (default: 300)
 */
export function saveOtp(email, otp) {
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + (Number(process.env.OTP_EXPIRE_SECONDS || 300) * 1000),
  };
}

/**
 * Check if the OTP for an email is valid and not expired
 */
export function verifyStoredOtp(email, otp) {
  const data = otpStore[email];
  if (!data) return false;
  if (Date.now() > data.expiresAt) return false;
  return data.otp === otp;
}

// Optionally: Remove OTP after verification (for extra security)
export function clearOtp(email) {
  delete otpStore[email];
}
