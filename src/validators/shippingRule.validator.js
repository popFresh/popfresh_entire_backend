import { z } from "zod";

export const createShippingRuleSchema = z.object({

  freeShippingThreshold: z.coerce
    .number()
    .min(0),

  shippingCharge: z.coerce
    .number()
    .min(0),

  isActive: z
    .boolean()
    .optional(),

});

export const updateShippingRuleSchema =
  createShippingRuleSchema.partial();