import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ok, error } from "../utils/response.js";

export default {
  // ---------------- REGISTER ----------------
  register: async (req, res) => {
    try {
      const { name, email, phone, password, role, city } = req.body;

      if (!name || !email || !password || !role) {
        return error(res, "Name, email, password & role are required", 400);
      }

      const exists = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });

      if (exists) return error(res, "Email or phone already registered", 400);

      const hashed = await bcrypt.hash(password, 10);

      // Step 1 — Create base user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          city,
          password: hashed,
          role,
        },
      });

      // Step 2 — Create profile based on role
      if (role === "NURSE") {
        await prisma.caregiver.create({ data: { id: user.id } });
      }
      if (role === "DOCTOR") {
        await prisma.doctor.create({ data: { id: user.id } });
      }
      if (role === "PATIENT") {
        await prisma.patient.create({ data: { id: user.id } });
      }

      // Step 3 — CREATE TOKEN
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      ok(res, {
        message: "Registered successfully",
        token,
        user,
      });

    } catch (err) {
      error(res, err.message, 500);
    }
  },

  // ---------------- LOGIN ----------------
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return error(res, "Email & password are required", 400);
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return error(res, "Invalid credentials", 400);

      const match = await bcrypt.compare(password, user.password);
      if (!match) return error(res, "Invalid credentials", 400);

      // Generate token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      ok(res, {
        message: "Login successful",
        token,
        user,
      });

    } catch (err) {
      error(res, err.message, 500);
    }
  },
};
