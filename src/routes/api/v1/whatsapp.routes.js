import express from "express";
import { testWhatsApp } from "../../../controllers/whatsapp.controller.js";

const router = express.Router();

router.post("/test", testWhatsApp);

export default router;