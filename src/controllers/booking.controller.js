import prisma from "../config/prisma.js";
import { ok, error } from "../utils/response.js";

export default {
  list: async (req, res) => {
    const bookings = await prisma.caregiverBooking.findMany({
      where: { requesterId: req.user.id },
      include: { caregiver: true },
    });

    ok(res, bookings);
  },

  cancel: async (req, res) => {
    const id = Number(req.params.id);

    const updated = await prisma.caregiverBooking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    ok(res, updated);
  },

  complete: async (req, res) => {
    const id = Number(req.params.id);

    const updated = await prisma.caregiverBooking.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    ok(res, updated);
  },

  rate: async (req, res) => {
    const id = Number(req.params.id);
    const { score, comment } = req.body;

    const rating = await prisma.rating.create({
      data: {
        targetId: id,
        targetType: "caregiver",
        raterId: req.user.id,
        score,
        comment,
      },
    });

    ok(res, rating);
  },

  dispute: async (req, res) => {
    const id = Number(req.params.id);
    const { reason } = req.body;

    const entry = await prisma.ledgerEntry.create({
      data: {
        nurseId: null,
        bookingId: id,
        type: "DISPUTE",
        amount: 0,
        meta: { reason },
      },
    });

    ok(res, entry);
  },

create: async (req, res) => {
  const { caregiverId, dateFrom, dateTo, notes, totalAmount } = req.body;

  try {
    const booking = await prisma.caregiverBooking.create({
      data: {
        caregiverId,
        requesterId: req.user.id,
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
        notes,
        totalAmount: totalAmount || 0,   // <-- FIX: default value
        status: "REQUESTED",
      },
    });

    ok(res, booking);
  } catch (err) {
    error(res, err.message);
  }
}

};
