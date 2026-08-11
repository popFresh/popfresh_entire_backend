import { z } from "zod";

export const createRazorpayOrderSchema = z.object({
  currency: z.string().default("INR"),

  cartItems: z.array(
    z.discriminatedUnion("type", [
      // ==========================================
      // NORMAL PRODUCT
      // ==========================================

      z.object({
        type: z.literal("PRODUCT"),

        id: z.string(),

        quantity: z
          .number()
          .int()
          .positive(),
      }),

      // ==========================================
      // COMBO
      // ==========================================

      z.object({
        type: z.literal("COMBO"),

        packSize: z
          .number()
          .int()
          .refine(
            (value) => [2, 3, 4].includes(value),
            {
              message:
                "Invalid combo pack size.",
            }
          ),

        quantity: z
          .number()
          .int()
          .positive(),

        selections: z
          .array(
            z.object({
              productId: z.string(),

              quantity: z
                .number()
                .int()
                .positive()
                .default(1),
            })
          )
          .min(1),
      }),
    ])
  ),

  couponCode: z
    .string()
    .optional()
    .nullable(),
});


// import { z } from "zod";

// export const createRazorpayOrderSchema = z.object({
//   currency: z.string().default("INR"),

//   cartItems: z.array(
//     z.object({
//       id: z.string(),
//       quantity: z.number().positive(),
//     })
//   ),

//   couponCode: z.string().optional().nullable(),
// });