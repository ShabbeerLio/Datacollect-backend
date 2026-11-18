import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { strict: false },
);

export default mongoose.model("User", userSchema, "users");
