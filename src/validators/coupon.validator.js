import { z } from "zod";

export const createCouponSchema = z.object({

  code: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .transform((value) => value.toUpperCase()),

  description: z
    .string()
    .optional(),

  discountType: z.enum([
    "PERCENTAGE",
    "FLAT",
  ]),

  discountValue: z.coerce
    .number()
    .positive(),

  minimumOrder: z.coerce
    .number()
    .min(0),

  maximumDiscount: z.coerce
    .number()
    .positive()
    .optional(),

  usageLimit: z.coerce
    .number()
    .int()
    .positive()
    .optional(),

  startDate: z
    .string()
    .datetime()
    .optional(),

  expiryDate: z
    .string()
    .datetime()
    .optional(),

  isActive: z
    .boolean()
    .optional(),

});

export const updateCouponSchema =
  createCouponSchema.partial();

  export const applyCouponSchema = z.object({

  code: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase()),

  cartItems: z.array(

    z.object({

      id: z.string(),

      quantity: z.coerce
        .number()
        .int()
        .positive(),

    })

  ).min(1),

});