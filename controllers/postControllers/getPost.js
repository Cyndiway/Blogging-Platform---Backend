import Post from "../../models/Post.js";

export const getAllPosts = async (req, res) => {
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
    if (tag) query.tags = { $in: [tag] };
    if (title) query.$text = { $search: title };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "username");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
