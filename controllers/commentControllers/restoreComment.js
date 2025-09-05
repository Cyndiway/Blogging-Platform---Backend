import Comment from "../../models/Comment.js";

export const restoreComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = comment.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    if (!comment.deletedAt)
      return res.status(400).json({ message: "Comment is not deleted" });

    comment.deletedAt = null;
    comment.deletedBy = null;
    await comment.save();
    res.json({ message: "Comment restored" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
