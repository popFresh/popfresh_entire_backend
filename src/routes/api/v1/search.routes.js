import express from "express";

import searchController from "../../../controllers/search.controller.js";

import authenticate from "../../../middlewares/auth.middleware.js";

const router = express.Router();

// ==============================================
// PROTECTED ROUTES
// ==============================================

router.use(authenticate);

// ==============================================
// GLOBAL SEARCH
// ==============================================

// Search Products, Customers & Orders
router.get(
  "/",
  searchController.search
);

export default router;