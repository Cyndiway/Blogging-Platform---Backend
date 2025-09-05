import Comment from "../../models/Comment.js";

// Soft delete comment (owner or admin)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = comment.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    if (comment.deletedAt)
      return res.status(200).json({ message: "Already deleted" });

    comment.deletedAt = new Date();
    comment.deletedBy = req.user._id;
    await comment.save();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
