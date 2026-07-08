import {
  getDashboard,
  getSummary,
  getRevenueChart,
  getRecentOrders,
  getTopSellingProducts,
  getInventoryOverview,
  getCustomerOverview,
  getNotifications,
} from "../services/dashboard.service.js";

const dashboardController = {
  // ==============================================
  // Dashboard
  // ==============================================

  async getDashboard(req, res, next) {
    try {
      const dashboard = await getDashboard(req.user);

      return res.status(200).json({
        success: true,
        message: "Dashboard fetched successfully.",
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  },

  // ==============================================
  // Summary
  // ==============================================

  async getSummary(req, res, next) {
    
    try {
      console.log(req.user); // <-- add this temporarily
      const summary = await getSummary(req.user);

      return res.status(200).json({
        success: true,
        message: "Dashboard summary fetched successfully.",
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  },

  // ==============================================
  // Revenue Chart
  // ==============================================

  async getRevenueChart(req, res, next) {
    try {
      const { range = "30d" } = req.query;

      const revenue = await getRevenueChart(range);

      return res.status(200).json({
        success: true,
        message: "Revenue chart fetched successfully.",
        data: revenue,
      });
    } catch (error) {
      next(error);
    }
  },

  // ==============================================
  // Recent Orders
  // ==============================================

  async getRecentOrders(req, res, next) {
    try {
      const { page = 1, limit = 5 } = req.query;

      const orders = await getRecentOrders({
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        message: "Recent orders fetched successfully.",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  },

  // ==============================================
  // Top Selling Products
  // ==============================================

  async getTopSellingProducts(req, res, next) {
    try {
      const { limit = 5 } = req.query;

      const products = await getTopSellingProducts(limit);

      return res.status(200).json({
        success: true,
        message: "Top selling products fetched successfully.",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  },

  // ==============================================
  // Inventory
  // ==============================================

  async getInventoryOverview(req, res, next) {
    try {
      const inventory = await getInventoryOverview();

      return res.status(200).json({
        success: true,
        message: "Inventory overview fetched successfully.",
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  },

  // ==============================================
  // Customers
  // ==============================================

  async getCustomerOverview(req, res, next) {
    try {
      const customers = await getCustomerOverview();

      return res.status(200).json({
        success: true,
        message: "Customer overview fetched successfully.",
        data: customers,
      });
    } catch (error) {
      next(error);
    }
  },

  // ==============================================
  // Notifications
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
};

export default dashboardController;