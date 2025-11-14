import { Router } from "express";
import controller from "../controllers/nurse.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/me", auth, controller.me);
router.put("/profile", auth, controller.updateProfile);
router.post("/documents", auth, controller.uploadDocuments);
router.get("/verification-status", auth, controller.verificationStatus);

router.post("/slots", auth, controller.addSlot);
router.get("/slots", auth, controller.listSlots);
router.delete("/slots/:slotId", auth, controller.deleteSlot);

router.get("/booking/requests", auth, controller.bookingRequests);
router.post("/booking/:id/accept", auth, controller.acceptBooking);
router.post("/booking/:id/decline", auth, controller.declineBooking);
router.post("/booking/:id/propose", auth, controller.proposeBooking);
router.post("/booking/:id/checkin", auth, controller.checkIn);
router.post("/booking/:id/checkout", auth, controller.checkOut);

router.post("/booking/:id/tasks", auth, controller.addTask);

router.get("/earnings", auth, controller.earningsSummary);
router.get("/ledger", auth, controller.ledger);
router.post("/payout-request", auth, controller.payoutRequest);

export default router;
