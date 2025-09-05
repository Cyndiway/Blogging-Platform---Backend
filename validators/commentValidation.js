import { z } from "zod";

const commentCreateSchema = z.object({
  text: z
    .string()
    .min(1, "Text is required")
    .max(500, "Text must be at most 500 characters"),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  videos: z.array(z.string().url("Invalid video URL")).optional(),
});
const commentEditSchema = commentCreateSchema.partial();
export { commentCreateSchema, commentEditSchema };
