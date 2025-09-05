import Router from "express";
import {
  addComment,
  getComment,
  updateComment,
  deleteComment,
  restoreComment,
  getAllComments,
} from "../controllers/commentControllers/barrel.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const commentRouter = Router();

commentRouter
  .post("/", addComment)

  .get("/", getComment)
  .get("/all", isAdmin, getAllComments)

  .put("/:id", protect, updateComment)
  .delete("/:id", protect, deleteComment)

  .patch("/restore/:id", protect, restoreComment);

export default commentRouter;
