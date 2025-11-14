import { Router } from "express";
import controller from "../controllers/booking.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, controller.list);
router.post("/:id/cancel", auth, controller.cancel);
router.post("/:id/complete", auth, controller.complete);
router.post("/:id/rate", auth, controller.rate);
router.post("/:id/dispute", auth, controller.dispute);

export default router;
