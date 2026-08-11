import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  saveProductImages,
  deleteProductImage,
} from "../services/image/image.service.js";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  updateFeaturedStatus,
  updateProductStatus,
  updateProductStock,
  getPublicProductById,
  getComboOptions, // ✅ ADD THIS
} from "../services/product.service.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

// ==============================================
// CREATE PRODUCT
// ==============================================

export const createProductController = asyncHandler(async (req, res) => {
  const validatedData = createProductSchema.parse(req.body);

  const product = await createProduct(validatedData);

  return res.status(201).json(
    new ApiResponse(
      201,
      "Product created successfully.",
      product
    )
  );
});

// ==============================================
// GET ALL PRODUCTS
// ==============================================

export const getAllProductsController = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    search,
    category,
    featured,
    sort,
    isAdmin,
  } = req.query;

  const result = await getAllProducts({
    page,
    limit,
    search,
    category,
    featured,
    sort,
    isAdmin,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Products fetched successfully.",
      result
    )
  );
});

// ==============================================
// GET COMBO OPTIONS
// ==============================================

export const getComboOptionsController = asyncHandler(
  async (req, res) => {
    const products = await getComboOptions();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Combo options fetched successfully.",
        products
      )
    );
  }
);

// ==============================================
// GET PRODUCT BY ID
// ==============================================

export const getProductByIdController = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product fetched successfully.",
      product
    )
  );
});

// ==============================================
// GET PRODUCT BY ID - PUBLIC
// ==============================================

export const getPublicProductByIdController = asyncHandler(
  async (req, res) => {
    const product = await getPublicProductById(req.params.id);

    return res.status(200).json(
      new ApiResponse(
        200,
        "Product fetched successfully.",
        product
      )
    );
  }
);

// ==============================================
// UPDATE PRODUCT
// ==============================================

export const updateProductController = asyncHandler(async (req, res) => {
  const validatedData = updateProductSchema.parse(req.body);

  const updatedProduct = await updateProduct(
    req.params.id,
    validatedData
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product updated successfully.",
      updatedProduct
    )
  );
});

// ==============================================
// DELETE PRODUCT
// ==============================================

export const deleteProductController = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product deleted successfully."
    )
  );
});

// ==============================================
// GET PRODUCT BY SLUG
// ==============================================

export const getProductBySlugController = asyncHandler(async (req, res) => {
  const product = await getProductBySlug(req.params.slug);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product fetched successfully.",
      product
    )
  );
});

// ==============================================
// TOGGLE FEATURED
// ==============================================

export const updateFeaturedController = asyncHandler(async (req, res) => {
  const { isFeatured } = req.body;

  const product = await updateFeaturedStatus(
    req.params.id,
    isFeatured
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Featured status updated successfully.",
      product
    )
  );
});

// ==============================================
// TOGGLE ACTIVE STATUS
// ==============================================

export const updateProductStatusController = asyncHandler(
  async (req, res) => {
    const { isActive } = req.body;

    const product = await updateProductStatus(
      req.params.id,
      isActive
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Product status updated successfully.",
        product
      )
    );
  }
);

// ==============================================
// UPDATE STOCK
// ==============================================

export const updateStockController = asyncHandler(async (req, res) => {
  const { stock } = req.body;

  const product = await updateProductStock(
    req.params.id,
    stock
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Stock updated successfully.",
      product
    )
  );
});

// ==============================================
// UPLOAD PRODUCT IMAGES
// ==============================================

export const uploadProductImagesController = asyncHandler(
  async (req, res) => {
    console.log("Params:", req.params);
    console.log("Files:", req.files);

    const images = await saveProductImages(
      req.params.id,
      req.files
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Images uploaded successfully.",
        images
      )
    );
  }
);

// ==============================================
// DELETE PRODUCT IMAGE
// ==============================================

export const deleteProductImageController = asyncHandler(
  async (req, res) => {
    const result = await deleteProductImage(
      req.params.imageId
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Image deleted successfully.",
        result
      )
    );
  }
);

// import asyncHandler from "../middlewares/asyncHandler.js";
// import {ApiResponse} from "../utils/ApiResponse.js";
// import { saveProductImages,deleteProductImage } from "../services/image/image.service.js";
// import {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
//   getProductBySlug,
//   updateFeaturedStatus,
//   updateProductStatus,
//   updateProductStock,
//   getPublicProductById
  
  
// } from "../services/product.service.js";

// import {
//   createProductSchema,
//   updateProductSchema,
// } from "../validators/product.validator.js";


// // ==============================================
// // CREATE PRODUCT
// // ==============================================

// export const createProductController = asyncHandler(async (req, res) => {

//   const validatedData = createProductSchema.parse(req.body);

//   const product = await createProduct(validatedData);

//   return res.status(201).json(
//     new ApiResponse(
//       201,
//       "Product created successfully.",
//       product
//     )
//   );

// });


// // ==============================================
// // GET ALL PRODUCTS
// // ==============================================

// export const getAllProductsController = asyncHandler(async (req, res) => {
//   const {
//     page,
//     limit,
//     search,
//     category,
//     featured,
//     sort,
//     isAdmin,
//   } = req.query;

//   const result = await getAllProducts({
//     page,
//     limit,
//     search,
//     category,
//     featured,
//     sort,
//     isAdmin,
//   });

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       "Products fetched successfully.",
//       result
//     )
//   );
// });

// // ==============================================
// // GET PRODUCT BY ID
// // ==============================================

// export const getProductByIdController = asyncHandler(async (req, res) => {

//   const product = await getProductById(req.params.id);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       "Product fetched successfully.",
//       product
//     )
//   );

// });



// // GET PRODUCT BY ID CONTROLLER- PUBLIC

// export const getPublicProductByIdController =
// asyncHandler(async (req, res) => {

//     const product =
//         await getPublicProductById(
//             req.params.id
//         );

//     return res.status(200).json(

//         new ApiResponse(
//             200,
//             "Product fetched successfully.",
//             product
//         )

//     );

// });
// // ==============================================
// // UPDATE PRODUCT
// // ==============================================

// export const updateProductController = asyncHandler(async (req, res) => {

//   const validatedData = updateProductSchema.parse(req.body);

//   const updatedProduct = await updateProduct(
//     req.params.id,
//     validatedData
//   );

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       "Product updated successfully.",
//       updatedProduct
//     )
//   );

// });


// // ==============================================
// // DELETE PRODUCT
// // ==============================================

// export const deleteProductController = asyncHandler(async (req, res) => {

//   await deleteProduct(req.params.id);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       "Product deleted successfully."
//     )
//   );

// });

// export const getProductBySlugController = asyncHandler(async (req, res) => {

//     const product = await getProductBySlug(req.params.slug);

//     return res.status(200).json(

//         new ApiResponse(
//             200,
//             "Product fetched successfully.",
//             product
//         )

//     );

// });

// export const updateFeaturedController = asyncHandler(async (req, res) => {

//     const { isFeatured } = req.body;

//     const product = await updateFeaturedStatus(
//         req.params.id,
//         isFeatured
//     );

//     return res.status(200).json(

//         new ApiResponse(
//             200,
//             "Featured status updated successfully.",
//             product
//         )

//     );

// });

// export const updateProductStatusController = asyncHandler(async (req, res) => {

//     const { isActive } = req.body;

//     const product = await updateProductStatus(
//         req.params.id,
//         isActive
//     );

//     return res.status(200).json(

//         new ApiResponse(
//             200,
//             "Product status updated successfully.",
//             product
//         )

//     );

// });

// export const updateStockController = asyncHandler(async (req, res) => {

//     const { stock } = req.body;

//     const product = await updateProductStock(
//         req.params.id,
//         stock
//     );

//     return res.status(200).json(

//         new ApiResponse(
//             200,
//             "Stock updated successfully.",
//             product
//         )

//     );

// });

// export const uploadProductImagesController = asyncHandler(async (req, res) => {

//   console.log("Params:", req.params);
//   console.log("Files:", req.files);

//   const images = await saveProductImages(
//     req.params.id,
//     req.files
//   );

//   return res.status(201).json(
//     new ApiResponse(
//       201,
//       "Images uploaded successfully.",
//       images
//     )
//   );
// });

// export const deleteProductImageController = asyncHandler(async (req, res) => {

//   const result = await deleteProductImage(req.params.imageId);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       "Image deleted successfully.",
//       result
//     )
//   );

// });