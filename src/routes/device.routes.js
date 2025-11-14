/**
 * @swagger
 * tags:
 *   - name: Devices
 *     description: Medical device rental APIs (Doctor side)
 */

import { Router } from "express";
import controller from "../controllers/device.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: List medical devices with optional filters
 *     tags: [Devices]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter devices by city
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter devices by category
 *     responses:
 *       200:
 *         description: List of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   name: { type: string }
 *                   category: { type: string }
 *                   dailyPrice: { type: number }
 *                   locationCity: { type: string }
 *                   available: { type: boolean }
 */
router.get("/", controller.list);

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Get device details by ID
 *     tags: [Devices]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Device details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 name: { type: string }
 *                 category: { type: string }
 *                 dailyPrice: { type: number }
 *                 locationCity: { type: string }
 *                 available: { type: boolean }
 *       404:
 *         description: Device not found
 */
router.get("/:id", controller.details);

/**
 * @swagger
 * /api/devices/{id}/book:
 *   post:
 *     summary: Book a medical device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 example: "2025-01-20"
 *               endDate:
 *                 type: string
 *                 example: "2025-01-27"
 *     responses:
 *       200:
 *         description: Device booking created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 deviceId: { type: integer }
 *                 renterId: { type: integer }
 *                 startDate: { type: string }
 *                 endDate: { type: string }
 *                 totalAmount: { type: number }
 *       401:
 *         description: Unauthorized
 */
router.post("/:id/book", auth, controller.book);

export default router;
