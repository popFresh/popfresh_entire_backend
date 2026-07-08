import { Router } from "express";
import authenticate from "../../../middlewares/auth.middleware.js";
import {
  getAllCustomersController,
  getCustomerByIdController,
  getCustomerStatsController,
  exportCustomersController,
} from "../../../controllers/customer.controller.js";

const router = Router();

router.use(authenticate);
// ==============================================
// GET CUSTOMER DASHBOARD STATS
// GET /api/v1/customers/stats
// ==============================================

router.get(
  "/stats",
  getCustomerStatsController
);

// ==============================================
// EXPORT CUSTOMERS
// GET /api/v1/customers/export
// ==============================================

router.get(
  "/export",
  exportCustomersController
);

// ==============================================
// GET ALL CUSTOMERS
// GET /api/v1/customers
// ==============================================

router.get(
  "/",
  getAllCustomersController
);

// ==============================================
// GET CUSTOMER BY ID
// GET /api/v1/customers/:id
// ==============================================

router.get(
  "/:id",
  getCustomerByIdController
);

export default router;