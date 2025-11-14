import { Router } from "express";
import { requestOtp, verifyOtp } from "../controllers/otp.controller.js";

const router = Router();

router.post("/request", requestOtp);    // POST /api/otp/request
router.post("/verify", verifyOtp);      // POST /api/otp/verify

export default router;
