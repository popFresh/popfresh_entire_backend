import { Router } from "express";

import {
  searchFeedbackOrdersController,
  submitFeedbackController,
} from "../../../../controllers/feedback.controller.js";

const router = Router();

// Search Orders

router.get(
  "/orders",
  searchFeedbackOrdersController
);

// Submit Feedback

router.post(
  "/",
  submitFeedbackController
);

export default router;