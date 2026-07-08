import express from "express";
import authenticate from "../../../middlewares/auth.middleware.js";
import { healthCheck } from "../../../controllers/health.controller.js";

const router = express.Router();
router.use(authenticate);
router.get("/", healthCheck);

export default router;