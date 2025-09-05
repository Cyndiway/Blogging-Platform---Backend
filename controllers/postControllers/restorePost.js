import Post from "../../models/Post.js";

export const restorePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    if (!post.deletedAt)
      return res.status(400).json({ message: "Post is not deleted" });

    post.deletedAt = null;
    post.deletedBy = null;
    await post.save();
    res.json({ message: "Post restored", post });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
