import Comment from "../../models/Comment.js";
import Post from "../../models/Post.js";

export const getComment = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post || post.deletedAt)
      return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({
      post: postId,
      deletedAt: null,
    })
      .sort({ createdAt: 1 })
      .populate("author", "username");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all non-deleted comments (for admin purposes)
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({ deletedAt: null })
      .sort({ createdAt: 1 })
      .populate("author", "username");
    res.json(comments);
  } catch (error) {
    res.send(error);
  }
};
