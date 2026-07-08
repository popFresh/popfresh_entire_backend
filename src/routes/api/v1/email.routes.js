import express from "express";
import authenticate from "../../../middlewares/auth.middleware.js";
import { sendTestEmail } from "../../../controllers/email.controller.js";

const router = express.Router();
router.use(authenticate);
router.post("/test", sendTestEmail);

export default router;