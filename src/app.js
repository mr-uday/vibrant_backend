import express from "express";
import dotenv from "dotenv";
import nurseRoutes from "./routes/nurse.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import otpRoutes from "./routes/otp.routes.js";
import router from "./routes/index.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api", router);
app.use("/api/nurse", nurseRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/otp", otpRoutes);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Default Route
app.get("/", (req, res) => {
  res.send("Express server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger Docs → http://localhost:${PORT}/api-docs`);
});
