import { Router } from "express";

import {
  createRazorpayOrderController,
  verifyPaymentController,
} from "../../../../controllers/checkout.controller.js";

const router = Router();

// Public routes
router.post("/create-order", createRazorpayOrderController);

router.post("/verify-payment", verifyPaymentController);

export default router;