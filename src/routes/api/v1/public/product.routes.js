import { Router } from "express";

import {
  getAllProductsController,
  getProductBySlugController,
  getPublicProductByIdController,
} from "../../../../controllers/product.controller.js";

const router = Router();

// Get all active products
router.get("/", getAllProductsController);

// Get product by slug
router.get("/slug/:slug", getProductBySlugController);

// Get product by ID (public details only)
router.get("/:id", getPublicProductByIdController);

export default router;