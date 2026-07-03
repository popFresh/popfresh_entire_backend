import { Router } from "express";

import {
  getAllOrdersController,
  getOrderByIdController,
  getOrderStatsController,
  updateOrderStatusController,
} from "../../../controllers/order.controller.js";

const router = Router();

// ==============================================
// GET ORDER DASHBOARD STATS
// GET /api/v1/orders/stats
// ==============================================

router.get(
  "/stats",
  getOrderStatsController
);

// ==============================================
// GET ALL ORDERS
// GET /api/v1/orders
// ==============================================

router.get(
  "/",
  getAllOrdersController
);

// ==============================================
// GET ORDER BY ID
// GET /api/v1/orders/:id
// ==============================================

router.get(
  "/:id",
  getOrderByIdController
);

// ==============================================
// UPDATE ORDER STATUS
// PATCH /api/v1/orders/:id/status
// ==============================================

router.patch(
  "/:id/status",
  updateOrderStatusController
);

export default router;