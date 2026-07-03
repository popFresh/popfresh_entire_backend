import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

//////////////////////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////////////////////

const buildCustomerStatus = (totalOrders) => {

  if (totalOrders <= 1) return "New";

  if (totalOrders <= 5) return "Active";

  return "Loyal";

};

const getCustomerAvatar = (name) => {
  if (!name) return "?";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

//////////////////////////////////////////////////////////////
// GET CUSTOMER STATS
//////////////////////////////////////////////////////////////

export const getCustomerStats = async () => {
  const [totalCustomers, totalOrders, revenue, customers] =
    await Promise.all([
      prisma.customer.count(),

      prisma.order.count(),

      prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),

      prisma.customer.findMany({
        select: {
          orders: {
            select: {
              id: true,
            },
          },
        },
      }),
    ]);

  const repeatCustomers = customers.filter(
    (customer) => customer.orders.length > 1
  ).length;

  return {
    totalCustomers,

    totalOrders,

    revenue: Number(revenue._sum.total || 0),

    repeatCustomers,
  };
};

//////////////////////////////////////////////////////////////
// GET ALL CUSTOMERS
//////////////////////////////////////////////////////////////

export const getAllCustomers = async ({
  page = 1,
  limit = 10,
  search = "",
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
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: search,
        },
      },
    ];
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

    case "name_asc":
      orderBy = {
        name: "asc",
      };
      break;

    case "name_desc":
      orderBy = {
        name: "desc",
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

  const [customers, totalCustomers] = await Promise.all([
    prisma.customer.findMany({
      where,

      skip,

      take: limit,

      orderBy,

      include: {
        addresses: {
          take: 1,
        },

        orders: {
          select: {
            id: true,
            receipt: true,
            total: true,
            status: true,
            createdAt: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    }),

    prisma.customer.count({
      where,
    }),
  ]);

  //////////////////////////////////////////////////////////
  // FORMAT RESPONSE
  //////////////////////////////////////////////////////////

  const formattedCustomers = customers.map((customer) => {
    const totalOrders = customer.orders.length;

    const totalSpent = customer.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );

    const latestOrder =
      customer.orders.length > 0
        ? customer.orders[0]
        : null;

    return {
      id: customer.id,

      avatar: getCustomerAvatar(customer.name),

      name: customer.name,

      email: customer.email,

      phone: customer.phone,

      joinedOn: customer.createdAt,

      totalOrders,

      totalSpent,

      status: buildCustomerStatus(totalOrders),

      lastOrder: latestOrder
        ? {
            id: latestOrder.id,
            receipt: latestOrder.receipt,
            status: latestOrder.status,
            total: Number(latestOrder.total),
            createdAt: latestOrder.createdAt,
          }
        : null,
    };
  });

  //////////////////////////////////////////////////////////
  // RESPONSE
  //////////////////////////////////////////////////////////

  return {
    customers: formattedCustomers,

    pagination: {
      page,

      limit,

      totalCustomers,

      totalPages: Math.ceil(totalCustomers / limit),
    },
  };
};
//////////////////////////////////////////////////////////////
// GET CUSTOMER BY ID
//////////////////////////////////////////////////////////////

export const getCustomerById = async (id) => {

  const customer = await prisma.customer.findUnique({

    where: {
      id,
    },

    include: {

      addresses: true,

      orders: {

        orderBy: {
          createdAt: "desc",
        },

        include: {

          payment: {
            select: {
              status: true,
              paymentMethod: true,
              paidAt: true,
            },
          },

          orderItems: {

            include: {

              product: {

                select: {

                  id: true,

                  name: true,

                  slug: true,

                  images: {

                    orderBy: {
                      displayOrder: "asc",
                    },

                    take: 1,

                    select: {
                      imageUrl: true,
                    },

                  },

                },

              },

            },

          },

        },

      },

    },

  });

  if (!customer) {
    throw new ApiError(
      404,
      "Customer not found."
    );
  }

  //////////////////////////////////////////////////////////
  // CUSTOMER STATS
  //////////////////////////////////////////////////////////

  const totalOrders = customer.orders.length;

  const totalSpent = customer.orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const averageOrderValue =
    totalOrders > 0
      ? totalSpent / totalOrders
      : 0;

  const latestOrder =
    customer.orders.length > 0
      ? customer.orders[0]
      : null;

  //////////////////////////////////////////////////////////
  // PRIMARY ADDRESS
  //////////////////////////////////////////////////////////

  const primaryAddress =
    customer.addresses.length > 0
      ? customer.addresses[0]
      : null;

  //////////////////////////////////////////////////////////
  // ORDER HISTORY
  //////////////////////////////////////////////////////////

  const orders = customer.orders.map((order) => ({

    id: order.id,

    receipt: order.receipt,

    status: order.status,

    subtotal: Number(order.subtotal),

    shippingCharge: Number(order.shippingCharge),

    discount: Number(order.discount),

    total: Number(order.total),

    couponCode: order.couponCode,

    courierName: order.courierName,

    trackingNumber: order.trackingNumber,

    trackingUrl: order.trackingUrl,

    cancelReason: order.cancelReason,

    returnReason: order.returnReason,

    internalNote: order.internalNote,

    createdAt: order.createdAt,

    processedAt: order.processedAt,

    packedAt: order.packedAt,

    shippedAt: order.shippedAt,

    deliveredAt: order.deliveredAt,

    paymentStatus:
      order.payment?.status || "PENDING",

    paymentMethod:
      order.payment?.paymentMethod || null,

    paidAt:
      order.payment?.paidAt || null,

    items: order.orderItems.map((item) => ({

      id: item.id,

      quantity: item.quantity,

      price: Number(item.price),

      product: {

        id: item.product.id,

        name: item.product.name,

        slug: item.product.slug,

        image:
          item.product.images[0]?.imageUrl || null,

      },

    })),

  }));

  //////////////////////////////////////////////////////////
  // RESPONSE
  //////////////////////////////////////////////////////////

  return {

    id: customer.id,

    avatar: getCustomerAvatar(customer.name),

    name: customer.name,

    email: customer.email,

    phone: customer.phone,

    joinedOn: customer.createdAt,

    status: buildCustomerStatus(totalOrders),

    totalOrders,

    totalSpent,

    averageOrderValue,

    lastOrder: latestOrder
      ? {
          id: latestOrder.id,
          receipt: latestOrder.receipt,
          status: latestOrder.status,
          total: Number(latestOrder.total),
          createdAt: latestOrder.createdAt,
        }
      : null,

    address: primaryAddress
  ? {

      id: primaryAddress.id,

      fullName: primaryAddress.fullName,

      phone: primaryAddress.phone,

      line1: primaryAddress.addressLine1,

      line2: primaryAddress.addressLine2,

      landmark: primaryAddress.landmark,

      postOffice: primaryAddress.postOffice,

      district: primaryAddress.district,

      city: primaryAddress.city,

      state: primaryAddress.state,

      pincode: primaryAddress.pincode,

    }
  : null,

    orders,

  };

};
//////////////////////////////////////////////////////////////
// EXPORT CUSTOMERS
//////////////////////////////////////////////////////////////

export const exportCustomers = async () => {

  const customers = await prisma.customer.findMany({

    orderBy: {
      createdAt: "desc",
    },

    include: {

      addresses: {
        take: 1,
      },

      orders: {

        select: {

          id: true,

          receipt: true,

          total: true,

          status: true,

          createdAt: true,

        },

        orderBy: {
          createdAt: "desc",
        },

      },

    },

  });

  return customers.map((customer) => {

    const totalOrders = customer.orders.length;

    const totalSpent = customer.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );

    const latestOrder =
      customer.orders.length > 0
        ? customer.orders[0]
        : null;

    const address =
      customer.addresses.length > 0
        ? customer.addresses[0]
        : null;

    return {

      id: customer.id,

      name: customer.name,

      email: customer.email,

      phone: customer.phone,

      joinedOn: customer.createdAt,

      status: buildCustomerStatus(totalOrders),

      totalOrders,

      totalSpent,

      lastOrder: latestOrder
        ? latestOrder.createdAt
        : null,

      address: address
        ? [
            address.addressLine1,
            address.addressLine2,
            address.landmark,
            address.city,
            address.state,
            address.pincode,
          ]
            .filter(Boolean)
            .join(", ")
        : "-",

    };

  });

};

//////////////////////////////////////////////////////////////
// CHECK CUSTOMER EXISTS
//////////////////////////////////////////////////////////////

export const customerExists = async (id) => {

  const customer = await prisma.customer.findUnique({

    where: {
      id,
    },

    select: {
      id: true,
    },

  });

  return Boolean(customer);

};

//////////////////////////////////////////////////////////////
// DEFAULT EXPORT
//////////////////////////////////////////////////////////////

export default {

  getCustomerStats,

  getAllCustomers,

  getCustomerById,

  exportCustomers,

  customerExists,

};
