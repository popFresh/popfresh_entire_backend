import { Router } from "express";

import {
  getAllCustomersController,
  getCustomerByIdController,
  getCustomerStatsController,
  exportCustomersController,
} from "../../../controllers/customer.controller.js";

const router = Router();

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