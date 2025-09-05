import Router from "express";
import upload from "../middleware/fileUploadMiddleware.js";
import {
  register,
  getAllUsers,
  getAUserProfile,
  getAUserByParam,
  updateUserProfile,
  deleteUser,
  uploadProfilePic,
} from "../controllers/userControllers/barrel.js";

const userRoutes = Router();

userRoutes
  .post("/create", register)

  // Get Users
  .get("/", getAllUsers)
  .get("/:id", getAUserProfile)
  .get("/param/:param", getAUserByParam)

  // Update User Profile
  .put("/:id", updateUserProfile)

  // Delete user profile
  .delete("/:id", deleteUser)

  // Upload profile picture
  .post("/:id/profile-pic", upload.single("profilePic"), uploadProfilePic);

export default userRoutes;
