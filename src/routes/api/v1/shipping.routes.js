import { Router } from "express";
import authenticate from "../../../middlewares/auth.middleware.js";
import {
    getShippingDashboardController,
} from "../../../controllers/shipping.controller.js";

const router = Router();
router.use(authenticate);
/**
 * Shipping Dashboard
 */
router.get(
    "/",
    getShippingDashboardController
);

export default router;