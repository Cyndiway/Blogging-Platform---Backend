import Post from "../models/Post.js";
import {
  postCreateSchema,
  postUpdateSchema,
} from "../validators/postValidation.js";

export const createPost = async (req, res) => {
  try {
    const payload = postCreateSchema.parse(req.body);

    const images = req.files.map((file) => file.path);
    const videos = req.videos.map((file) => file.path);
    const post = await Post.create({
      ...payload,
      author: req.user._id,
      images,
      videos,
    });

    //select emojis based on keywords in post title and body
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
      if (
        payload.title.toLowerCase().includes(keyword) ||
        payload.body.toLowerCase().includes(keyword)
      ) {
        post.title += ` ${emoji}`;
        post.body += ` ${emoji}`;
      }
    }

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.send(error);
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId).populate("author", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostsByParam = async (req, res) => {
  const { author, tag, title } = req.query;
  try {
    const query = {};
    if (author) query.author = author;
    if (tag) query.tags = tag;
    if (title) query.$text = { $search: title };

    const posts = await Post.find(query);
    if (!posts) return res.status(404).json({ message: "Posts not found" });

    posts.sort({ createdAt: -1 }).populate("author", "username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  const payload = postUpdateSchema.parse(req.body);
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin")
    return res.status(403).json({ message: "Not authorized" });

  const images = req.files.map((file) => file.path);
  const videos = req.videos.map((file) => file.path);
  if (images.length) payload.images = images;
  if (videos.length) payload.videos = videos;

  Object.assign(post, payload);
  await post.save();
  res.json(post);
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin")
    return res.status(403).json({ message: "Not authorized" });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};
