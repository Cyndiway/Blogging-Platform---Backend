import Comment from "../../models/Comment.js";
import Post from "../../models/Post.js";
import { commentCreateSchema } from "../../validators/commentValidation.js";

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
