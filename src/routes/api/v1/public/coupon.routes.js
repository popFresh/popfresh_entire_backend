import { Router } from "express";

import {
  applyCouponController,
} from "../../../../controllers/coupon.controller.js";

const router = Router();

router.post(
  "/apply",
  applyCouponController
);

export default router;