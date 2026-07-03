import { z } from "zod";

export const createRazorpayOrderSchema = z.object({
  currency: z.string().default("INR"),

  cartItems: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().positive(),
    })
  ),

  couponCode: z.string().optional().nullable(),
});