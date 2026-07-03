import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export const calculatePricing = async ({

  cartItems,

  couponCode = null,

}) => {

  if (!cartItems || cartItems.length === 0) {

    throw new ApiError(
      400,
      "Cart is empty."
    );

  }

  let subtotal = 0;

  const validatedItems = [];
    for (const item of cartItems) {

    const product =
      await prisma.product.findUnique({

        where: {

          id: item.id,

        },

      });

    if (!product) {

      throw new ApiError(

        404,

        `${item.name} not found.`

      );

    }

    if (product.stock < item.quantity) {

      throw new ApiError(

        400,

        `Only ${product.stock} ${product.name} left in stock.`

      );

    }
        const price = Number(

      product.discountPrice ??

      product.price

    );

    subtotal +=

      price * item.quantity;
    validatedItems.push({

  productId: product.id,

  name: product.name,

  quantity: item.quantity,

  unitPrice: price,

  lineTotal: price * item.quantity,

});

  }
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
const shipping =

subtotal >=
Number(
  shippingRule.freeShippingThreshold
)

? 0

: Number(
    shippingRule.shippingCharge
  );
    



let coupon = null;

let discount = 0;

if (couponCode) {

  coupon =
    await prisma.coupon.findUnique({

      where: {

        code: couponCode,

      },

    });

  if (!coupon) {

    throw new ApiError(

      404,

      "Coupon not found."

    );

  }

  if (!coupon.isActive) {

    throw new ApiError(

      400,

      "Coupon is inactive."

    );

  }

  const now = new Date();

  if (

    coupon.startDate &&

    now < coupon.startDate

  ) {

    throw new ApiError(

      400,

      "Coupon is not active yet."

    );

  }

  if (

    coupon.expiryDate &&

    now > coupon.expiryDate

  ) {

    throw new ApiError(

      400,

      "Coupon has expired."

    );

  }

  if (

    subtotal <

    Number(coupon.minimumOrder)

  ) {

    throw new ApiError(

      400,

      `Minimum order should be ₹${coupon.minimumOrder}.`

    );

  }

  if (

    coupon.usageLimit &&

    coupon.usedCount >= coupon.usageLimit

  ) {

    throw new ApiError(

      400,

      "Coupon usage limit reached."

    );

  }

  if (

    coupon.discountType ===

    "PERCENTAGE"

  ) {

    discount =

      subtotal *

      (Number(coupon.discountValue) / 100);

  }

  else {

    discount =
      Number(coupon.discountValue);

  }

  if (

    coupon.maximumDiscount &&

    discount >

    Number(coupon.maximumDiscount)

  ) {

    discount =
      Number(coupon.maximumDiscount);

  }

}
const total =

Math.max(
  subtotal + shipping - discount,
  0
);


return {

  validatedItems,

  subtotal,

  shipping,

  shippingRule,

  coupon,

  discount,

  total,

    };
}