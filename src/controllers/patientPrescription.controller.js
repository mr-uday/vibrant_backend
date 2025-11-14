import prisma from "../config/prisma.js";
import { ok, error } from "../utils/response.js";

export default {
  /**
   * @swagger
   * /api/patient/prescriptions:
   *   post:
   *     summary: Create a new prescription for the logged-in patient
   *     tags: [Prescriptions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - medicine
   *               - startDate
   *               - endDate
   *               - dosage
   *               - times
   *               - foodTiming
   *           example:
   *             medicine: "Azithromycin 500mg"
   *             startDate: "2025-02-15"
   *             endDate: "2025-02-20"
   *             dosage: "1 tablet"
   *             times: ["morning", "night"]
   *             foodTiming: "after_food"
   *             notes: "Take with warm water"
   */
  create: async (req, res) => {
    try {
      const { medicine, startDate, endDate, dosage, times, foodTiming, notes } = req.body;

      const prescription = await prisma.prescription.create({
        data: {
          patientId: req.user.id,
          medicine,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          dosage,
          times,
          foodTiming,
          notes,
        },
      });

      ok(res, prescription);
    } catch (err) {
      console.error(err);
      error(res, "Failed to create prescription");
    }
  },

  /**
   * @swagger
   * /api/patient/prescriptions:
   *   get:
   *     summary: Get all prescriptions for the logged-in patient
   *     tags: [Prescriptions]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of prescriptions
   */
  list: async (req, res) => {
    try {
      const prescriptions = await prisma.prescription.findMany({
        where: { patientId: req.user.id },
        orderBy: { id: "desc" },
      });

      ok(res, prescriptions);
    } catch (err) {
      console.error(err);
      error(res, "Failed to fetch prescriptions");
    }
  },


    /**
   * @swagger
   * /api/patient/prescriptions/{patientId}:
   *   get:
   *     summary: Get prescriptions for a specific patient (used by nurses)
   *     tags: [Prescriptions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the patient
   *     responses:
   *       200:
   *         description: List of prescriptions for selected patient
   */
// GET prescriptions for ANY patient by ID
getByPatientId: async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId },
      orderBy: { id: "desc" },
    });

    ok(res, prescriptions);
  } catch (err) {
    console.error(err);
    error(res, "Failed to fetch patient prescriptions");
  }
}


};
