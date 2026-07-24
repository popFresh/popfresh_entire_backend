// tech.routes.js

import { Router } from "express";
import techController from "../../../controllers/tech.controller.js";

const router = Router();

router.get("/overview", techController.getOverview);
router.get("/logs", techController.getLogs);
router.get("/failed-events", techController.getFailedEvents);

export default router;