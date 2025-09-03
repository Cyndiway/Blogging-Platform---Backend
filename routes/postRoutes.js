import express from "express";
import { createPost, getPosts, updatePost, deletePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getPosts)
  .post(protect, createPost);

router.route("/:id")
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
