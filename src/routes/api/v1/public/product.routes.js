import { Router } from "express";

import {
  getAllProductsController,
  getProductBySlugController,
  getPublicProductByIdController,
  getComboOptionsController,
} from "../../../../controllers/product.controller.js";

const router = Router();

// ==============================================
// GET ALL ACTIVE PRODUCTS
// GET /api/v1/public/products
// ==============================================

router.get(
  "/",
  getAllProductsController
);

// ==============================================
// GET COMBO OPTIONS
// GET /api/v1/public/products/combo-options
// ==============================================

router.get(
  "/combo-options",
  getComboOptionsController
);

// ==============================================
// GET PRODUCT BY SLUG
// GET /api/v1/public/products/slug/:slug
// ==============================================

router.get(
  "/slug/:slug",
  getProductBySlugController
);

// ==============================================
// GET PRODUCT BY ID
// GET /api/v1/public/products/:id
// ==============================================

router.get(
  "/:id",
  getPublicProductByIdController
);

export default router;


// import { Router } from "express";


// import {
//   getAllProductsController,
//   getProductBySlugController,
//   getPublicProductByIdController,
// } from "../../../../controllers/product.controller.js";

// const router = Router();

// // Get all active products
// router.get("/", getAllProductsController);

// // Get product by slug
// router.get("/slug/:slug", getProductBySlugController);

// // Get product by ID (public details only)
// router.get("/:id", getPublicProductByIdController);

// export default router;