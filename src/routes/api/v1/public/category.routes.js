import { Router } from "express";

import {
  getAllCategoriesController,
  getCategoryByIdController,
} from "../../../../controllers/category/category.controller.js";

const router = Router();

// Public routes
router.get("/", getAllCategoriesController);

router.get("/:id", getCategoryByIdController);

export default router;