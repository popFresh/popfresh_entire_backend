import { Router } from "express";
import authenticate from "../../../middlewares/auth.middleware.js";

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
  getPublicProductByIdController,
  getComboOptionsController,
  uploadProductImagesController,
} from "../../../controllers/product.controller.js";

import upload from "../../../middlewares/upload.middleware.js";

const router = Router();

router.use(authenticate);

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
// GET COMBO OPTIONS - PUBLIC
// GET /api/v1/products/combo-options
// ==============================================
//
// IMPORTANT:
// This must come BEFORE /:id
// otherwise "combo-options" can be treated as an ID.
//

router.get(
  "/combo-options",
  getComboOptionsController
);

// ==============================================
// GET PRODUCT BY SLUG
// GET /api/v1/products/slug/:slug
// ==============================================

router.get(
  "/slug/:slug",
  getProductBySlugController
);

// ==============================================
// GET PRODUCT BY ID - PUBLIC
// GET /api/v1/products/public/:id
// ==============================================

router.get(
  "/public/:id",
  getPublicProductByIdController
);

// ==============================================
// GET PRODUCT BY ID
// GET /api/v1/products/:id
// ==============================================

router.get(
  "/:id",
  getProductByIdController
);

// ==============================================
// DELETE PRODUCT IMAGE
// DELETE /api/v1/products/images/:imageId
// ==============================================

router.delete(
  "/images/:imageId",
  deleteProductImageController
);

// ==============================================
// UPDATE PRODUCT
// PATCH /api/v1/products/:id
// ==============================================

router.patch(
  "/:id",
  updateProductController
);

// ==============================================
// DELETE PRODUCT
// DELETE /api/v1/products/:id
// ==============================================

router.delete(
  "/:id",
  deleteProductController
);

// ==============================================
// TOGGLE FEATURED
// PATCH /api/v1/products/:id/featured
// ==============================================

router.patch(
  "/:id/featured",
  updateFeaturedController
);

// ==============================================
// TOGGLE ACTIVE
// PATCH /api/v1/products/:id/status
// ==============================================

router.patch(
  "/:id/status",
  updateProductStatusController
);

// ==============================================
// UPDATE STOCK
// PATCH /api/v1/products/:id/stock
// ==============================================

router.patch(
  "/:id/stock",
  updateStockController
);

// ==============================================
// UPLOAD PRODUCT IMAGES
// POST /api/v1/products/:id/images
// ==============================================

router.post(
  "/:id/images",
  upload.array("images", 5),
  uploadProductImagesController
);

export default router;



// import { Router } from "express";
// import authenticate from "../../../middlewares/auth.middleware.js";
// import {
//   createProductController,
//   getAllProductsController,
//   getProductByIdController,
//   updateProductController,
//   deleteProductController,
//   getProductBySlugController,
//   updateFeaturedController,
//   updateProductStatusController,
//   updateStockController,
//   deleteProductImageController,
//   getPublicProductByIdController
// } from "../../../controllers/product.controller.js";

// import upload from "../../../middlewares/upload.middleware.js";
// import {
//   uploadProductImagesController,
// } from "../../../controllers/product.controller.js";

// const router = Router();
// router.use(authenticate);

// // ==============================================
// // CREATE PRODUCT
// // POST /api/v1/products
// // ==============================================

// router.post("/", createProductController);

// // ==============================================
// // GET ALL PRODUCTS
// // GET /api/v1/products
// // ==============================================

// router.get("/", getAllProductsController);

// // ==============================================
// // GET PRODUCT BY ID
// // GET /api/v1/products/:id
// // ==============================================



// // Get Product By Slug
// router.get("/slug/:slug", getProductBySlugController);

// router.get("/:id", getProductByIdController);

// router.get(
//     "/public/:id",
//     getPublicProductByIdController
// );

// // ==============================================
// // UPDATE PRODUCT
// // PATCH /api/v1/products/:id
// // ==============================================

// router.delete(
//   "/images/:imageId",
//   deleteProductImageController
// );

// router.patch("/:id", updateProductController);

// // ==============================================
// // DELETE PRODUCT
// // DELETE /api/v1/products/:id
// // ==============================================

// router.delete("/:id", deleteProductController);




// // Toggle Featured
// router.patch("/:id/featured", updateFeaturedController);

// // Toggle Active
// router.patch("/:id/status", updateProductStatusController);

// // Update Stock
// router.patch("/:id/stock", updateStockController);

// router.post(
//   "/:id/images",
//   upload.array("images", 5),
//   uploadProductImagesController
// );

// export default router;