import { calculatePricing } from "./pricing.service.js";
import crypto from "crypto";
import prisma from "../lib/prisma.js";
import razorpay from "../lib/razorpay.js";
import ApiError from "../utils/ApiError.js";

export const createRazorpayOrder = async (data) => {

  try {
    

    const pricing = await calculatePricing({

  cartItems: data.cartItems,

  couponCode: data.couponCode ?? null,

});

    const options = {

      amount: Math.round(pricing.total * 100),

      currency: data.currency,

      receipt: `PF-${Date.now()}`

    };

    const order =
      await razorpay.orders.create(options);

    return {
  razorpayOrder: order,
  pricing,
};

  } catch (error) {

      console.error("Create Razorpay Order Error:");
  console.error(error);

  throw error;
    // throw new ApiError(
    //   500,
    //   "Unable to create Razorpay Order."
    // );

  }

};

export const verifyPayment = async (payload) => {
const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,

  customer,
  address,

  cartItems,
  couponCode,

} = payload;

  // Verify Razorpay Signature

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    )
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {

    throw new ApiError(
      400,
      "Invalid payment signature."
    );

  }


  

// ============================
// Fetch Razorpay Payment
// ============================

const payment =
  await razorpay.payments.fetch(
    razorpay_payment_id
  );

// ============================
// Recalculate Pricing
// ============================

const pricing =
  await calculatePricing({

    cartItems,

    couponCode,

  });

// ============================
// Verify Amount
// ============================

if (
  payment.amount !==
  Math.round(pricing.total * 100)
) {

  throw new ApiError(
    400,
    "Payment amount mismatch."
  );

}
  // -----------------------------
// Generate Receipt
// -----------------------------

const receipt = `PF-${Date.now()}`;


  


  // -----------------------------
  // Transaction
  // -----------------------------

  const result = await prisma.$transaction(
    async (tx) => {

      // Find customer

      let existingCustomer =
        await tx.customer.findUnique({

          where: {

            phone: customer.phone,

          },

        });

      // Create if doesn't exist

      if (!existingCustomer) {

        existingCustomer =
          await tx.customer.create({

            data: {

              name: customer.name,

              email: customer.email || null,

              phone: customer.phone,

            },

          });

      }

      // Save address

      // ----------------------------------
// Save / Update Customer Address
// ----------------------------------

let savedAddress = await tx.address.findFirst({

  where: {

    customerId: existingCustomer.id,

  },

});

if (savedAddress) {

  savedAddress = await tx.address.update({

    where: {

      id: savedAddress.id,

    },

    data: {

      fullName: address.fullName,

      phone: address.phone,

      addressLine1: address.addressLine1,

      addressLine2: address.addressLine2,

      landmark: address.landmark,

      postOffice: address.postOffice,

      district: address.district,

      city: address.city,

      state: address.state,

      pincode: address.pincode,

    },

  });

} else {

  savedAddress = await tx.address.create({

    data: {

      customerId: existingCustomer.id,

      fullName: address.fullName,

      phone: address.phone,

      addressLine1: address.addressLine1,

      addressLine2: address.addressLine2,

      landmark: address.landmark,

      postOffice: address.postOffice,

      district: address.district,

      city: address.city,

      state: address.state,

      pincode: address.pincode,

    },

  });

}

        // -----------------------------
// Create Order
// -----------------------------

const order = await tx.order.create({

  data: {

    receipt,

    customerId: existingCustomer.id,

    subtotal: pricing.subtotal,

shippingCharge: pricing.shipping,

total: pricing.total,

discount: pricing.discount,

couponCode:
  pricing.coupon?.code ?? null,

    shippingName:
      address.fullName,

    shippingPhone:
      address.phone,

    shippingAddress1:
      address.addressLine1,

    shippingAddress2:
      address.addressLine2,

    shippingCity:
      address.city,

    shippingState:
      address.state,

    shippingPincode:
      address.pincode,

    // processedAt: new Date(),

    status: "PENDING",

  },

});


await tx.orderStatusHistory.create({
  data: {
    orderId: order.id,
    status: "PENDING",
    note: "Order placed successfully.",
  },
});

// -----------------------------
// Create Order Items
// -----------------------------

await Promise.all(

  pricing.validatedItems.map(async (item) => {

    await tx.orderItem.create({

      data: {

        orderId: order.id,

        productId: item.productId,

        quantity: item.quantity,

        price: item.unitPrice,

      },

    });

  })

);

// -----------------------------
// Create Payment
// -----------------------------

await tx.payment.create({

  data: {

    orderId: order.id,

    razorpayOrderId:
      razorpay_order_id,

    razorpayPaymentId:
      razorpay_payment_id,

    razorpaySignature:
      razorpay_signature,

    receipt,

    amount: pricing.total,

    status: "SUCCESS",

    paidAt: new Date(),

  },

});

// -----------------------------
// Reduce Product Stock
// -----------------------------
await Promise.all(

  pricing.validatedItems.map(async (item) => {

    const updated =
      await tx.product.updateMany({

        where: {

          id: item.productId,

          stock: {

            gte: item.quantity,

          },

        },

        data: {

          stock: {

            decrement: item.quantity,

          },

        },

      });

    if (updated.count === 0) {

      throw new ApiError(
        400,
        "Product went out of stock during checkout."
      );

    }

  })

); // <-- You were missing this



if (pricing.coupon) {

  await tx.coupon.update({

    where: {

      id: pricing.coupon.id,

    },

    data: {

      usedCount: {

        increment: 1,

      },

    },

  });

}
      return {

        verified: true,

        receipt: order.receipt,

        orderId: order.id,

        status: order.status,

        // customer: existingCustomer,

        // address: savedAddress,

        // order,

      };

    }

  );

  return result;

};