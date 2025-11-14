import { Router } from "express";
import controller from "../controllers/device.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/", controller.list);
router.get("/:id", controller.details);
router.post("/:id/book", auth, controller.book);

export default router;
