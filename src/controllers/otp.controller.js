import { generateOtp, saveOtp, verifyStoredOtp } from "../utils/otp.util.js";
import { transporter } from "../utils/mailer.js";
import dotenv from "dotenv";
dotenv.config();

// Request OTP
export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const otp = generateOtp();
    saveOtp(email, otp);

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP: <strong>${otp}</strong></h2>
             <p>Valid for ${process.env.OTP_EXPIRE_SECONDS / 60} minutes.</p>`,
    });

    return res.json({ success: true, message: "OTP sent!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify OTP
export const verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Data missing" });

    const isValid = verifyStoredOtp(email, otp);

    if (!isValid)
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
