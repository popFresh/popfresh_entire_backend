import { z } from "zod";

// ======================================================
// Search Orders
// ======================================================

export const searchFeedbackOrdersSchema = z.object({
  query: z
    .string()
    .trim()
    .min(
      1,
      "Please enter your phone number, email or order number."
    ),
});

// ======================================================
// Submit Feedback
// ======================================================

export const submitFeedbackSchema = z.object({
  orderId: z
    .string()
    .trim()
    .min(1, "Order ID is required."),

  rating: z
    .number({
      required_error: "Rating is required.",
    })
    .int("Rating must be a whole number.")
    .min(1, "Rating must be between 1 and 5.")
    .max(5, "Rating must be between 1 and 5."),

  message: z
    .string()
    .trim()
    .max(
      1000,
      "Feedback cannot exceed 1000 characters."
    )
    .optional(),
});