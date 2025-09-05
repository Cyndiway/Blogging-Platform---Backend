import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { getToken, generateOTP } from "../../jwt/accessToken.js";
import { sendMail } from "../../Utils/emailSender.js";

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "Email and password are required" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  if (!user.isVerified) {
    return res.status(403).json({ message: "Please verify your email" });
  }

  const token = getToken(userId);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "Login successful",
    user: { userName: user.userName, email: user.email, isAdmin: user.isAdmin },
  });
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
