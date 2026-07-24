import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

// ======================================================
// STATUS LABELS
// ======================================================

const STATUS_LABELS = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out For Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

// ======================================================
// SEARCH ORDERS
// ======================================================

export const searchFeedbackOrders = async (query) => {
  const value = query.trim();

  const where = {
    OR: [
      {
        receipt: {
          equals: value,
          mode: "insensitive",
        },
      },

      {
        customer: {
          phone: value,
        },
      },

      {
        customer: {
          email: {
            equals: value,
            mode: "insensitive",
          },
        },
      },
    ],
  };

  const orders = await prisma.order.findMany({
    where,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      feedback: {
        select: {
          id: true,
          rating: true,
          createdAt: true,
        },
      },
    },
  });

  return {
    totalOrders: orders.length,

    orders: orders.map((order) => ({
      id: order.id,

      receipt: order.receipt,

      status: order.status,

      statusLabel: STATUS_LABELS[order.status],

      createdAt: order.createdAt,

      canGiveFeedback: order.status === "DELIVERED",

      feedbackSubmitted: !!order.feedback,
    })),
  };
};

// ======================================================
// SUBMIT FEEDBACK
// ======================================================

export const submitFeedback = async ({
  orderId,
  rating,
  message,
}) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },

    include: {
      feedback: true,
    },
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  if (order.status !== "DELIVERED") {
    throw new ApiError(
      400,
      "Feedback can only be submitted for delivered orders."
    );
  }

  if (order.feedback) {
    throw new ApiError(
      400,
      "Feedback has already been submitted for this order."
    );
  }

  const feedback = await prisma.feedback.create({
    data: {
      orderId,

      rating,

      message,
    },
  });

  return feedback;
};