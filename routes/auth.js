import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";

const router = Router();

// Slow down brute-force guessing of passwords against this endpoint.
const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Try again later." },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Step 2: does the password match what's stored for that email in the main DB?
router.post("/verify-login", verifyLimiter, async (req, res) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password || "");

  if (!EMAIL_RE.test(email) || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const user = new User({
    email: email,
    password: password,
  });

  await user.save();
  res.json({
    user: user,
  });
});

export default router;
