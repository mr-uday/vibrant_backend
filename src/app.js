import express from "express";
import dotenv from "dotenv";
import nurseRoutes from "./routes/nurse.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import otpRoutes from "./routes/otp.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use(logger);

// Routes
app.use("/api", router);

app.use("/api/nurse", nurseRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/otp", otpRoutes)

// Default Route
app.get("/", (req, res) => {
  res.send("Express server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
