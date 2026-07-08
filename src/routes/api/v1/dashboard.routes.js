import express from "express";

import dashboardController from "../../../controllers/dashboard.controller.js";

import authenticate from "../../../middlewares/auth.middleware.js";

const router = express.Router();

// ==============================================
// PROTECTED ROUTES
// ==============================================

router.use(authenticate);

// ==============================================
// DASHBOARD
// ==============================================

// Dashboard Overview (All Dashboard Data)
router.get(
  "/",
  dashboardController.getDashboard
);

// Dashboard Summary (KPI Cards)
router.get(
  "/summary",
  dashboardController.getSummary
);

// Revenue Chart
router.get(
  "/revenue",
  dashboardController.getRevenueChart
);

// Recent Orders
router.get(
  "/recent-orders",
  dashboardController.getRecentOrders
);

// Top Selling Products
router.get(
  "/top-products",
  dashboardController.getTopSellingProducts
);

// Inventory Overview
router.get(
  "/inventory",
  dashboardController.getInventoryOverview
);

// Customer Overview
router.get(
  "/customers",
  dashboardController.getCustomerOverview
);

// Notifications
router.get(
  "/notifications",
  dashboardController.getNotifications
);

export default router;

// import express from "express";

// import {getSummary,
//   getRevenueChart,
//   getRecentOrders,
//   getNotifications,
//   getTopSellingProducts,
//   getCustomerOverview,
//   getInventoryOverview,
  
// } from "../../../controllers/dashboard.controller.js";

// import authenticate from "../../../middlewares/auth.middleware.js";

// const router = express.Router();

// // ==============================================
// // PROTECTED ROUTES
// // ==============================================

// router.use(authenticate);

// // ==============================================
// // DASHBOARD
// // ==============================================

// // Dashboard Summary
// router.get(
//   "/summary",
//   getSummary
// );

// // Revenue Chart
// router.get(
//   "/revenue",
//   getRevenueChart
// );

// // Recent Orders
// router.get(
//   "/recent-orders",
//   getRecentOrders
// );

// // Dashboard Notifications
// router.get(
//   "/notifications",
//   getNotifications
// );

// // Top Selling Products
// router.get(
//   "/top-products",
//   getTopSellingProducts
// );

// // Inventory Overview
// router.get(
//   "/inventory",
//   getInventoryOverview
// );

// // Customer Overview
// router.get(
//   "/customers",
//   getCustomerOverview
// );

// export default router;