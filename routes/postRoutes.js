import { Router } from "express";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getPostById,
} from "../controllers/postControllers/barrel.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const postRouter = Router();

postRouter
  .post("/", protect, createPost)

  .get("/", getAllPosts)
  .get("/:id", getPostById)

  .put("/:id", protect, updatePost)
  .delete("/:id", protect, isAdmin, deletePost);

postRouter.post("/like/:id", protect, likePost);
postRouter.post("/unlike/:id", protect, unlikePost);

export default postRouter;
