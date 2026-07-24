import { Router } from "express";
import { trackOrderController } from "../../../../controllers/orderTracking.controller.js";

const router = Router();

router.get("/orders/track", trackOrderController);

export default router;