import express from "express";
import authenticate from "../../../middlewares/auth.middleware.js";
import { testWhatsApp } from "../../../controllers/whatsapp.controller.js";

const router = express.Router();
router.use(authenticate);

router.post("/test", testWhatsApp);

export default router;