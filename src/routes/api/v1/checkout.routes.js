import { Router } from "express";
import authenticate from "../../../middlewares/auth.middleware.js";
import {
  createRazorpayOrderController,
  verifyPaymentController
} from "../../../controllers/checkout.controller.js";

const router = Router();

router.use(authenticate);

router.post(
  "/create-order",
  createRazorpayOrderController
);


router.post(
  "/verify-payment",
  verifyPaymentController
);

export default router;