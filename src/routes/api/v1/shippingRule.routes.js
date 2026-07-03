import { Router } from "express";

import {

  createShippingRuleController,
  getShippingRuleController,
  updateShippingRuleController

} from "../../../controllers/shippingRule.controller.js";

const router = Router();


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