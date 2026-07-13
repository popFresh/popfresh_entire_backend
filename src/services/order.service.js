import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import orderNotificationService from "./notification/orderNotification.service.js";
import {
  emitOrderUpdated,
  emitDashboardUpdate,
} from "../socket/events.js";

const VALID_ORDER_TRANSITIONS = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  CANCELLED: [],
  RETURNED: [],
};


// const VALID_ORDER_TRANSITIONS = {
//   PENDING: ["PROCESSING", "CANCELLED"],
//   PROCESSING: ["PACKED", "CANCELLED"],
//   PACKED: ["SHIPPED", "CANCELLED"],
//   SHIPPED: ["DELIVERED"],
//   DELIVERED: ["RETURNED"],
//   CANCELLED: [],
//   RETURNED: [],
// };


export const updateOrderStatusInternal = async (
  tx,
  existingOrder,
  data,
  options = {}
) => {

  const {
  status,
  cancelReason,
  returnReason,
  internalNote,
} = data;

const updateData = {
    status,
};

  switch (status) {

    case "PROCESSING":
      updateData.processedAt = new Date();
      break;

    case "PACKED":
      updateData.packedAt = new Date();
      break;

    case "SHIPPED":
      updateData.shippedAt = new Date();
      break;

      case "OUT_FOR_DELIVERY":
  updateData.outForDeliveryAt = new Date();
  break;

    case "DELIVERED":
      updateData.deliveredAt = new Date();
      break;

    case "CANCELLED":
      updateData.cancelledAt = new Date();
      break;

    case "RETURNED":
      updateData.returnedAt = new Date();
      break;

  }



  const updatedOrder = await tx.order.update({

  where: {
    id: existingOrder.id,
  },

  data: updateData,

  include: {

    customer: true,

    payment: true,

    shipment: {
      include: {
        trackingHistory: {
          orderBy: {
            eventTime: "asc",
          },
        },
      },
    },

    statusHistory: {
      orderBy: {
        createdAt: "asc",
      },
    },

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

});

let historyNote = internalNote ?? null;

if (status === "CANCELLED") {
  historyNote = cancelReason;
}

if (status === "RETURNED") {
  historyNote = returnReason;
}


const historyData = {
  orderId: existingOrder.id,
  status,
  note: historyNote,
};

// console.log(historyData);

await tx.orderStatusHistory.create({
  data: historyData,
});




return updatedOrder;
};

export const handleOrderStatusSideEffects = async (
  updatedOrder
) => {

  const notificationData = {
    order: updatedOrder,
    customer: updatedOrder.customer,
  };

  try {
    switch (updatedOrder.status) {
      case "PACKED":
        await orderNotificationService.sendOrderPacked(notificationData);
        break;

      case "SHIPPED":
        await orderNotificationService.sendOrderShipped(notificationData);
        break;

      case "OUT_FOR_DELIVERY":
        await orderNotificationService.sendOutForDelivery(notificationData);
        break;

      case "DELIVERED":
        await orderNotificationService.sendOrderDelivered(notificationData);
        break;
    }
  } catch (error) {
    console.error(
      "Order notification failed:",
      error.response?.data || error.message
    );
  }

  try {
    emitOrderUpdated(updatedOrder);
    emitDashboardUpdate();
  } catch (error) {
    console.error("Socket emit failed:", error);
  }
};
// ===============================================
// GET ORDER BY ID (Internal Helper)
// ===============================================

export const getOrderById = async (id) => {

  const order = await prisma.order.findUnique({

    where: {
      id,
    },

    include: {

    customer: {
        include: {
            addresses: {
                take: 1,
            },
        },
    },

    payment: true,

    shipment: {

        include: {

            trackingHistory: {

                orderBy: {

                    eventTime: "asc",

                },

            },

        },

    },

    statusHistory: {

        orderBy: {

            createdAt: "asc",

        },

    },

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

//     include: {

//     //   customer: true,
//     customer: {
//   include: {
//     addresses: {
//       take: 1,
//     },
//   },
// },

//       payment: true,

//       statusHistory: {

//         orderBy: {
//           createdAt: "asc",
//         },

//       },

//       orderItems: {

//         include: {

//           product: {

//             include: {
//               images: true,
//             },

//           },

//         },

//       },

//     },

  });

  if (!order) {

    throw new ApiError(404, "Order not found.");

  }

  return order;

};
// ===============================================
// GET ALL ORDERS
// ===============================================

export const getAllOrders = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  sort = "newest",
}) => {

  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const where = {};

  // -------------------------
  // SEARCH
  // -------------------------

  if (search) {

    where.OR = [

      {
        receipt: {
          contains: search,
          mode: "insensitive",
        },
      },

      {
        customer: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },

      {
        customer: {
          phone: {
            contains: search,
          },
        },
      },

    ];

  }

  // -------------------------
  // STATUS FILTER
  // -------------------------

  if (status) {

    where.status = status;

  }

  // -------------------------
  // SORTING
  // -------------------------

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

        total: "asc",

      };

      break;

    case "amount_high":

      orderBy = {

        total: "desc",

      };

      break;

    default:

      orderBy = {

        createdAt: "desc",

      };

  }

  // -------------------------
  // DATABASE
  // -------------------------

  const [orders, totalOrders] = await Promise.all([

    prisma.order.findMany({

      where,

      skip,

      take: limit,

      orderBy,

      include: {

        customer: true,

        payment: true,

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

    }),

    prisma.order.count({

      where,

    }),

  ]);

  return {

    orders,

    pagination: {

      page,

      limit,

      totalOrders,

      totalPages: Math.ceil(totalOrders / limit),

    },

  };

};

// ===============================================
// GET DASHBOARD STATS
// ===============================================

export const getOrderStats = async () => {

  const [

    totalOrders,

    processing,

    shipped,

    revenue,

  ] = await Promise.all([

    prisma.order.count(),

    prisma.order.count({

      where: {

        status: "PROCESSING",

      },

    }),

    prisma.order.count({

      where: {

        status: "SHIPPED",

      },

    }),

    prisma.order.aggregate({

      _sum: {

        total: true,

      },

    }),

  ]);

  return {

    totalOrders,

    processing,

    shipped,

    revenue: revenue._sum.total || 0,

  };

};

// ===============================================
// UPDATE ORDER STATUS
// ===============================================

export const updateOrderStatus = async (
  id,
  data
) => {

const order = await getOrderById(id);

const {
  status,
} = data;

if (order.status === status) {
  throw new ApiError(
    400,
    `Order is already ${status}.`
  );
}
  // ==========================================
// VALIDATE STATUS TRANSITION
// ==========================================




if (!VALID_ORDER_TRANSITIONS[order.status].includes(status)) {
  throw new ApiError(
    400,
    `Cannot change order from ${order.status} to ${status}.`
  );
}

  // ==========================
  // OPTIONAL FIELDS
  // ==========================

  

  // ==========================
  // TRANSACTION
  // ==========================
const updatedOrder = await prisma.$transaction(async (tx) => {
  return updateOrderStatusInternal(
    tx,
    order,
    data
  );
});

  
await handleOrderStatusSideEffects(updatedOrder);

return updatedOrder;
};

