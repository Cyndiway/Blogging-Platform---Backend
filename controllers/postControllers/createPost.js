import Post from "../../models/Post.js";
import { postCreateSchema } from "../../validators/postValidation.js";

export const createPost = async (req, res) => {
  try {
    // Validate input using Zod
    const parsed = postCreateSchema.parse({
      title: req.body.title,
      body: req.body.body, // Use 'body' to match your model
      images: req.files?.images?.map((file) => file.filename) || [],
      videos: req.files?.videos?.map((file) => file.filename) || [],
    });

    const post = await Post.create({
      ...parsed,
      author: req.user._id,
    });

    req.user.posts.push(post._id);
    await req.user.save();

    res.status(201).json(post);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
