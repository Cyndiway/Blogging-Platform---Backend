import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes
  .post("/register", registerUser)
  .post("/login", loginUser)

  // Password reset
  .post("/forgot", forgotPassword)
  .post("/reset", resetPassword);

export default authRoutes;
