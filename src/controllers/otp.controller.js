import dotenv from "dotenv";
dotenv.config();

import { generateOtp, saveOtp, verifyStoredOtp, clearOtp } from "../utils/otp.js";
import { transporter } from "../utils/mailer.js";

// Request OTP for email (send via nodemailer)
export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const otp = generateOtp();
    saveOtp(email, otp);

    // For demo: send OTP via email (nodemailer)
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP: <strong>${otp}</strong></h2>
             <p>Valid for ${process.env.OTP_EXPIRE_SECONDS / 60} minutes.</p>`,
    });

    // For hackathon you can add otp in response as well, comment out below in production
    // return res.json({ success: true, message: "OTP sent!", otp });

    return res.json({ success: true, message: "OTP sent!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify OTP for email
export const verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Data missing" });
    }

    const isValid = verifyStoredOtp(email, otp);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    clearOtp(email); // Optionally clear OTP after success

    // You could add logic here for login or registration session creation
    return res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
