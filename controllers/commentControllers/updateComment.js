import Comment from "../../models/Comment.js";
import Post from "../../models/Post.js";
import { commentEditSchema } from "../../validators/commentValidation.js";

export const updateComment = async (req, res) => {
  try {
    const payload = commentEditSchema.parse(req.body);
    const comment = await comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = comment.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    if (comment.deletedAt)
      return res.status(400).json({ message: "Cannot edit a deleted comment" });

    comment.text = payload.text || comment.text;
    await comment.save();
    res.json(comment);
  } catch (error) {
    if (error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message).join(", ") });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
