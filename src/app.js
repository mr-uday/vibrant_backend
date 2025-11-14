import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./middlewares/logger.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use(logger);

// Routes
app.use("/api", router);

// Default Route
app.get("/", (req, res) => {
  res.send("Express server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
