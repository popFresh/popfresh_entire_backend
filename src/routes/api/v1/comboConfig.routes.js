import { Router } from "express";

import authenticate from "../../../middlewares/auth.middleware.js";

import {
  createComboConfigController,
  getAllComboConfigsController,
  getComboConfigByPackSizeController,
  updateComboConfigController,
  deleteComboConfigController,
  getActiveComboConfigsController,
} from "../../../controllers/comboConfig.controller.js";

const router = Router();


// ==============================================
// ADMIN ROUTES
// ==============================================

router.use(authenticate);


// Create combo config
// POST /api/v1/combo-config
router.post(
  "/",
  createComboConfigController
);


// Get all combo configs
// GET /api/v1/combo-config
router.get(
  "/",
  getAllComboConfigsController
);


// Get combo config by pack size
// GET /api/v1/combo-config/:packSize
router.get(
  "/:packSize",
  getComboConfigByPackSizeController
);


// Update combo config
// PATCH /api/v1/combo-config/:packSize
router.patch(
  "/:packSize",
  updateComboConfigController
);


// Delete combo config
// DELETE /api/v1/combo-config/:packSize
router.delete(
  "/:packSize",
  deleteComboConfigController
);


export default router;