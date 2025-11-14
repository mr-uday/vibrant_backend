import prisma from "../config/prisma.js";
import { ok, error } from "../utils/response.js";

export default {
  create: async (req, res) => {
    try {
      const { deviceId, dateFrom, dateTo, totalPrice, notes } = req.body;

      const userId = req.user.id;

      // Validate device exists
      const device = await prisma.device.findUnique({
        where: { id: deviceId }
      });

      if (!device) return error(res, "Device not found", 404);

      // Check date conflict
      const conflict = await prisma.deviceBooking.findFirst({
        where: {
          deviceId,
          status: { in: ["RESERVED", "ACTIVE"] },
          OR: [
            {
              dateFrom: { lte: new Date(dateTo) },
              dateTo:   { gte: new Date(dateFrom) },
            }
          ]
        }
      });

      if (conflict) {
        return error(res, "Device already booked for these dates", 400);
      }

      const booking = await prisma.deviceBooking.create({
        data: {
          deviceId,
          userId,
          dateFrom: new Date(dateFrom),
          dateTo: new Date(dateTo),
          totalPrice,
          notes,
          status: "RESERVED"
        }
      });

      ok(res, booking);
    } catch (err) {
      console.error(err);
      error(res, "Something went wrong");
    }
  },

  myBookings: async (req, res) => {
    try {
      const bookings = await prisma.deviceBooking.findMany({
        where: { userId: req.user.id },
        include: { device: true },
        orderBy: { id: "desc" }
      });

      ok(res, bookings);
    } catch (err) {
      console.error(err);
      error(res, "Something went wrong");
    }
  },

  details: async (req, res) => {
    try {
      const id = Number(req.params.id);

      const booking = await prisma.deviceBooking.findUnique({
        where: { id },
        include: { device: true, user: true },
      });

      if (!booking) return error(res, "Not found", 404);

      ok(res, booking);
    } catch (err) {
      console.error(err);
      error(res, "Something went wrong");
    }
  },
};
