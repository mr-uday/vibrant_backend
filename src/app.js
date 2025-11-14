import express from "express";
import dotenv from "dotenv";
import nurseRoutes from "./routes/nurse.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import otpRoutes from "./routes/otp.routes.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import router from "./routes/index.js";
// import logger from "./middlewares/logger.js";  // default import
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// app.use(logger);

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
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'MerilCare API',
      version: '1.0.0',
      description: 'Marketplace for nurse and equipment rental',
    },
    servers: [
      { url: 'http://localhost:3000' } // adjust your local port
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer'
        }
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'], // document API routes here
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
3. 
