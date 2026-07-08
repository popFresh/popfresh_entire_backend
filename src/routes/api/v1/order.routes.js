import { Router } from "express";
import authenticate from "../../../middlewares/auth.middleware.js";
import {
  getAllOrdersController,
  getOrderByIdController,
  getOrderStatsController,
  updateOrderStatusController,
  createShipmentController,
  assignAwbController,
  generateLabelController,
  generateInvoiceController,
  generateManifestController,
  schedulePickupController,
  getTrackingController,
  cancelShipmentController,
  getServiceabilityController
} from "../../../controllers/order.controller.js";

const router = Router();
router.use(authenticate);

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



router.post("/:id/create-shipment", createShipmentController);

router.post(
    "/:id/assign-awb",
    assignAwbController
);

router.post(
    "/:id/generate-label",
    generateLabelController
);


router.post(
    "/:id/generate-invoice",
    generateInvoiceController
);


router.post(
    "/:id/generate-manifest",
    generateManifestController
);


router.post(
    "/:id/schedule-pickup",
    schedulePickupController
);


router.get(
    "/:id/serviceability",
    getServiceabilityController
);

// ==============================================
// GET SHIPMENT TRACKING
// GET /api/v1/orders/:id/tracking
// ==============================================

router.get(
    "/:id/tracking",
    getTrackingController
);

router.post(
    "/:id/cancel-shipment",
    cancelShipmentController
);

export default router;