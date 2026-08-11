import { calculatePricing } from "./pricing.service.js";

import {
  emitCustomerCreated,
  emitPaymentUpdated,
  emitOrderUpdated,
  emitDashboardUpdate,
  emitProductUpdated,
} from "../socket/events.js";

import crypto from "crypto";

import prisma from "../lib/prisma.js";
import razorpay from "../lib/razorpay.js";
import ApiError from "../utils/ApiError.js";

import notificationService from "./notification/orderNotification.service.js";
import { createNotification } from "./notification.service.js";
import techService from "./tech.service.js";


// =========================================================
// CREATE RAZORPAY ORDER
// =========================================================

export const createRazorpayOrder = async (data) => {
  try {
    // -------------------------------------------------------
    // Calculate pricing from database
    // -------------------------------------------------------

    const pricing = await calculatePricing({
      cartItems: data.cartItems,
      couponCode: data.couponCode ?? null,
    });

    // -------------------------------------------------------
    // Create Razorpay order
    // -------------------------------------------------------

    const options = {
      amount: Math.round(pricing.total * 100),
      currency: data.currency,
      receipt: `PF-${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return {
      razorpayOrder: order,
      pricing,
    };

  } catch (error) {

    await techService.error({
      category: "PAYMENT",
      title: "Razorpay Order Creation Failed",
      message: error.message,

      metadata: {
        provider: "Razorpay",
        currency: data.currency,
        couponCode: data.couponCode ?? null,
        cartItems: data.cartItems,
        response: error.response?.data || null,
        stack: error.stack,
      },
    });

    throw error;
  }
};


// =========================================================
// VERIFY PAYMENT
// =========================================================

export const verifyPayment = async (payload) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      address,
      cartItems,
      couponCode,
    } = payload;


    // =======================================================
    // VERIFY RAZORPAY SIGNATURE
    // =======================================================

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

      await techService.error({
        category: "PAYMENT",
        title: "Invalid Razorpay Signature",
        message:
          "Payment signature verification failed.",

        metadata: {
          provider: "Razorpay",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          customerEmail: customer?.email,
          customerPhone: customer?.phone,
        },
      });

      throw new ApiError(
        400,
        "Invalid payment signature."
      );
    }


    // =======================================================
    // FETCH RAZORPAY PAYMENT
    // =======================================================

    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );


    // =======================================================
    // RECALCULATE PRICING
    // =======================================================

    // IMPORTANT:
    //
    // Never trust the price sent from frontend.
    //
    // We calculate everything again from database:
    //
    // Product price
    // Combo price
    // Combo discountPrice
    // Combo active/inactive
    // Product stock
    // Shipping
    // Coupon
    //
    const pricing = await calculatePricing({
      cartItems,
      couponCode: couponCode ?? null,
    });


    // =======================================================
    // VERIFY PAYMENT AMOUNT
    // =======================================================

    const expectedAmount =
      Math.round(pricing.total * 100);


    if (payment.amount !== expectedAmount) {

      await techService.error({
        category: "PAYMENT",

        title: "Payment Amount Mismatch",

        message:
          "Paid amount does not match calculated order amount.",

        metadata: {
          provider: "Razorpay",

          razorpayOrderId:
            razorpay_order_id,

          razorpayPaymentId:
            razorpay_payment_id,

          paidAmount:
            payment.amount,

          expectedAmount,

          customerEmail:
            customer?.email,

          customerPhone:
            customer?.phone,
        },
      });

      throw new ApiError(
        400,
        "Payment amount mismatch."
      );
    }


    // =======================================================
    // GENERATE RECEIPT
    // =======================================================

    const receipt = `PF-${Date.now()}`;


    // =======================================================
    // DATABASE TRANSACTION
    // =======================================================

    let result;


    try {

      result = await prisma.$transaction(
        async (tx) => {


          // =================================================
          // FIND CUSTOMER
          // =================================================

          let existingCustomer = null;

          let isNewCustomer = false;


          // Search by email first

          if (customer.email) {

            existingCustomer =
              await tx.customer.findUnique({
                where: {
                  email: customer.email,
                },
              });

          }


          // If not found, search by phone

          if (!existingCustomer) {

            existingCustomer =
              await tx.customer.findUnique({
                where: {
                  phone: customer.phone,
                },
              });

          }


          // =================================================
          // CREATE CUSTOMER
          // =================================================

          if (!existingCustomer) {

            existingCustomer =
              await tx.customer.create({
                data: {
                  name: customer.name,
                  email:
                    customer.email || null,
                  phone: customer.phone,
                },
              });

            isNewCustomer = true;

          }


          // =================================================
          // UPDATE EXISTING CUSTOMER
          // =================================================

          if (!isNewCustomer) {

            existingCustomer =
              await tx.customer.update({
                where: {
                  id: existingCustomer.id,
                },

                data: {
                  name: customer.name,

                  email:
                    customer.email || null,

                  phone: customer.phone,
                },
              });

          }


          // =================================================
          // SAVE / UPDATE ADDRESS
          // =================================================

          let savedAddress =
            await tx.address.findFirst({
              where: {
                customerId:
                  existingCustomer.id,
              },
            });


          if (savedAddress) {

            savedAddress =
              await tx.address.update({
                where: {
                  id: savedAddress.id,
                },

                data: {
                  fullName:
                    address.fullName,

                  phone:
                    address.phone,

                  addressLine1:
                    address.addressLine1,

                  addressLine2:
                    address.addressLine2,

                  landmark:
                    address.landmark,

                  postOffice:
                    address.postOffice,

                  district:
                    address.district,

                  city:
                    address.city,

                  state:
                    address.state,

                  pincode:
                    address.pincode,
                },
              });

          } else {

            savedAddress =
              await tx.address.create({
                data: {
                  customerId:
                    existingCustomer.id,

                  fullName:
                    address.fullName,

                  phone:
                    address.phone,

                  addressLine1:
                    address.addressLine1,

                  addressLine2:
                    address.addressLine2,

                  landmark:
                    address.landmark,

                  postOffice:
                    address.postOffice,

                  district:
                    address.district,

                  city:
                    address.city,

                  state:
                    address.state,

                  pincode:
                    address.pincode,
                },
              });

          }


          // =================================================
          // CREATE ORDER
          // =================================================

          const order =
            await tx.order.create({

              data: {

                receipt,

                customerId:
                  existingCustomer.id,

                subtotal:
                  pricing.subtotal,

                shippingCharge:
                  pricing.shipping,

                total:
                  pricing.total,

                discount:
                  pricing.discount,

                couponCode:
                  pricing.coupon?.code ??
                  null,

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

                status: "PENDING",
              },

            });


          // =================================================
          // INITIAL ORDER STATUS
          // =================================================

          await tx.orderStatusHistory.create({

            data: {

              orderId:
                order.id,

              status:
                "PENDING",

              note:
                "Order placed successfully.",
            },

          });


          // =================================================
          // CREATE ORDER ITEMS
          // =================================================
          //
          // For a normal product:
          //
          // Product A x 2
          //
          // quantity = 2
          //
          //
          // For Pack of 2 x 3:
          //
          // A x 1
          // B x 1
          //
          // becomes:
          //
          // A quantity = 3
          // B quantity = 3
          //
          // because pricing.service already calculated
          // the actual individual product quantities.
          //
          // Combo itself does NOT create a separate product.
          //

          await Promise.all(

            pricing.validatedItems.map(
              async (item) => {

                await tx.orderItem.create({

                  data: {

                    orderId:
                      order.id,

                    productId:
                      item.productId,

                    quantity:
                      item.quantity,

                    // Combo products don't have
                    // their individual product price.
                    //
                    // The combo price is stored at
                    // Order level through subtotal/total.
                    //
                    // Normal products use their actual
                    // selling price.

                    price:
                      item.unitPrice,

                      isCombo: item.isCombo ?? false,

                      comboPackSize: item.comboPackSize ?? null,
                  },

                  

                });

              }
            )

          );


          // =================================================
          // CREATE PAYMENT
          // =================================================

          const createdPayment =
            await tx.payment.create({

              data: {

                orderId:
                  order.id,

                razorpayOrderId:
                  razorpay_order_id,

                razorpayPaymentId:
                  razorpay_payment_id,

                razorpaySignature:
                  razorpay_signature,

                receipt,

                amount:
                  pricing.total,

                status:
                  "SUCCESS",

                paidAt:
                  new Date(),
              },

            });


          // =================================================
          // AGGREGATE STOCK REQUIREMENTS
          // =================================================
          //
          // This is important for combos.
          //
          // Example:
          //
          // Cart:
          //
          // Pack 2 x 2
          // A x 1
          // B x 1
          //
          // Pack 2 x 1
          // A x 1
          // C x 1
          //
          // Required stock:
          //
          // A = 3
          // B = 2
          // C = 1
          //
          // We aggregate first so the same product
          // isn't updated multiple times.
          //

          const stockRequirements = new Map();


          for (
            const item
            of pricing.validatedItems
          ) {

            const currentQuantity =
              stockRequirements.get(
                item.productId
              ) || 0;


            stockRequirements.set(

              item.productId,

              currentQuantity +
                item.quantity

            );

          }


          // =================================================
          // REDUCE INDIVIDUAL PRODUCT STOCK
          // =================================================

          for (
            const [
              productId,
              quantity,
            ]
            of stockRequirements
          ) {

            const updated =
              await tx.product.updateMany({

                where: {

                  id: productId,

                  stock: {
                    gte: quantity,
                  },

                },

                data: {

                  stock: {
                    decrement: quantity,
                  },

                },

              });


            // =================================================
            // STOCK RACE CONDITION
            // =================================================
            //
            // Pricing may have said there was enough stock,
            // but another customer may have purchased it
            // between pricing and this transaction.
            //
            // updateMany with stock >= quantity protects us.
            //

            if (updated.count === 0) {

              throw new ApiError(

                400,

                "Product went out of stock during checkout."

              );

            }

          }


          // =================================================
          // COUPON USAGE
          // =================================================

          if (pricing.coupon) {

            await tx.coupon.update({

              where: {

                id:
                  pricing.coupon.id,

              },

              data: {

                usedCount: {

                  increment: 1,

                },

              },

            });

          }


          // =================================================
          // RETURN TRANSACTION RESULT
          // =================================================

          return {

            verified: true,

            receipt:
              order.receipt,

            orderId:
              order.id,

            status:
              order.status,

            order,

            payment:
              createdPayment,

            customer:
              existingCustomer,

            address:
              savedAddress,

            isNewCustomer,

          };

        }

      );


    } catch (error) {

      await techService.error({

        category: "PAYMENT",

        level: "CRITICAL",

        title:
          "Order Transaction Failed",

        message:
          error.message,

        metadata: {

          provider:
            "Prisma",

          razorpayOrderId:
            razorpay_order_id,

          razorpayPaymentId:
            razorpay_payment_id,

          receipt,

          customerEmail:
            customer?.email,

          customerPhone:
            customer?.phone,

          stack:
            error.stack,

        },

      });

      throw error;

    }


    // =======================================================
    // REALTIME SOCKET EVENTS
    // =======================================================

    try {

      emitOrderUpdated(
        result.order
      );

      emitPaymentUpdated(
        result.payment
      );

      emitDashboardUpdate();


      // Update every product whose stock changed

      const productIds =
        new Set();


      for (
        const item
        of pricing.validatedItems
      ) {

        productIds.add(
          item.productId
        );

      }


      for (
        const productId
        of productIds
      ) {

        emitProductUpdated({

          id: productId,

        });

      }


      // New customer event

      if (result.isNewCustomer) {

        emitCustomerCreated(
          result.customer
        );

      }

    } catch (error) {

      await techService.error({

        category: "SYSTEM",

        title:
          "Socket Event Failed",

        message:
          error.message,

        metadata: {

          receipt:
            result.order.receipt,

          orderId:
            result.order.id,

          stack:
            error.stack,

        },

      });

    }


    // =======================================================
    // ADMIN DASHBOARD NOTIFICATION
    // =======================================================

    try {

      await createNotification({

        type: "ORDER",

        title:
          "New Order Received",

        message:
          `${result.order.receipt} • ₹${Number(
            result.order.total
          ).toLocaleString("en-IN")}`,

        route:
          "/orders",

        entityId:
          result.order.id,

        priority:
          "NORMAL",

      });

    } catch (error) {

      await techService.error({

        category: "SYSTEM",

        title:
          "Admin Notification Failed",

        message:
          error.message,

        metadata: {

          receipt:
            result.order.receipt,

          orderId:
            result.order.id,

          stack:
            error.stack,

        },

      });

    }


    // =======================================================
    // CUSTOMER EMAIL / WHATSAPP
    // =======================================================

    try {

      await notificationService
        .sendOrderConfirmation(
          result
        );

    } catch (error) {

      await techService.error({

        category: "EMAIL",

        title:
          "Order Confirmation Failed",

        message:
          error.message,

        metadata: {

          receipt:
            result.order.receipt,

          orderId:
            result.order.id,

          customerId:
            result.customer.id,

          customerEmail:
            result.customer.email,

          customerPhone:
            result.customer.phone,

          response:
            error.response?.data ||
            null,

          stack:
            error.stack,

        },

      });

    }


    // =======================================================
    // RETURN
    // =======================================================

    return result;


  } catch (error) {

    await techService.error({

      category: "PAYMENT",

      level: "CRITICAL",

      title:
        "Checkout Verification Failed",

      message:
        error.message,

      metadata: {

        provider:
          "Razorpay",

        razorpayOrderId:
          payload?.razorpay_order_id,

        razorpayPaymentId:
          payload?.razorpay_payment_id,

        customerEmail:
          payload?.customer?.email,

        customerPhone:
          payload?.customer?.phone,

        response:
          error.response?.data ||
          null,

        stack:
          error.stack,

      },

    });

    throw error;

  }

};


// import { calculatePricing } from "./pricing.service.js";
// import { 
//   emitCustomerCreated,
//   emitPaymentUpdated,
//   emitOrderUpdated,
//   emitDashboardUpdate,
//   emitProductUpdated 
// } from "../socket/events.js";

// import crypto from "crypto";
// import prisma from "../lib/prisma.js";
// import razorpay from "../lib/razorpay.js";
// import ApiError from "../utils/ApiError.js";
// import notificationService from "./notification/orderNotification.service.js";
// import { createNotification } from "./notification.service.js";
// export const createRazorpayOrder = async (data) => {

//   try {
    

//     const pricing = await calculatePricing({

//   cartItems: data.cartItems,

//   couponCode: data.couponCode ?? null,

// });

//     const options = {

//       amount: Math.round(pricing.total * 100),

//       currency: data.currency,

//       receipt: `PF-${Date.now()}`

//     };

//     const order =
//       await razorpay.orders.create(options);

//     return {
//   razorpayOrder: order,
//   pricing,
// };

//   } catch (error) {

//       console.error("Create Razorpay Order Error:");
//   console.error(error);

//   throw error;
//     // throw new ApiError(
//     //   500,
//     //   "Unable to create Razorpay Order."
//     // );

//   }

// };

// export const verifyPayment = async (payload) => {
// const {
//   razorpay_order_id,
//   razorpay_payment_id,
//   razorpay_signature,

//   customer,
//   address,

//   cartItems,
//   couponCode,

// } = payload;

//   // Verify Razorpay Signature

//   const generatedSignature = crypto
//     .createHmac(
//       "sha256",
//       process.env.RAZORPAY_KEY_SECRET
//     )
//     .update(
//       `${razorpay_order_id}|${razorpay_payment_id}`
//     )
//     .digest("hex");

//   if (generatedSignature !== razorpay_signature) {

//     throw new ApiError(
//       400,
//       "Invalid payment signature."
//     );

//   }


  

// // ============================
// // Fetch Razorpay Payment
// // ============================

// const payment =
//   await razorpay.payments.fetch(
//     razorpay_payment_id
//   );

// // ============================
// // Recalculate Pricing
// // ============================

// const pricing =
//   await calculatePricing({

//     cartItems,

//     couponCode,

//   });

// // ============================
// // Verify Amount
// // ============================

// if (
//   payment.amount !==
//   Math.round(pricing.total * 100)
// ) {

//   throw new ApiError(
//     400,
//     "Payment amount mismatch."
//   );

// }
//   // -----------------------------
// // Generate Receipt
// // -----------------------------

// const receipt = `PF-${Date.now()}`;


  


//   // -----------------------------
//   // Transaction
//   // -----------------------------

//   const result = await prisma.$transaction(
//     async (tx) => {

//       // Find customer

// let existingCustomer = null;
// let isNewCustomer = false;

// if (customer.email) {

//   existingCustomer =
//     await tx.customer.findUnique({
//       where: {
//         email: customer.email,
//       },
//     });

// }

// if (!existingCustomer) {

//   existingCustomer =
//     await tx.customer.findUnique({
//       where: {
//         phone: customer.phone,
//       },
//     });

// }
//       // Create if doesn't exist

//       if (!existingCustomer) {

//         existingCustomer =
//           await tx.customer.create({

//             data: {

//               name: customer.name,

//               email: customer.email || null,

//               phone: customer.phone,

//             },

//           });
//             isNewCustomer = true;
//       }

//       // ----------------------------------
// // Update customer details if changed
// // ----------------------------------

// if (!isNewCustomer) {

//   existingCustomer = await tx.customer.update({

//     where: {
//       id: existingCustomer.id,
//     },

//     data: {

//       name: customer.name,

//       email: customer.email || null,

//       phone: customer.phone,

//     },

//   });

// }

//       // Save address

//       // ----------------------------------
// // Save / Update Customer Address
// // ----------------------------------

// let savedAddress = await tx.address.findFirst({

//   where: {

//     customerId: existingCustomer.id,

//   },

// });

// if (savedAddress) {

//   savedAddress = await tx.address.update({

//     where: {

//       id: savedAddress.id,

//     },

//     data: {

//       fullName: address.fullName,

//       phone: address.phone,

//       addressLine1: address.addressLine1,

//       addressLine2: address.addressLine2,

//       landmark: address.landmark,

//       postOffice: address.postOffice,

//       district: address.district,

//       city: address.city,

//       state: address.state,

//       pincode: address.pincode,

//     },

//   });

// } else {

//   savedAddress = await tx.address.create({

//     data: {

//       customerId: existingCustomer.id,

//       fullName: address.fullName,

//       phone: address.phone,

//       addressLine1: address.addressLine1,

//       addressLine2: address.addressLine2,

//       landmark: address.landmark,

//       postOffice: address.postOffice,

//       district: address.district,

//       city: address.city,

//       state: address.state,

//       pincode: address.pincode,

//     },

//   });

// }

//         // -----------------------------
// // Create Order
// // -----------------------------

// const order = await tx.order.create({

//   data: {

//     receipt,

//     customerId: existingCustomer.id,

//     subtotal: pricing.subtotal,

// shippingCharge: pricing.shipping,

// total: pricing.total,

// discount: pricing.discount,

// couponCode:
//   pricing.coupon?.code ?? null,

//     shippingName:
//       address.fullName,

//     shippingPhone:
//       address.phone,

//     shippingAddress1:
//       address.addressLine1,

//     shippingAddress2:
//       address.addressLine2,

//     shippingCity:
//       address.city,

//     shippingState:
//       address.state,

//     shippingPincode:
//       address.pincode,

//     // processedAt: new Date(),

//     status: "PENDING",

//   },

// });


// await tx.orderStatusHistory.create({
//   data: {
//     orderId: order.id,
//     status: "PENDING",
//     note: "Order placed successfully.",
//   },
// });

// // -----------------------------
// // Create Order Items
// // -----------------------------

// await Promise.all(

//   pricing.validatedItems.map(async (item) => {

//     await tx.orderItem.create({

//       data: {

//         orderId: order.id,

//         productId: item.productId,

//         quantity: item.quantity,

//         price: item.unitPrice,

//       },

//     });

//   })

// );

// // -----------------------------
// // Create Payment
// // -----------------------------

// const createdPayment = await tx.payment.create({

//   data: {

//     orderId: order.id,

//     razorpayOrderId:
//       razorpay_order_id,

//     razorpayPaymentId:
//       razorpay_payment_id,

//     razorpaySignature:
//       razorpay_signature,

//     receipt,

//     amount: pricing.total,

//     status: "SUCCESS",

//     paidAt: new Date(),

//   },

// });



// // -----------------------------
// // Reduce Product Stock
// // -----------------------------
// await Promise.all(

//   pricing.validatedItems.map(async (item) => {

//     const updated =
//       await tx.product.updateMany({

//         where: {

//           id: item.productId,

//           stock: {

//             gte: item.quantity,

//           },

//         },

//         data: {

//           stock: {

//             decrement: item.quantity,

//           },

//         },

//       });

//     if (updated.count === 0) {

//       throw new ApiError(
//         400,
//         "Product went out of stock during checkout."
//       );

//     }
   

//   })
  

// ); // <-- You were missing this



// if (pricing.coupon) {

//   await tx.coupon.update({

//     where: {

//       id: pricing.coupon.id,

//     },

//     data: {

//       usedCount: {

//         increment: 1,

//       },

//     },

//   });

// }
//       return {

//         verified: true,

//         // For frontend (backward compatibility)
//   receipt: order.receipt,
//   orderId: order.id,
//   status: order.status,

//   // For notification services
//          order,
//         payment: createdPayment,

//          customer: existingCustomer,
//          address: savedAddress,
//         // customer: existingCustomer,

//         // address: savedAddress,

//         // order,
//          isNewCustomer,

//       };

//     }

//   );


// // ========================================
// // Realtime Socket Events
// // ========================================


//   try {
//   emitOrderUpdated(result.order);
//   emitPaymentUpdated(result.payment);
//   emitDashboardUpdate();

// for (const item of pricing.validatedItems) {
//     emitProductUpdated({
//       id: item.productId,
//     });
//   }

//   if (result.isNewCustomer) {
//     emitCustomerCreated(result.customer);
//   }

// } catch (error) {
//   console.error("Socket emit failed:", error);
// }

// //   if (result.isNewCustomer) {
// //   try {
// //     emitCustomerCreated(result.customer);
// //   } catch (error) {
// //     console.error("Customer socket emit failed:", error);
// //   }
// // }

// // try {
// //   emitPaymentUpdated(result);
// // } catch (error) {
// //   console.error("Payment socket emit failed:", error);
// // }
//   // ========================================
// // Admin Dashboard Notification
// // ========================================

// try {
//   await createNotification({
//     type: "ORDER",
//     title: "New Order Received",
//     message: `${result.order.receipt} • ₹${Number(result.order.total).toLocaleString("en-IN")}`,
//     route: "/orders",
//     entityId: result.order.id,
//     priority: "NORMAL",
//   });
// } catch (error) {
//   console.error(
//     "Admin notification failed:",
//     error.message
//   );
// }

// // ========================================
// // Customer Email / WhatsApp
// // ========================================
//   try {
//   await notificationService.sendOrderConfirmation(result);
// } catch (error) {
//   console.error("Order notification failed:",
//      error.response?.data || error.message
//   );
// }
//   return result;

// };