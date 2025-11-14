import { Router } from "express";
import prisma from "../config/prisma.js";
import { auth } from "../middlewares/auth.js";
import { ok, error } from "../utils/response.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: DeviceBookings
 *   description: Device booking APIs
 */

/**
 * @swagger
 * /api/device-bookings:
 *   post:
 *     summary: Create a new device booking
 *     tags: [DeviceBookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId: { type: number }
 *               dateFrom: { type: string, format: date }
 *               dateTo: { type: string, format: date }
 *               totalPrice: { type: number }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Booking created successfully
 */
router.post("/", auth, async (req, res) => {
  try {
    const { deviceId, dateFrom, dateTo, totalPrice, notes } = req.body;
    console.log(req.body);

    const booking = await prisma.deviceBooking.create({
      data: {
        userId: req.user.id,
        deviceId,
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
        totalPrice,
        notes,
        status: "PENDING",
      },
    });

    ok(res, booking);
  } catch (err) {
    error(res, err.message);
  }
});

/**
 * @swagger
 * /api/device-bookings:
 *   get:
 *     summary: Get user's device bookings
 *     tags: [DeviceBookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of device bookings
 */
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await prisma.deviceBooking.findMany({
      where: { userId: req.user.id },
      include: { device: true },
      orderBy: { createdAt: "desc" },
    });

    ok(res, bookings);
  } catch (err) {
    error(res, err.message);
  }
});

/**
 * @swagger
 * /api/device-bookings/{id}:
 *   get:
 *     summary: Get single device booking
 *     tags: [DeviceBookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Booking details
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await prisma.deviceBooking.findUnique({
      where: { id: Number(req.params.id) },
      include: { device: true }
    });

    ok(res, booking);
  } catch (err) {
    error(res, err.message);
  }
});

/**
 * @swagger
 * /api/device-bookings/{id}/cancel:
 *   post:
 *     summary: Cancel a device booking
 *     tags: [DeviceBookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.post("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await prisma.deviceBooking.update({
      where: { id: Number(req.params.id) },
      data: { status: "CANCELLED" },
    });

    ok(res, booking);
  } catch (err) {
    error(res, err.message);
  }
});

export default router;
