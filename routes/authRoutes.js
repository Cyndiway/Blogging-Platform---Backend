import express from "express";
import {
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  requestPasswordReset,
  passwordReset,
} from "../controllers/authControllers/barrel.js";

const authRoutes = express.Router();

authRoutes
  .post("/login", login)
  .get("/logout", logout)

  // Verify email address
  .post("/verify", verifyEmail)
  .post("/resend", resendVerificationCode)

  // Password Reset
  .post("/pasword/resetRequest", requestPasswordReset)
  .post("/pasword/reset", passwordReset);

export default authRoutes;
