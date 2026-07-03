//FOR ADMIN PAYMENT PAGE TABLE

import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

//////////////////////////////////////////////////////////////
// GET PAYMENT STATS
//////////////////////////////////////////////////////////////

export const getPaymentStats = async () => {

  const [

    totalPayments,

    successfulPayments,

    pendingPayments,

    revenue,

  ] = await Promise.all([

    prisma.payment.count(),

    prisma.payment.count({

      where: {

        status: "SUCCESS",

      },

    }),

    prisma.payment.count({

      where: {

        status: "PENDING",

      },

    }),

    prisma.payment.aggregate({

      where: {

        status: "SUCCESS",

      },

      _sum: {

        amount: true,

      },

    }),

  ]);

  return {

    totalPayments,

    successfulPayments,

    pendingPayments,

    revenue: Number(revenue._sum.amount || 0),

  };

};

//////////////////////////////////////////////////////////////
// GET ALL PAYMENTS
//////////////////////////////////////////////////////////////

export const getAllPayments = async ({

  page = 1,

  limit = 10,

  search = "",

  status = "",

  sort = "newest",

}) => {

  page = Number(page);

  limit = Number(limit);

  const skip = (page - 1) * limit;

  //////////////////////////////////////////////////////////
  // SEARCH
  //////////////////////////////////////////////////////////

  const where = {};

  if (search) {

    where.OR = [

      {

        receipt: {

          contains: search,

          mode: "insensitive",

        },

      },

      {

        razorpayPaymentId: {

          contains: search,

          mode: "insensitive",

        },

      },

      {

        order: {

          customer: {

            name: {

              contains: search,

              mode: "insensitive",

            },

          },

        },

      },

      {

        order: {

          customer: {

            phone: {

              contains: search,

            },

          },

        },

      },

    ];

  }

  //////////////////////////////////////////////////////////
  // STATUS FILTER
  //////////////////////////////////////////////////////////

  if (status) {

    where.status = status;

  }

  //////////////////////////////////////////////////////////
  // SORTING
  //////////////////////////////////////////////////////////

  let orderBy = {

    createdAt: "desc",

  };

  switch (sort) {

    case "oldest":

      orderBy = {

        createdAt: "asc",

      };

      break;

    case "amount_low":

      orderBy = {

        amount: "asc",

      };

      break;

    case "amount_high":

      orderBy = {

        amount: "desc",

      };

      break;

    default:

      orderBy = {

        createdAt: "desc",

      };

  }
    //////////////////////////////////////////////////////////
  // DATABASE
  //////////////////////////////////////////////////////////

  const [payments, totalPayments] = await Promise.all([

    prisma.payment.findMany({

      where,

      skip,

      take: limit,

      orderBy,

      include: {

        order: {

          include: {

            customer: true,

          },

        },

      },

    }),

    prisma.payment.count({

      where,

    }),

  ]);

  //////////////////////////////////////////////////////////
  // FORMAT RESPONSE
  //////////////////////////////////////////////////////////

  const formattedPayments = payments.map((payment) => ({

    id: payment.id,

    receipt: payment.receipt,

    amount: Number(payment.amount),

    status: payment.status,

    paymentMethod:
      payment.paymentMethod || "Razorpay",

    razorpayOrderId:
      payment.razorpayOrderId,

    razorpayPaymentId:
      payment.razorpayPaymentId,

    paidAt: payment.paidAt,

    createdAt: payment.createdAt,

    customer: {

      id: payment.order.customer.id,

      name: payment.order.customer.name,

      email: payment.order.customer.email,

      phone: payment.order.customer.phone,

    },

    order: {

      id: payment.order.id,

      receipt: payment.order.receipt,

      status: payment.order.status,

      total: Number(payment.order.total),

    },

  }));

  //////////////////////////////////////////////////////////
  // RESPONSE
  //////////////////////////////////////////////////////////

  return {

    payments: formattedPayments,

    pagination: {

      page,

      limit,

      totalPayments,

      totalPages: Math.ceil(
        totalPayments / limit
      ),

    },

  };

};

//////////////////////////////////////////////////////////////
// GET PAYMENT BY ID
//////////////////////////////////////////////////////////////

export const getPaymentById = async (id) => {
      const payment = await prisma.payment.findUnique({

    where: {
      id,
    },

    include: {

      order: {

        include: {

          customer: true,

          orderItems: {

            include: {

              product: {

                include: {

                  images: true,

                },

              },

            },

          },

        },

      },

    },

  });

  if (!payment) {

    throw new ApiError(
      404,
      "Payment not found."
    );

  }

  //////////////////////////////////////////////////////////
  // RESPONSE
  //////////////////////////////////////////////////////////

  return {

    id: payment.id,

    receipt: payment.receipt,

    amount: Number(payment.amount),

    status: payment.status,

    paymentMethod:
      payment.paymentMethod || "Razorpay",

    razorpayOrderId:
      payment.razorpayOrderId,

    razorpayPaymentId:
      payment.razorpayPaymentId,

    razorpaySignature:
      payment.razorpaySignature,

    paidAt: payment.paidAt,

    createdAt: payment.createdAt,

    customer: {

      id: payment.order.customer.id,

      name: payment.order.customer.name,

      email: payment.order.customer.email,

      phone: payment.order.customer.phone,

    },

    order: {

      id: payment.order.id,

      receipt: payment.order.receipt,

      status: payment.order.status,

      subtotal: Number(payment.order.subtotal),

      shippingCharge: Number(
        payment.order.shippingCharge
      ),

      discount: Number(
        payment.order.discount
      ),

      total: Number(payment.order.total),

      createdAt: payment.order.createdAt,

      items: payment.order.orderItems.map(
        (item) => ({

          id: item.id,

          quantity: item.quantity,

          price: Number(item.price),

          product: {

            id: item.product.id,

            name: item.product.name,

            slug: item.product.slug,

            image:
              item.product.images[0]?.imageUrl ||
              null,

          },

        })
      ),

    },

  };

};

//////////////////////////////////////////////////////////////
// CHECK PAYMENT EXISTS
//////////////////////////////////////////////////////////////

export const paymentExists = async (id) => {

  const payment = await prisma.payment.findUnique({

    where: {
      id,
    },

    select: {
      id: true,
    },

  });

  return !!payment;

};

//////////////////////////////////////////////////////////////
// DEFAULT EXPORT
//////////////////////////////////////////////////////////////

export default {

  getPaymentStats,

  getAllPayments,

  getPaymentById,

  paymentExists,

};
