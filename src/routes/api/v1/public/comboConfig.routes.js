import { Router } from "express";

import {
  getActiveComboConfigsController,
} from "../../../../controllers/comboConfig.controller.js";

const router = Router();

router.get("/", getActiveComboConfigsController);

export default router;