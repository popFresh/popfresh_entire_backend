import { z } from "zod";

export const shiprocketWebhookSchema = z
  .object({
    // Identifiers
    awb: z.union([z.string(), z.number()]).optional(),
    shipment_id: z.union([z.string(), z.number()]).optional(),
    sr_order_id: z.union([z.string(), z.number()]).optional(),
    order_id: z.union([z.string(), z.number()]).optional(),

    // Status
    current_status: z.string().min(1),
    current_status_id: z.number().optional(),
    shipment_status: z.string().optional(),
    shipment_status_id: z.number().optional(),
    status: z.string().optional(),

    // Courier
    courier_name: z.string().nullable().optional(),
    tracking_url: z.string().url().optional(),

    // Dates
    current_timestamp: z.string().optional(),
    event_time: z.string().optional(),
    delivered_date: z.string().optional(),
    pickup_date: z.string().optional(),
    awb_assigned_date: z.string().nullable().optional(),
    pickup_scheduled_date: z.string().nullable().optional(),
    etd: z.string().optional(),

    // Tracking scans
    scans: z.array(z.any()).nullable().optional(),

    // Optional webhook fields
    return_awb_code: z.string().optional(),
    is_return: z.number().optional(),
    channel_id: z.number().optional(),
    channel: z.string().optional(),

    pod_status: z.string().optional(),
    pod: z.string().optional(),

    shipping_method: z.string().optional(),

    pickup_exception_reason: z.string().optional(),
    pick_exception_reason_code: z.string().optional(),

    undelivered_reason: z.string().optional(),
    undelivered_reason_code: z.string().optional(),

    qc_image: z.string().optional(),
    qc_failure_reason: z.string().optional(),

    delivery_attempt_count: z.number().optional(),
    pickup_attempt_count: z.number().optional(),

    date: z.string().optional(),
  })
  .refine(
    (data) =>
      !!(
        (typeof data.awb === "string"
          ? data.awb.trim()
          : data.awb) ||
        (typeof data.shipment_id === "string"
          ? data.shipment_id.trim()
          : data.shipment_id) ||
        (typeof data.sr_order_id === "string"
          ? data.sr_order_id.trim()
          : data.sr_order_id) ||
        (typeof data.order_id === "string"
          ? data.order_id.trim()
          : data.order_id)
      ),
    {
      message:
        "At least one shipment identifier (AWB, Shipment ID, Shiprocket Order ID or Order ID) is required.",
      path: ["awb"],
    }
  );

export const validateShiprocketWebhook = (payload) => {
  return shiprocketWebhookSchema.safeParse(payload);
};