import { z } from "zod";

export const trackOrderSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Please enter your phone number, email or order number."),
});