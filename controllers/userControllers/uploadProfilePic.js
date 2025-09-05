import User from "../../models/User.js";
import path from "path";
import fs from "fs";
import upload from "../../middleware/fileUploadMiddleware.js";

export const uploadProfilePic = async (req, res) => {
  const profilePic = req.file;
  const { id } = req.params;

  try {
    if (!profilePic) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture if exists
    if (user.profilePic) {
      const oldPath = path.join(process.cwd(), "uploads", user.profilePic);
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        console.error("Failed to delete old profile picture:", err);
      }
    }

    // Rename file to avoid conflicts (already handled in middleware)
    user.profilePic = profilePic.filename;
    await user.save();

    res.json({
      message: "Profile picture uploaded successfully",
      profilePic: `/uploads/${profilePic.filename}`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
    console.error("Error uploading profile picture:", error);
  }
};
