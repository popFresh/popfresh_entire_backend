import { Router } from "express";
import authenticate from "../../../middlewares/auth.middleware.js";
import {

  createShippingRuleController,
  getShippingRuleController,
  updateShippingRuleController

} from "../../../controllers/shippingRule.controller.js";

const router = Router();
router.use(authenticate);

//COMMENTED TEMPORARILY BECAUSE DONT WANT TO CREATE MORE RULES
// router.post(

//   "/",

//   createShippingRuleController

// );

router.get(
  "/",
  getShippingRuleController
);

router.put(
  "/",
  updateShippingRuleController
);

export default router;