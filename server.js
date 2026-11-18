import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectMainDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : "*" }));
app.use(express.json());

app.use("/api", authRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

connectMainDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Verification server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to main database:", err.message);
    process.exit(1);
  });
