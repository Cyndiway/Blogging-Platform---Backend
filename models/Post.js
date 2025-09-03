import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },
    body: { type: String, required: true, trim: true, minlength: 10 },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

// Text index for search
postSchema.index({ title: "text", body: "text" });

// Optional: Static method to get only non-deleted posts
postSchema.statics.findActive = function (filter = {}) {
  return this.find({ deletedAt: null, ...filter });
};

const Post = mongoose.model("Post", postSchema);

export default Post;
