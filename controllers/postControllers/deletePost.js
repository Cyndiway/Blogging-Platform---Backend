import Post from "../../models/Post.js";

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin")
    return res.status(403).json({ message: "Not authorized" });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};
