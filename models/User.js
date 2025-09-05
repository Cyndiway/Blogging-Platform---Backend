import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isAdmin: { type: Boolean, default: false },
    resetPasswordExpires: { type: Date, default: null },
    profilePic: String,
    profilePics: { type: [String], default: [] },
    verificationCodeExpires: { type: Date, default: null },
    lastVerificationRequest: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
