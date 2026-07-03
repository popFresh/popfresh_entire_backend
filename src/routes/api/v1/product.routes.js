import { Router } from "express";

import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getProductBySlugController,
  updateFeaturedController,
  updateProductStatusController,
  updateStockController,
  deleteProductImageController,
  getPublicProductByIdController
} from "../../../controllers/product.controller.js";

import upload from "../../../middlewares/upload.middleware.js";
import {
  uploadProductImagesController,
} from "../../../controllers/product.controller.js";

const router = Router();

// ==============================================
// CREATE PRODUCT
// POST /api/v1/products
// ==============================================

router.post("/", createProductController);

// ==============================================
// GET ALL PRODUCTS
// GET /api/v1/products
// ==============================================

router.get("/", getAllProductsController);

// ==============================================
// GET PRODUCT BY ID
// GET /api/v1/products/:id
// ==============================================



// Get Product By Slug
router.get("/slug/:slug", getProductBySlugController);

router.get("/:id", getProductByIdController);

router.get(
    "/public/:id",
    getPublicProductByIdController
);

// ==============================================
// UPDATE PRODUCT
// PATCH /api/v1/products/:id
// ==============================================

router.delete(
  "/images/:imageId",
  deleteProductImageController
);

router.patch("/:id", updateProductController);

// ==============================================
// DELETE PRODUCT
// DELETE /api/v1/products/:id
// ==============================================

router.delete("/:id", deleteProductController);




// Toggle Featured
router.patch("/:id/featured", updateFeaturedController);

// Toggle Active
router.patch("/:id/status", updateProductStatusController);

// Update Stock
router.patch("/:id/stock", updateStockController);

router.post(
  "/:id/images",
  upload.array("images", 5),
  uploadProductImagesController
);

export default router;