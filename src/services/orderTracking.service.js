import prisma from "../lib/prisma.js";
import AppError from "../utils/ApiError.js";

const STATUS_LABELS = {
  PENDING: "Order Placed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

const STATUS_NOTES = {
  PENDING: "Your order has been placed successfully.",
  PROCESSING: "We're preparing your order.",
  PACKED: "Your order has been packed.",
  SHIPPED: "Your order has been shipped.",
  OUT_FOR_DELIVERY: "Your order is out for delivery.",
  DELIVERED: "Your order has been delivered.",
  CANCELLED: "Your order has been cancelled.",
  RETURNED: "Your order has been returned.",
};

const mapOrder = (order) => ({
  receipt: order.receipt,
  status: order.status,
  statusLabel: STATUS_LABELS[order.status],
  createdAt: order.createdAt,

  timeline: order.statusHistory
    .filter((history) => {
      const note = history.note?.toLowerCase() || "";

      return (
        !note.includes("email") &&
        !note.includes("whatsapp")
      );
    })
    .map((history) => ({
      status: history.status,
      label: STATUS_LABELS[history.status],
      note:
        STATUS_NOTES[history.status] ??
        history.note,
      createdAt: history.createdAt,
    })),
});

export const trackOrder = async (query) => {
  const isEmail = /\S+@\S+\.\S+/.test(query);
  const isPhone = /^\d{10}$/.test(query);
  const isReceipt = query.startsWith("PF-");

  let orders = [];

  // -----------------------------
  // Search by Receipt
  // -----------------------------
  if (isReceipt) {
    const order = await prisma.order.findUnique({
      where: {
        receipt: query,
      },

      include: {
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (order) {
      orders = [order];
    }
  }

  // -----------------------------
  // Search by Phone
  // -----------------------------
  else if (isPhone) {
    orders = await prisma.order.findMany({
      where: {
        customer: {
          phone: query,
        },
      },

      include: {
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // -----------------------------
  // Search by Email
  // -----------------------------
  else if (isEmail) {
    orders = await prisma.order.findMany({
      where: {
        customer: {
          email: query,
        },
      },

      include: {
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  else {
    throw new AppError(
      "Please enter a valid phone number, email address or order number.",
      400
    );
  }

  if (!orders.length) {
    throw new AppError(
      "No orders found.",
      404
    );
  }

  return {
    totalOrders: orders.length,

    orders: orders.map(mapOrder),
  };
};