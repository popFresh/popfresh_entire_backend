import {z} from "zod";

export const createComboConfigSchema = z.object({
  packSize: z
    .number()
    .int()
    .refine(
      (value) => [2, 3, 4].includes(value),
      "Pack size must be 2, 3, or 4."
    ),

  price: z
    .number()
    .positive("Price must be greater than 0."),

  discountPrice: z
    .number()
    .positive("Discount price must be greater than 0.")
    .optional()
    .nullable(),

  isActive: z
    .boolean()
    .optional(),
});

export const updateComboConfigSchema = z.object({
  price: z
    .number()
    .positive("Price must be greater than 0.")
    .optional(),

  discountPrice: z
    .number()
    .positive("Discount price must be greater than 0.")
    .optional()
    .nullable(),

  isActive: z
    .boolean()
    .optional(),
});