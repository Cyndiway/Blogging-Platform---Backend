import mongoose from "mongoose";
// ...existing code...

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLiked = post.likes.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (hasLiked)
      return res
        .status(400)
        .json({ message: "You have already liked this post" });

    post.likes.push(req.user._id);
    await post.save();

    req.user.likedPosts.push(post._id);
    await req.user.save();

    res.json({ message: "Post liked", likesCount: post.likes.length });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLiked = post.likes.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!hasLiked)
      return res.status(400).json({ message: "You have not liked this post" });

    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    await post.save();

    req.user.likedPosts = req.user.likedPosts.filter(
      (postId) => postId.toString() !== post._id.toString()
    );
    await req.user.save();

    res.json({ message: "Post unliked", likesCount: post.likes.length });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
