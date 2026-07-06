import { Router } from "express";

import {
    getShippingDashboardController,
} from "../../../controllers/shipping.controller.js";

const router = Router();

/**
 * Shipping Dashboard
 */
router.get(
    "/",
    getShippingDashboardController
);

export default router;