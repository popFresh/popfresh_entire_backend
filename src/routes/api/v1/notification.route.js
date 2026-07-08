import express from "express";
import authenticate from "../../../middlewares/auth.middleware.js";
import notificationController from "../../../controllers/notification.controller.js";

const router = express.Router();

// ==============================================
// Notifications
// ==============================================

router.get(
  "/",
  authenticate,
  notificationController.getNotifications
);

router.patch(
  "/read-all",
  authenticate,
  notificationController.markAllAsRead
);

router.patch(
  "/:id/read",
  authenticate,
  notificationController.markNotificationAsRead
);

export default router;