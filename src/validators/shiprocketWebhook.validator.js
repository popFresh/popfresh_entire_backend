import { z } from "zod";

export const shiprocketWebhookSchema = z
  .object({
    awb: z.union([z.string(), z.number()]).optional(),
    shipment_id: z.union([z.string(), z.number()]).optional(),
    order_id: z.union([z.string(), z.number()]).optional(),
    courier_name: z.string().optional(),
    current_status: z.string().min(1),
    shipment_status: z.string().optional(),
    status: z.string().optional(),
    tracking_url: z.string().url().optional(),
    event_time: z.string().optional(),
    delivered_date: z.string().optional(),
    pickup_date: z.string().optional(),
    scans: z.array(z.any()).optional(),
  })
  .refine((data) => data.awb || data.shipment_id, {
    message: "Either AWB or Shipment ID is required",
    path: ["awb"],
  });

export const validateShiprocketWebhook = (payload) => {
  return shiprocketWebhookSchema.safeParse(payload);
};