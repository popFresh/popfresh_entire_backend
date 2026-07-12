import { z } from "zod";

export const createManualShipmentSchema = z.object({
  partnerName: z
    .string()
    .trim()
    .min(2, "Partner name is required.")
    .max(100, "Partner name is too long."),

  driverName: z
    .string()
    .trim()
    .max(100, "Driver name is too long.")
    .optional()
    .or(z.literal("")),

  driverPhone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number.")
    .optional()
    .or(z.literal("")),

  trackingNumber: z
    .string()
    .trim()
    .max(100, "Tracking number is too long.")
    .optional()
    .or(z.literal("")),

  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),
});



export const updateManualShipmentStatusSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),
});

export const markManualShipmentDeliveredSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),
});