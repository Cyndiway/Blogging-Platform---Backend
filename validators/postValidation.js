import { z } from "zod";

export const postCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters"),
  body: z.string().trim().min(10, "Body must be at least 10 characters"),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  videos: z.array(z.string().url("Invalid video URL")).optional(),
});

export const postUpdateSchema = postCreateSchema.partial();
