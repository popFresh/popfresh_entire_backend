import { z } from "zod";

const productSchema = z.object({

  // ==========================================
  // BASIC INFORMATION
  // ==========================================

  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  sku: z
    .string()
    .trim()
    .min(2, "SKU is required")
    .max(50),

  description: z
    .string()
    .trim()
    .min(10, "Description is too short")
    .max(3000),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  discountPrice: z.coerce
    .number()
    .positive()
    .optional(),

  stock: z.coerce
    .number()
    .int()
    .min(0),

  weight: z
    .string()
    .trim()
    .optional(),

  categoryId: z
    .string()
    .trim()
    .min(1, "Category is required"),

  // ==========================================
  // PRODUCT SETTINGS
  // ==========================================

  isFeatured: z
    .boolean()
    .optional()
    .default(false),

  isActive: z
    .boolean()
    .optional()
    .default(true),

  // ==========================================
  // DISPLAY SETTINGS
  // ==========================================

  badge: z
    .string()
    .trim()
    .optional()
    .nullable(),

  cardTheme: z
    .string()
    .trim()
    .optional()
    .default("GREEN"),

  highlights: z
    .array(z.string())
    .optional()
    .default([]),

  displayOrder: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .default(0),

});

// ==========================================
// CREATE PRODUCT
// ==========================================

export const createProductSchema = productSchema.refine(

  (data) =>

    data.discountPrice === undefined ||

    data.discountPrice < data.price,

  {

    path: ["discountPrice"],

    message:
      "Discount price must be less than price",

  }

);

// ==========================================
// UPDATE PRODUCT
// ==========================================

export const updateProductSchema =
  productSchema.partial();

// import { z } from "zod";

// const productSchema = z.object({
//   name: z
//     .string()
//     .trim()
//     .min(2, "Product name must be at least 2 characters")
//     .max(100, "Product name cannot exceed 100 characters"),

// //   slug: z
// //     .string()
// //     .trim()
// //     .min(2, "Slug is required")
// //     .max(100),

//   sku: z
//     .string()
//     .trim()
//     .min(2, "SKU is required")
//     .max(50),

//   description: z
//     .string()
//     .trim()
//     .min(10, "Description is too short")
//     .max(3000),

//   price: z.coerce.number().positive(),

//   discountPrice: z.coerce.number().positive().optional(),

//   stock: z.coerce.number().int().min(0),

//   weight: z.string().trim().optional(),

//   categoryId: z.string().trim(),

//   isFeatured: z.boolean().optional().default(false),

//   isActive: z.boolean().optional().default(true),
// });

// export const createProductSchema = productSchema.refine(
//   (data) =>
//     data.discountPrice === undefined ||
//     data.discountPrice < data.price,
//   {
//     path: ["discountPrice"],
//     message: "Discount price must be less than price",
//   }
// );

// export const updateProductSchema = productSchema.partial();