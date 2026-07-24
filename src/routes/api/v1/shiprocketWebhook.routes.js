import express from "express";
import { handleShiprocketWebhook } from "../../../controllers/shiprocketWebhook.controller.js";

const router = express.Router();

router.post("/", handleShiprocketWebhook);

export default router;