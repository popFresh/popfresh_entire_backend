// src/controllers/notification.controller.js

import {
  getNotifications,
  markAllAsRead,
  markNotificationAsRead,
} from "../services/notification.service.js";

const notificationController = {
  // ==============================================
  // Get Notifications
  // ==============================================

  async getNotifications(req, res, next) {
    try {
      const notifications = await getNotifications();

      return res.status(200).json({
        success: true,
        message: "Notifications fetched successfully.",
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  // ==============================================
  // Mark All Notifications As Read
  // ==============================================

  async markAllAsRead(req, res, next) {
    try {
      await markAllAsRead();

      return res.status(200).json({
        success: true,
        message: "All notifications marked as read.",
      });
    } catch (error) {
      next(error);
    }
  },

  // ==============================================
  // Mark Single Notification As Read
  // ==============================================

  async markNotificationAsRead(req, res, next) {
    try {
      const { id } = req.params;

      await markNotificationAsRead(id);

      return res.status(200).json({
        success: true,
        message: "Notification marked as read.",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default notificationController;