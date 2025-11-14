import { Router } from "express";
import controller from "../controllers/patientPrescription.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: APIs to manage patient prescriptions
 */

// Create prescription
router.post("/", auth, controller.create);

// Get all prescriptions for logged-in patient
router.get("/", auth, controller.list);


router.get("/:patientId", auth, controller.getByPatientId);


export default router;
