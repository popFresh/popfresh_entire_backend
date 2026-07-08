import { Router } from "express";

import authenticate from "../../../middlewares/auth.middleware.js";

import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "../../../controllers/category/category.controller.js";

const router = Router();

// Protect all category routes
router.use(authenticate);

router.post("/", createCategoryController);

router.get("/", getAllCategoriesController);

router.get("/:id", getCategoryByIdController);

router.patch("/:id", updateCategoryController);

router.delete("/:id", deleteCategoryController);

export default router;