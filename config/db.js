import mongoose from "mongoose";

// A single connection to your MAIN database — the one that already
// stores your real user accounts. We only ever READ from it here.
export async function connectMainDB() {
  const uri = process.env.MAIN_DB_URI;
  if (!uri) {
    throw new Error("MAIN_DB_URI is not set in .env");
  }

  mongoose.connection.on("connected", () => {
    console.log("Connected to main database");
  });
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  await mongoose.connect(uri);
}
