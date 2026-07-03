import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(60, "Slug cannot exceed 60 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
});

export const updateCategorySchema = createCategorySchema.partial();