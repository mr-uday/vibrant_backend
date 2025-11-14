import express from "express";
import dotenv from "dotenv";
import nurseRoutes from "./routes/nurse.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import otpRoutes from "./routes/otp.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import cors from "cors";
import deviceBookingRoutes from "./routes/deviceBooking.routes.js"; 
import patientPrescriptionRoutes from "./routes/patientPrescription.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow ANY origin dynamically
  res.header("Access-Control-Allow-Origin", origin || "*");

  // Allow credentials
  res.header("Access-Control-Allow-Credentials", "true");

  // Allowed headers & methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/nurse", nurseRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/patient/prescriptions", patientPrescriptionRoutes);
app.use("/api/device-bookings", deviceBookingRoutes);
app.use("/api/nurses", nurseRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Default
app.get("/", (req, res) => {
  res.send("Express server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger Docs → http://localhost:${PORT}/api-docs`);
});
