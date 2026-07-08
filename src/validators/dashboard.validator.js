import { z } from "zod";

export const revenueQuerySchema = z.object({
  range: z
    .enum(["7d", "30d", "90d", "6m", "1y"])
    .default("30d"),
});

export const recentOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(5),
});

export const notificationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

export const topProductsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(5),
});