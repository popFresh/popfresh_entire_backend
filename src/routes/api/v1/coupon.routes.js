import { Router } from "express";

import {

  createCouponController,
  getCouponsController,
  getCouponByIdController,
  updateCouponController,
  applyCouponController

} from "../../../controllers/coupon.controller.js";

const router = Router();

router.post(

  "/",

  createCouponController

);

router.get(
  "/",
  getCouponsController
);

router.get(
  "/:id",
  getCouponByIdController
);

router.put(
  "/:id",
  updateCouponController
);

router.post(
  "/apply",
  applyCouponController
);

export default router;