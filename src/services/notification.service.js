// src/services/notification.service.js

import prisma from "../lib/prisma.js";

// ==============================================
// Create Notification
// ==============================================

export const createNotification = async ({
  type,
  title,
  message,
  route,
  entityId,
  priority = "NORMAL",
}) => {
  return prisma.notification.create({
    data: {
      type,
      title,
      message,
      route,
      entityId,
      priority,
    },
  });
};

// ==============================================
// Get Notifications
// ==============================================

export const getNotifications = async () => {
  return prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });
};

// ==============================================
// Mark All As Read
// ==============================================

export const markAllAsRead = async () => {
  return prisma.notification.updateMany({
    where: {
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};

// ==============================================
// Mark Single Notification As Read
// ==============================================

export const markNotificationAsRead = async (id) => {
  return prisma.notification.update({
    where: {
      id,
    },
    data: {
      isRead: true,
    },
  });
};

// ==============================================
// Delete Old Notifications (Optional)
// ==============================================

export const deleteOldNotifications = async () => {
  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 30
  );

  return prisma.notification.deleteMany({
    where: {
      createdAt: {
        lt: thirtyDaysAgo,
      },
    },
  });
};