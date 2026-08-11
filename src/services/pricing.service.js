import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

const VALID_COMBO_SIZES = [2, 3, 4];

export const calculatePricing = async ({
  cartItems,
  couponCode = null,
}) => {
  if (!cartItems || cartItems.length === 0) {
    throw new ApiError(400, "Cart is empty.");
  }

  let subtotal = 0;

  const validatedItems = [];

  // =========================================================
  // PROCESS CART ITEMS
  // =========================================================

  for (const item of cartItems) {
    // =======================================================
    // COMBO PRODUCT
    // =======================================================

    if (item.type === "COMBO") {
      const {
        packSize,
        selections,
      } = item;

      // -----------------------------------------------------
      // VALIDATE PACK SIZE
      // -----------------------------------------------------

      if (!VALID_COMBO_SIZES.includes(Number(packSize))) {
        throw new ApiError(
          400,
          "Invalid combo pack size."
        );
      }

      const normalizedPackSize = Number(packSize);

      // -----------------------------------------------------
      // VALIDATE COMBO QUANTITY
      // -----------------------------------------------------

      const comboQuantity = Number(item.quantity);

      if (
        !Number.isInteger(comboQuantity) ||
        comboQuantity < 1
      ) {
        throw new ApiError(
          400,
          `Invalid quantity for Pack of ${normalizedPackSize}.`
        );
      }

      // -----------------------------------------------------
      // VALIDATE SELECTIONS
      // -----------------------------------------------------

      if (
        !Array.isArray(selections) ||
        selections.length !== normalizedPackSize
      ) {
        throw new ApiError(
          400,
          `Pack of ${normalizedPackSize} requires exactly ${normalizedPackSize} flavor selections.`
        );
      }

      // -----------------------------------------------------
      // GET COMBO CONFIGURATION
      // -----------------------------------------------------

      const comboConfig =
        await prisma.comboConfig.findUnique({
          where: {
            packSize: normalizedPackSize,
          },
        });

      if (!comboConfig) {
        throw new ApiError(
          500,
          `Pricing for Pack of ${normalizedPackSize} is not configured.`
        );
      }

      // -----------------------------------------------------
      // CHECK COMBO ACTIVE STATUS
      // -----------------------------------------------------

      if (!comboConfig.isActive) {
        throw new ApiError(
          400,
          `Pack of ${normalizedPackSize} is currently unavailable.`
        );
      }

      // -----------------------------------------------------
      // DETERMINE ACTUAL COMBO PRICE
      //
      // If discounted price exists:
      //     use discounted price
      //
      // Otherwise:
      //     use normal price
      //
      // IMPORTANT:
      // We calculate this from the database.
      // We do NOT trust the frontend price.
      // -----------------------------------------------------

      const comboPrice = Number(
        comboConfig.discountPrice ??
          comboConfig.price
      );

      if (
        !Number.isFinite(comboPrice) ||
        comboPrice <= 0
      ) {
        throw new ApiError(
          500,
          `Invalid pricing configuration for Pack of ${normalizedPackSize}.`
        );
      }

      // -----------------------------------------------------
      // VALIDATE EACH SELECTED PRODUCT
      // -----------------------------------------------------

      for (const selection of selections) {
        if (!selection.productId) {
          throw new ApiError(
            400,
            "Invalid product selection in combo."
          );
        }

        // ---------------------------------------------------
        // SELECTION QUANTITY
        //
        // Usually each selection is 1.
        //
        // Example:
        //
        // Pack of 2
        //   Makhana A x 1
        //   Makhana B x 1
        //
        // Pack of 3
        //   Makhana A x 1
        //   Makhana B x 1
        //   Makhana C x 1
        // ---------------------------------------------------

        const selectionQuantity = Number(
          selection.quantity ?? 1
        );

        if (
          !Number.isInteger(selectionQuantity) ||
          selectionQuantity < 1
        ) {
          throw new ApiError(
            400,
            "Invalid combo product quantity."
          );
        }

        // ---------------------------------------------------
        // FETCH PRODUCT FROM DATABASE
        // ---------------------------------------------------

        const product =
          await prisma.product.findUnique({
            where: {
              id: selection.productId,
            },
          });

        if (!product) {
          throw new ApiError(
            404,
            "One of the selected products was not found."
          );
        }

        // ---------------------------------------------------
        // PRODUCT ACTIVE?
        // ---------------------------------------------------

        if (!product.isActive) {
          throw new ApiError(
            400,
            `${product.name} is currently unavailable.`
          );
        }

        // ---------------------------------------------------
        // CALCULATE REQUIRED STOCK
        //
        // Example:
        //
        // Pack of 2
        // Customer buys quantity = 3
        //
        // A x 1
        // B x 1
        //
        // Required:
        //
        // A -> 3
        // B -> 3
        // ---------------------------------------------------

        const requiredStock =
          selectionQuantity * comboQuantity;

        if (product.stock < requiredStock) {
          throw new ApiError(
            400,
            `Only ${product.stock} ${product.name} left in stock.`
          );
        }

        // ---------------------------------------------------
        // ADD PRODUCT TO VALIDATED ITEMS
        //
        // IMPORTANT:
        //
        // These are the actual inventory items that will
        // eventually be deducted from stock.
        //
        // The combo itself has its own selling price.
        // Individual products therefore have unitPrice = 0.
        // ---------------------------------------------------

        validatedItems.push({
          productId: product.id,

          name: product.name,

          quantity: requiredStock,

          unitPrice: 0,

          lineTotal: 0,

          // -------------------------------------------------
          // COMBO INFORMATION
          // -------------------------------------------------

          isCombo: true,

          comboPackSize: normalizedPackSize,

          comboQuantity,

          comboPrice,
        });
      }

      // -----------------------------------------------------
      // ADD COMBO PRICE TO SUBTOTAL
      // -----------------------------------------------------

      subtotal +=
        comboPrice * comboQuantity;

      continue;
    }

    // =======================================================
    // NORMAL PRODUCT
    // =======================================================

    const product =
      await prisma.product.findUnique({
        where: {
          id: item.id,
        },
      });

    // -------------------------------------------------------
    // PRODUCT EXISTS?
    // -------------------------------------------------------

    if (!product) {
      throw new ApiError(
        404,
        `${item.name ?? "Product"} not found.`
      );
    }

    // -------------------------------------------------------
    // PRODUCT ACTIVE?
    // -------------------------------------------------------

    if (!product.isActive) {
      throw new ApiError(
        400,
        `${product.name} is currently unavailable.`
      );
    }

    // -------------------------------------------------------
    // VALIDATE QUANTITY
    // -------------------------------------------------------

    const quantity = Number(item.quantity);

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new ApiError(
        400,
        `Invalid quantity for ${product.name}.`
      );
    }

    // -------------------------------------------------------
    // STOCK CHECK
    // -------------------------------------------------------

    if (product.stock < quantity) {
      throw new ApiError(
        400,
        `Only ${product.stock} ${product.name} left in stock.`
      );
    }

    // -------------------------------------------------------
    // PRODUCT PRICE
    // -------------------------------------------------------

    const price = Number(
      product.discountPrice ??
        product.price
    );

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw new ApiError(
        500,
        `Invalid pricing configuration for ${product.name}.`
      );
    }

    // -------------------------------------------------------
    // LINE TOTAL
    // -------------------------------------------------------

    const lineTotal =
      price * quantity;

    subtotal += lineTotal;

    // -------------------------------------------------------
    // ADD NORMAL PRODUCT
    // -------------------------------------------------------

    validatedItems.push({
      productId: product.id,

      name: product.name,

      quantity,

      unitPrice: price,

      lineTotal,

      // Explicitly mark normal product
      // as NOT a combo.
      isCombo: false,

      comboPackSize: null,
    });
  }

  // =========================================================
  // SHIPPING
  // =========================================================

  const shippingRule =
    await prisma.shippingRule.findFirst({
      where: {
        isActive: true,
      },
    });

  if (!shippingRule) {
    throw new ApiError(
      500,
      "Shipping rule not configured."
    );
  }

  const freeShippingThreshold =
    Number(
      shippingRule.freeShippingThreshold
    );

  const shippingCharge =
    Number(
      shippingRule.shippingCharge
    );

  const shipping =
    subtotal >= freeShippingThreshold
      ? 0
      : shippingCharge;

  // =========================================================
  // COUPON
  // =========================================================

  let coupon = null;
  let discount = 0;

  if (couponCode) {
    // -------------------------------------------------------
    // FIND COUPON
    // -------------------------------------------------------

    coupon =
      await prisma.coupon.findUnique({
        where: {
          code: couponCode,
        },
      });

    // -------------------------------------------------------
    // COUPON EXISTS?
    // -------------------------------------------------------

    if (!coupon) {
      throw new ApiError(
        404,
        "Coupon not found."
      );
    }

    // -------------------------------------------------------
    // ACTIVE?
    // -------------------------------------------------------

    if (!coupon.isActive) {
      throw new ApiError(
        400,
        "Coupon is inactive."
      );
    }

    const now = new Date();

    // -------------------------------------------------------
    // START DATE
    // -------------------------------------------------------

    if (
      coupon.startDate &&
      now < coupon.startDate
    ) {
      throw new ApiError(
        400,
        "Coupon is not active yet."
      );
    }

    // -------------------------------------------------------
    // EXPIRY DATE
    // -------------------------------------------------------

    if (
      coupon.expiryDate &&
      now > coupon.expiryDate
    ) {
      throw new ApiError(
        400,
        "Coupon has expired."
      );
    }

    // -------------------------------------------------------
    // MINIMUM ORDER
    // -------------------------------------------------------

    if (
      subtotal <
      Number(coupon.minimumOrder)
    ) {
      throw new ApiError(
        400,
        `Minimum order should be ₹${coupon.minimumOrder}.`
      );
    }

    // -------------------------------------------------------
    // USAGE LIMIT
    // -------------------------------------------------------

    if (
      coupon.usageLimit &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      throw new ApiError(
        400,
        "Coupon usage limit reached."
      );
    }

    // -------------------------------------------------------
    // PERCENTAGE DISCOUNT
    // -------------------------------------------------------

    if (
      coupon.discountType === "PERCENTAGE"
    ) {
      discount =
        subtotal *
        (
          Number(coupon.discountValue) /
          100
        );
    }

    // -------------------------------------------------------
    // FLAT DISCOUNT
    // -------------------------------------------------------

    else {
      discount =
        Number(coupon.discountValue);
    }

    // -------------------------------------------------------
    // MAXIMUM DISCOUNT
    // -------------------------------------------------------

    if (
      coupon.maximumDiscount &&
      discount >
        Number(coupon.maximumDiscount)
    ) {
      discount =
        Number(coupon.maximumDiscount);
    }
  }

  // =========================================================
  // TOTAL
  // =========================================================

  const total =
    Math.max(
      subtotal +
        shipping -
        discount,
      0
    );

  // =========================================================
  // RESPONSE
  // =========================================================

  return {
    validatedItems,

    subtotal,

    shipping,

    shippingRule,

    coupon,

    discount,

    total,
  };
};



// import prisma from "../lib/prisma.js";
// import ApiError from "../utils/ApiError.js";

// const VALID_COMBO_SIZES = [2, 3, 4];

// export const calculatePricing = async ({
//   cartItems,
//   couponCode = null,
// }) => {
//   if (!cartItems || cartItems.length === 0) {
//     throw new ApiError(400, "Cart is empty.");
//   }

//   let subtotal = 0;

//   const validatedItems = [];

//   // =========================================================
//   // PROCESS CART ITEMS
//   // =========================================================

//   for (const item of cartItems) {
//     // =======================================================
//     // COMBO
//     // =======================================================

//     if (item.type === "COMBO") {
//       const { packSize, selections } = item;

//       // -----------------------------
//       // Validate pack size
//       // -----------------------------

//       if (!VALID_COMBO_SIZES.includes(packSize)) {
//         throw new ApiError(
//           400,
//           "Invalid combo pack size."
//         );
//       }

//       // -----------------------------
//       // Validate selections
//       // -----------------------------

//       if (
//         !Array.isArray(selections) ||
//         selections.length !== packSize
//       ) {
//         throw new ApiError(
//           400,
//           `Pack of ${packSize} requires exactly ${packSize} flavor selections.`
//         );
//       }

//       // -----------------------------
//       // Get combo pricing
//       // -----------------------------

//       const comboConfig =
//         await prisma.comboConfig.findUnique({
//           where: {
//             packSize,
//           },
//         });

//       if (!comboConfig) {
//         throw new ApiError(
//           500,
//           `Pricing for Pack of ${packSize} is not configured.`
//         );
//       }

//       if (!comboConfig.isActive) {
//         throw new ApiError(
//           400,
//           `Pack of ${packSize} is currently unavailable.`
//         );
//       }

//       const comboPrice = Number(comboConfig.price);

//       // -----------------------------
//       // Track total quantity
//       // -----------------------------

//       let totalComboQuantity = 0;

//       // -----------------------------
//       // Validate each selection
//       // -----------------------------

//       for (const selection of selections) {
//         if (!selection.productId) {
//           throw new ApiError(
//             400,
//             "Invalid product selection in combo."
//           );
//         }

//         const quantity = Number(
//           selection.quantity ?? 1
//         );

//         if (
//           !Number.isInteger(quantity) ||
//           quantity < 1
//         ) {
//           throw new ApiError(
//             400,
//             "Invalid combo product quantity."
//           );
//         }

//         totalComboQuantity += quantity;

//         // -----------------------------
//         // Fetch product
//         // -----------------------------

//         const product =
//           await prisma.product.findUnique({
//             where: {
//               id: selection.productId,
//             },
//           });

//         // -----------------------------
//         // Product exists?
//         // -----------------------------

//         if (!product) {
//           throw new ApiError(
//             404,
//             "One of the selected products was not found."
//           );
//         }

//         // -----------------------------
//         // Product active?
//         // -----------------------------

//         if (!product.isActive) {
//           throw new ApiError(
//             400,
//             `${product.name} is currently unavailable.`
//           );
//         }

//         // -----------------------------
//         // Stock check
//         // -----------------------------

//         if (product.stock < quantity) {
//           throw new ApiError(
//             400,
//             `Only ${product.stock} ${product.name} left in stock.`
//           );
//         }

//         // -----------------------------
//         // Add selected product
//         // to validated items
//         // -----------------------------

//         validatedItems.push({
//           productId: product.id,
//           name: product.name,
//           quantity,
//           unitPrice: 0,
//           lineTotal: 0,
//           comboPackSize: packSize,
//         });
//       }

//       // -----------------------------
//       // Validate total quantity
//       // -----------------------------

//       if (totalComboQuantity !== packSize) {
//         throw new ApiError(
//           400,
//           `Pack of ${packSize} must contain exactly ${packSize} products.`
//         );
//       }

//       // -----------------------------
//       // Apply combo price
//       // -----------------------------

//       subtotal += comboPrice;

//       // -----------------------------
//       // Attach combo pricing
//       // -----------------------------

//       const comboItemsStartIndex =
//         validatedItems.length - selections.length;

//       validatedItems[comboItemsStartIndex].comboPrice =
//         comboPrice;

//       continue;
//     }

//     // =======================================================
//     // NORMAL PRODUCT
//     // =======================================================

//     const product =
//       await prisma.product.findUnique({
//         where: {
//           id: item.id,
//         },
//       });

//     // -----------------------------
//     // Product exists?
//     // -----------------------------

//     if (!product) {
//       throw new ApiError(
//         404,
//         `${item.name} not found.`
//       );
//     }

//     // -----------------------------
//     // Product active?
//     // -----------------------------

//     if (!product.isActive) {
//       throw new ApiError(
//         400,
//         `${product.name} is currently unavailable.`
//       );
//     }

//     // -----------------------------
//     // Validate quantity
//     // -----------------------------

//     const quantity = Number(item.quantity);

//     if (
//       !Number.isInteger(quantity) ||
//       quantity < 1
//     ) {
//       throw new ApiError(
//         400,
//         `Invalid quantity for ${product.name}.`
//       );
//     }

//     // -----------------------------
//     // Stock check
//     // -----------------------------

//     if (product.stock < quantity) {
//       throw new ApiError(
//         400,
//         `Only ${product.stock} ${product.name} left in stock.`
//       );
//     }

//     // -----------------------------
//     // Product price
//     // -----------------------------

//     const price = Number(
//       product.discountPrice ??
//       product.price
//     );

//     const lineTotal =
//       price * quantity;

//     subtotal += lineTotal;

//     validatedItems.push({
//       productId: product.id,
//       name: product.name,
//       quantity,
//       unitPrice: price,
//       lineTotal,
//     });
//   }

//   // =========================================================
//   // SHIPPING
//   // =========================================================

//   const shippingRule =
//     await prisma.shippingRule.findFirst({
//       where: {
//         isActive: true,
//       },
//     });

//   if (!shippingRule) {
//     throw new ApiError(
//       500,
//       "Shipping rule not configured."
//     );
//   }

//   const shipping =
//     subtotal >=
//     Number(
//       shippingRule.freeShippingThreshold
//     )
//       ? 0
//       : Number(
//           shippingRule.shippingCharge
//         );

//   // =========================================================
//   // COUPON
//   // =========================================================

//   let coupon = null;
//   let discount = 0;

//   if (couponCode) {
//     coupon =
//       await prisma.coupon.findUnique({
//         where: {
//           code: couponCode,
//         },
//       });

//     // -----------------------------
//     // Coupon exists?
//     // -----------------------------

//     if (!coupon) {
//       throw new ApiError(
//         404,
//         "Coupon not found."
//       );
//     }

//     // -----------------------------
//     // Active?
//     // -----------------------------

//     if (!coupon.isActive) {
//       throw new ApiError(
//         400,
//         "Coupon is inactive."
//       );
//     }

//     // -----------------------------
//     // Start date
//     // -----------------------------

//     const now = new Date();

//     if (
//       coupon.startDate &&
//       now < coupon.startDate
//     ) {
//       throw new ApiError(
//         400,
//         "Coupon is not active yet."
//       );
//     }

//     // -----------------------------
//     // Expiry
//     // -----------------------------

//     if (
//       coupon.expiryDate &&
//       now > coupon.expiryDate
//     ) {
//       throw new ApiError(
//         400,
//         "Coupon has expired."
//       );
//     }

//     // -----------------------------
//     // Minimum order
//     // -----------------------------

//     if (
//       subtotal <
//       Number(coupon.minimumOrder)
//     ) {
//       throw new ApiError(
//         400,
//         `Minimum order should be ₹${coupon.minimumOrder}.`
//       );
//     }

//     // -----------------------------
//     // Usage limit
//     // -----------------------------

//     if (
//       coupon.usageLimit &&
//       coupon.usedCount >= coupon.usageLimit
//     ) {
//       throw new ApiError(
//         400,
//         "Coupon usage limit reached."
//       );
//     }

//     // -----------------------------
//     // Percentage discount
//     // -----------------------------

//     if (
//       coupon.discountType ===
//       "PERCENTAGE"
//     ) {
//       discount =
//         subtotal *
//         (
//           Number(coupon.discountValue) /
//           100
//         );
//     }

//     // -----------------------------
//     // Flat discount
//     // -----------------------------

//     else {
//       discount =
//         Number(coupon.discountValue);
//     }

//     // -----------------------------
//     // Maximum discount
//     // -----------------------------

//     if (
//       coupon.maximumDiscount &&
//       discount >
//         Number(coupon.maximumDiscount)
//     ) {
//       discount =
//         Number(coupon.maximumDiscount);
//     }
//   }

//   // =========================================================
//   // TOTAL
//   // =========================================================

//   const total =
//     Math.max(
//       subtotal +
//         shipping -
//         discount,
//       0
//     );

//   // =========================================================
//   // RESPONSE
//   // =========================================================

//   return {
//     validatedItems,
//     subtotal,
//     shipping,
//     shippingRule,
//     coupon,
//     discount,
//     total,
//   };
// };


// import prisma from "../lib/prisma.js";
// import ApiError from "../utils/ApiError.js";

// export const calculatePricing = async ({

//   cartItems,

//   couponCode = null,

// }) => {

//   if (!cartItems || cartItems.length === 0) {

//     throw new ApiError(
//       400,
//       "Cart is empty."
//     );

//   }

//   let subtotal = 0;

//   const validatedItems = [];
//     for (const item of cartItems) {

//     const product =
//       await prisma.product.findUnique({

//         where: {

//           id: item.id,

//         },

//       });

//     if (!product) {

//       throw new ApiError(

//         404,

//         `${item.name} not found.`

//       );

//     }

//     if (product.stock < item.quantity) {

//       throw new ApiError(

//         400,

//         `Only ${product.stock} ${product.name} left in stock.`

//       );

//     }
//         const price = Number(

//       product.discountPrice ??

//       product.price

//     );

//     subtotal +=

//       price * item.quantity;
//     validatedItems.push({

//   productId: product.id,

//   name: product.name,

//   quantity: item.quantity,

//   unitPrice: price,

//   lineTotal: price * item.quantity,

// });

//   }
//   const shippingRule =
//   await prisma.shippingRule.findFirst({

//     where: {

//       isActive: true,

//     },

//   });

// if (!shippingRule) {

//   throw new ApiError(

//     500,

//     "Shipping rule not configured."

//   );

// }
// const shipping =

// subtotal >=
// Number(
//   shippingRule.freeShippingThreshold
// )

// ? 0

// : Number(
//     shippingRule.shippingCharge
//   );
    



// let coupon = null;

// let discount = 0;

// if (couponCode) {

//   coupon =
//     await prisma.coupon.findUnique({

//       where: {

//         code: couponCode,

//       },

//     });

//   if (!coupon) {

//     throw new ApiError(

//       404,

//       "Coupon not found."

//     );

//   }

//   if (!coupon.isActive) {

//     throw new ApiError(

//       400,

//       "Coupon is inactive."

//     );

//   }

//   const now = new Date();

//   if (

//     coupon.startDate &&

//     now < coupon.startDate

//   ) {

//     throw new ApiError(

//       400,

//       "Coupon is not active yet."

//     );

//   }

//   if (

//     coupon.expiryDate &&

//     now > coupon.expiryDate

//   ) {

//     throw new ApiError(

//       400,

//       "Coupon has expired."

//     );

//   }

//   if (

//     subtotal <

//     Number(coupon.minimumOrder)

//   ) {

//     throw new ApiError(

//       400,

//       `Minimum order should be ₹${coupon.minimumOrder}.`

//     );

//   }

//   if (

//     coupon.usageLimit &&

//     coupon.usedCount >= coupon.usageLimit

//   ) {

//     throw new ApiError(

//       400,

//       "Coupon usage limit reached."

//     );

//   }

//   if (

//     coupon.discountType ===

//     "PERCENTAGE"

//   ) {

//     discount =

//       subtotal *

//       (Number(coupon.discountValue) / 100);

//   }

//   else {

//     discount =
//       Number(coupon.discountValue);

//   }

//   if (

//     coupon.maximumDiscount &&

//     discount >

//     Number(coupon.maximumDiscount)

//   ) {

//     discount =
//       Number(coupon.maximumDiscount);

//   }

// }
// const total =

// Math.max(
//   subtotal + shipping - discount,
//   0
// );


// return {

//   validatedItems,

//   subtotal,

//   shipping,

//   shippingRule,

//   coupon,

//   discount,

//   total,

//     };
// }