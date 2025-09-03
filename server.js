import express, { urlencoded } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import authRoutes from "./Routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
// ... your existing imports

import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();
// Security & parsing
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true }))

// Basic rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300, // adjust for your needs
    standardHeaders: true,
    legacyHeaders: false
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);

// 404 + Error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
