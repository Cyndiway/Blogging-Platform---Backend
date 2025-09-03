import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { commentCreateSchema } from "../validators/commentValidation.js";

// List comments (hide soft-deleted)
export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post || post.deletedAt)
      return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({
      post: req.params.postId,
      deletedAt: null,
    })
      .sort({ createdAt: 1 })
      .populate("author", "username");
    res.json(comments);
  } catch (error) {
    res.send(error);
  }
};

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

// Add comment
export const addComment = async (req, res) => {
  try {
    const payload = commentCreateSchema.parse(req.body);
    const post = await Post.findById(req.params.postId);
    if (!post || post.deletedAt)
      return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      text: payload.text,
      author: req.user._id,
      post: post._id,
      images: [],
    });
    //select emojis based on keywords in comment text
    const keywords = {
      happy: "😊",
      sad: "😢",
      love: "❤️",
      angry: "😠",
      surprised: "😲",
      funny: "😂",
      cool: "😎",
      tired: "😴",
      confused: "😕",
      excited: "🤩",
    };
    for (const [keyword, emoji] of Object.entries(keywords)) {
      if (payload.text.toLowerCase().includes(keyword)) {
        comment.text += ` ${emoji}`;
      }
    }
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.send(error);
  }
};

export const commentWithImages = async (req, res) => {
  try {
    const payload = commentCreateSchema.parse(req.body);
    const post = await Post.findById(req.params.postId);
    if (!post || post.deletedAt)
      return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      text: payload.text,
      author: req.user._id,
      post: post._id,
      images: payload.images,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.send(error);
  }
};

// Soft delete comment (owner or admin)
export const softDeleteComment = async (req, res) => {
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
    res.json({ message: "Comment soft-deleted" });
  } catch (error) {}
};

// Restore comment
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
