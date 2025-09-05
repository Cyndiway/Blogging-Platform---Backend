import express from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { userName, email, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check for duplicate email
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }
    user.userName = userName || user.userName;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.json({ message: "User profile updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
