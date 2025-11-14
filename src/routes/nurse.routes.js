/**
 * @swagger
 * tags:
 *   - name: Nurse
 *     description: Nurse (Caregiver) APIs
 */

import { Router } from "express";
import controller from "../controllers/nurse.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * /api/nurse/me:
 *   get:
 *     summary: Get current nurse user profile
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile including caregiverProfile
 */
router.get("/me", auth, controller.me);

/**
 * @swagger
 * /api/nurse/profile:
 *   put:
 *     summary: Update nurse caregiver profile
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio: { type: string }
 *               skills: { type: array, items: { type: string } }
 *               experienceYears: { type: integer }
 *               hourlyRate: { type: number }
 *               dailyRate: { type: number }
 *               travelRadiusKm: { type: number }
 *     responses:
 *       200:
 *         description: Updated caregiver profile
 */
router.put("/profile", auth, controller.updateProfile);

/**
 * @swagger
 * /api/nurse/documents:
 *   post:
 *     summary: Upload nurse documents (Govt ID, certificates)
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents uploaded
 */
router.post("/documents", auth, controller.uploadDocuments);

/**
 * @swagger
 * /api/nurse/verification-status:
 *   get:
 *     summary: Get verification status & rejection reason
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification status returned
 */
router.get("/verification-status", auth, controller.verificationStatus);

/**
 * @swagger
 * /api/nurse/slots:
 *   post:
 *     summary: Add availability slot for nurse
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startAt: { type: string, example: "2025-01-10T09:00:00Z" }
 *               endAt: { type: string, example: "2025-01-10T17:00:00Z" }
 *               slotType: { type: string, example: "HOURLY" }
 *               maxHours: { type: integer }
 *               isRecurring: { type: boolean }
 *               recurrence: { type: object }
 *               locationZone: { type: string }
 *     responses:
 *       200:
 *         description: Slot created
 */
router.post("/slots", auth, controller.addSlot);

/**
 * @swagger
 * /api/nurse/slots:
 *   get:
 *     summary: List all nurse slots
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Slot list returned
 */
router.get("/slots", auth, controller.listSlots);

/**
 * @swagger
 * /api/nurse/slots/{slotId}:
 *   delete:
 *     summary: Delete nurse slot
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: slotId
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Slot deleted
 */
router.delete("/slots/:slotId", auth, controller.deleteSlot);

/**
 * @swagger
 * /api/nurse/booking/requests:
 *   get:
 *     summary: Get incoming booking requests for nurse
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking requests returned
 */
router.get("/booking/requests", auth, controller.bookingRequests);

/**
 * @swagger
 * /api/nurse/booking/{id}/accept:
 *   post:
 *     summary: Accept booking request
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Booking accepted
 */
router.post("/booking/:id/accept", auth, controller.acceptBooking);

/**
 * @swagger
 * /api/nurse/booking/{id}/decline:
 *   post:
 *     summary: Decline booking
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Booking declined
 */
router.post("/booking/:id/decline", auth, controller.declineBooking);

/**
 * @swagger
 * /api/nurse/booking/{id}/propose:
 *   post:
 *     summary: Propose new time for booking
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newStart: { type: string }
 *               newEnd: { type: string }
 *     responses:
 *       200:
 *         description: Proposed new time updated
 */
router.post("/booking/:id/propose", auth, controller.proposeBooking);

/**
 * @swagger
 * /api/nurse/booking/{id}/checkin:
 *   post:
 *     summary: Check-in for booking
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Booking marked ACTIVE
 */
router.post("/booking/:id/checkin", auth, controller.checkIn);

/**
 * @swagger
 * /api/nurse/booking/{id}/checkout:
 *   post:
 *     summary: Check-out from booking
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Booking marked COMPLETED
 */
router.post("/booking/:id/checkout", auth, controller.checkOut);

/**
 * @swagger
 * /api/nurse/booking/{id}/tasks:
 *   post:
 *     summary: Add a task entry for a booking
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId: { type: integer }
 *               title: { type: string }
 *               notes: { type: string }
 *               photoUrls: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Task created
 */
router.post("/booking/:id/tasks", auth, controller.addTask);

/**
 * @swagger
 * /api/nurse/earnings:
 *   get:
 *     summary: Get earnings summary
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Earnings summary returned
 */
router.get("/earnings", auth, controller.earningsSummary);

/**
 * @swagger
 * /api/nurse/ledger:
 *   get:
 *     summary: Get nurse ledger entries
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ledger returned
 */
router.get("/ledger", auth, controller.ledger);

/**
 * @swagger
 * tags:
 *   - name: Nurse Directory
 *     description: Public list of nurses
 */

/**
 * @swagger
 * /api/nurses/list:
 *   get:
 *     summary: Get all registered nurses
 *     tags: [Nurse Directory]
 *     responses:
 *       200:
 *         description: List of nurses
 */
router.get("/list", controller.listNurses);

/**
 * @swagger
 * /api/nurse/payout-request:
 *   post:
 *     summary: Create payout request
 *     tags: [Nurse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payout request created
 */
router.post("/payout-request", auth, controller.payoutRequest);


export default router;
