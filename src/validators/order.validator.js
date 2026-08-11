import { z } from "zod";

// ==========================================
// ORDER STATUS ENUM
// ==========================================

const ORDER_STATUS = [
  "PENDING",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

export const updateOrderStatusSchema = z
  .object({
    status: z.enum(ORDER_STATUS, {
      errorMap: () => ({
        message: "Invalid order status.",
      }),
    }),

    courierName: z
      .string()
      .trim()
      .optional(),

    trackingNumber: z
      .string()
      .trim()
      .optional(),

    trackingUrl: z
  .string()
  .trim()
  .optional()
  .transform((v) => v || undefined)
  .refine(
    (v) => !v || /^https?:\/\//.test(v),
    {
      message: "Invalid tracking URL.",
    }
  ),

    cancelReason: z
      .string()
      .trim()
      .optional()
      .transform((v) => v || undefined),

    returnReason: z
      .string()
      .trim()
      .optional(),

    internalNote: z
      .string()
      .trim()
      .max(500, "Internal note cannot exceed 500 characters.")
      .optional(),
  })

  .superRefine((data, ctx) => {
    // ==========================================
    // SHIPPED
    // ==========================================

    if (data.status === "SHIPPED") {
      if (!data.courierName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["courierName"],
          message: "Courier name is required.",
        });
      }

      if (!data.trackingNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["trackingNumber"],
          message: "Tracking number is required.",
        });
      }
    }

    // ==========================================
    // CANCELLED
    // ==========================================

    if (data.status === "CANCELLED") {
      if (!data.cancelReason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cancelReason"],
          message: "Cancellation reason is required.",
        });
      }
    }

    // ==========================================
    // RETURNED
    // ==========================================

    if (data.status === "RETURNED") {
      if (!data.returnReason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["returnReason"],
          message: "Return reason is required.",
        });
      }
    }
  });