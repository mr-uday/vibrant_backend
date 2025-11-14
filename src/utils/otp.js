import dotenv from "dotenv";
dotenv.config();

// in-memory store (for simple use)
const otpStore = {}; // { email: { otp, expiresAt } }

export function generateOtp() {
  const length = Number(process.env.OTP_LENGTH || 6);
  let code = "";
  const digits = "0123456789";

  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }

  return code;
}

export function saveOtp(email, otp) {
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + Number(process.env.OTP_EXPIRE_SECONDS) * 1000,
  };
}

export function verifyStoredOtp(email, otp) {
  const data = otpStore[email];
  if (!data) return false;
  if (Date.now() > data.expiresAt) return false;
  return data.otp === otp;
}
