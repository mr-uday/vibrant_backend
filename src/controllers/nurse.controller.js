import prisma from "../config/prisma.js";
import { ok, error } from "../utils/response.js";

export default {
  // ---------------- PROFILE ----------------
  me: async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { caregiverProfile: true },
    });
    ok(res, user);
  },

  updateProfile: async (req, res) => {
    const { bio, skills, experienceYears, hourlyRate, dailyRate, travelRadiusKm } = req.body;

    const caregiver = await prisma.caregiver.update({
      where: { id: req.user.id },
      data: { bio, skills, experienceYears, hourlyRate, dailyRate, travelRadiusKm },
    });

    ok(res, caregiver);
  },

  uploadDocuments: async (req, res) => {
    const { documents } = req.body;

    const updated = await prisma.caregiver.update({
      where: { id: req.user.id },
      data: { documents, backgroundCheckStatus: false },
    });

    ok(res, updated);
  },

  verificationStatus: async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { verificationStatus: true, rejectionReason: true },
    });
    ok(res, user);
  },

  // ---------------- AVAILABILITY ----------------
  addSlot: async (req, res) => {
    const { startAt, endAt, slotType, maxHours, isRecurring, recurrence, locationZone } = req.body;

    const slot = await prisma.nurseSlot.create({
      data: {
        nurseId: req.user.id,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        slotType,
        maxHours,
        isRecurring,
        recurrence,
        locationZone,
      },
    });

    ok(res, slot);
  },

  listSlots: async (req, res) => {
    const slots = await prisma.nurseSlot.findMany({
      where: { nurseId: req.user.id },
      orderBy: { startAt: "asc" },
    });

    ok(res, slots);
  },

  deleteSlot: async (req, res) => {
    await prisma.nurseSlot.delete({
      where: { id: Number(req.params.slotId) },
    });

    ok(res, "Deleted");
  },

  // ---------------- BOOKING REQUESTS ----------------
  bookingRequests: async (req, res) => {
    const requests = await prisma.caregiverBooking.findMany({
      where: { caregiverId: req.user.id },
      include: { requester: true },
      orderBy: { dateFrom: "asc" },
    });

    ok(res, requests);
  },

  acceptBooking: async (req, res) => {
    const id = Number(req.params.id);

    const booking = await prisma.caregiverBooking.update({
      where: { id },
      data: { status: "RESERVED" },
    });

    ok(res, booking);
  },

  declineBooking: async (req, res) => {
    const id = Number(req.params.id);

    const booking = await prisma.caregiverBooking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    ok(res, booking);
  },

  proposeBooking: async (req, res) => {
    const id = Number(req.params.id);
    const { newStart, newEnd } = req.body;

    const booking = await prisma.caregiverBooking.update({
      where: { id },
      data: {
        dateFrom: new Date(newStart),
        dateTo: new Date(newEnd),
        status: "REQUESTED",
      },
    });

    ok(res, booking);
  },

  checkIn: async (req, res) => {
    const id = Number(req.params.id);

    const booking = await prisma.caregiverBooking.update({
      where: { id },
      data: { status: "ACTIVE" },
    });

    ok(res, booking);
  },

  checkOut: async (req, res) => {
    const id = Number(req.params.id);

    const booking = await prisma.caregiverBooking.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    ok(res, booking);
  },

  addTask: async (req, res) => {
    const { bookingId, title, notes, photoUrls } = req.body;

    const task = await prisma.bookingTask.create({
      data: { bookingId, title, notes, photoUrls },
    });

    ok(res, task);
  },

  // ---------------- EARNINGS ----------------
  earningsSummary: async (req, res) => {
    const ledger = await prisma.ledgerEntry.groupBy({
      by: ["type"],
      _sum: { amount: true },
      where: { nurseId: req.user.id },
    });

    ok(res, ledger);
  },

  ledger: async (req, res) => {
    const records = await prisma.ledgerEntry.findMany({
      where: { nurseId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    ok(res, records);
  },

  payoutRequest: async (req, res) => {
    const payout = await prisma.ledgerEntry.create({
      data: {
        nurseId: req.user.id,
        type: "PAYOUT_REQUEST",
        amount: 0,
      },
    });

    ok(res, payout);
  },


  createBookingRequest: async (req, res) => {
  const { caregiverId, dateFrom, dateTo, slotId, notes } = req.body;

  try {
    const booking = await prisma.caregiverBooking.create({
      data: {
        caregiverId,
        requesterId: req.user.id,
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
        slotId,
        notes,
        status: "REQUESTED",
      },
    });

    ok(res, booking);
  } catch (err) {
    error(res, err.message);
  }
},
listNurses: async (req, res) => {
    try {
      const nurses = await prisma.user.findMany({
        where: {
          role: "NURSE",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          languages: true,

          caregiverProfile: {
            select: {
              bio: true,
              experienceYears: true,
              hourlyRate: true,
              dailyRate: true,
              skills: true,
              travelRadiusKm: true,
              backgroundCheckStatus: true,
            },
          },
        },
      });

      ok(res, nurses);
    } catch (err) {
      console.error(err);
      error(res, "Failed to fetch nurses");
    }
  },
};
