/**
 * @swagger
 * tags:
 *   - name: Bookings
 *     description: Universal booking APIs (doctor/patient side)
 */

import { Router } from "express";
import controller from "../controllers/booking.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all caregiver bookings for the logged-in requester
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings created by the requester
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   caregiverId: { type: integer }
 *                   requesterId: { type: integer }
 *                   dateFrom: { type: string }
 *                   dateTo: { type: string }
 *                   status: { type: string }
 *                   totalAmount: { type: number }
 */
router.get("/", auth, controller.list);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   post:
 *     summary: Cancel a caregiver booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       404:
 *         description: Booking not found
 */
router.post("/:id/cancel", auth, controller.cancel);

/**
 * @swagger
 * /api/bookings/{id}/complete:
 *   post:
 *     summary: Mark booking as completed
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking marked completed
 *       404:
 *         description: Booking not found
 */
router.post("/:id/complete", auth, controller.complete);

/**
 * @swagger
 * /api/bookings/{id}/rate:
 *   post:
 *     summary: Rate a completed booking (caregiver rating)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Booking ID (targetId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [score]
 *             properties:
 *               score:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Very professional and helpful"
 *     responses:
 *       200:
 *         description: Rating created successfully
 */
router.post("/:id/rate", auth, controller.rate);

/**
 * @swagger
 * /api/bookings/{id}/dispute:
 *   post:
 *     summary: Raise a dispute for a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Caregiver arrived late and did not complete tasks"
 *     responses:
 *       200:
 *         description: Dispute filed successfully
 */
router.post("/:id/dispute", auth, controller.dispute);

export default router;
