import Post from "../../models/Post.js";
import { postUpdateSchema } from "../../validators/postValidation.js";

export const updatePost = async (req, res) => {
  try {
    const payload = postUpdateSchema.parse(req.body);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    if (post.deletedAt)
      return res.status(400).json({ message: "Cannot edit a deleted post" });

    Object.assign(post, payload);
    await post.save();
    res.json(post);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
