import prisma from "../config/prisma.js";
import { ok, error } from "../utils/response.js";

export default {
  list: async (req, res) => {
    const { city, category } = req.query;

    const devices = await prisma.device.findMany({
      where: {
        locationCity: city,
        ...(category && { category }),
      },
      orderBy: { id: "desc" },
    });

    ok(res, devices);
  },

  details: async (req, res) => {
    const id = Number(req.params.id);

    const device = await prisma.device.findUnique({
      where: { id },
    });

    if (!device) return error(res, "Not found", 404);

    ok(res, device);
  },

  book: async (req, res) => {
    const id = Number(req.params.id);

    const { startDate, endDate } = req.body;

    const booking = await prisma.deviceBooking.create({
      data: {
        deviceId: id,
        renterId: req.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalAmount: 0,
      },
    });

    ok(res, booking);
  },
};
