import { Router } from "express";

import {

  getShippingRuleController,

} from "../../../../controllers/shippingRule.controller.js";

const router = Router();

router.get(

  "/",

  getShippingRuleController

);

export default router;