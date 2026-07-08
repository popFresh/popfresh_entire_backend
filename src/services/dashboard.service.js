import prisma from "../lib/prisma.js";

export const getSummary = async (admin) => {
   console.log("admin received:", admin);
  const adminData = await prisma.admin.findUnique({
    where: {
      id: admin.id,
    },
    select: {
      name: true,
    },
  });

  const adminName = adminData?.name ?? "Admin";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [
    todayOrders,
    yesterdayOrders,
    todayRevenue,
    yesterdayRevenue,
    pendingOrders,
    processingOrders,
    packedOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),

    prisma.order.count({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        paidAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        paidAt: {
          gte: yesterday,
          lt: today,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.order.count({
      where: {
        status: "PROCESSING",
      },
    }),

    prisma.order.count({
      where: {
        status: "PACKED",
      },
    }),

    prisma.product.count({
      where: {
        stock: {
          lte: 10,
        },
      },
    }),
  ]);

  const todayRevenueAmount = Number(todayRevenue._sum.amount ?? 0);
  const yesterdayRevenueAmount = Number(yesterdayRevenue._sum.amount ?? 0);

  const todayOrdersGrowth =
    yesterdayOrders === 0
      ? todayOrders > 0
        ? null
        : 0
      : Number(
          (
            ((todayOrders - yesterdayOrders) / yesterdayOrders) *
            100
          ).toFixed(1)
        );

  const todayRevenueGrowth =
    yesterdayRevenueAmount === 0
      ? todayRevenueAmount > 0
        ? null
        : 0
      : Number(
          (
            ((todayRevenueAmount - yesterdayRevenueAmount) /
              yesterdayRevenueAmount) *
            100
          ).toFixed(1)
        );

  return {
    adminName,
    todayOrders,
    todayRevenue: todayRevenueAmount,

    todayOrdersGrowth,
    todayRevenueGrowth,

    pendingActions:
      pendingOrders +
      processingOrders +
      packedOrders,

    lowStockProducts,

     
  };
};

// ======================
//PART - 2
// ======================


export const getRevenueChart = async (range = "30d") => {
  const ranges = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "1y": 365,
  };

  const days = ranges[range] || 30;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [payments, orders] = await Promise.all([
    prisma.payment.findMany({
      where: {
        status: "SUCCESS",
        paidAt: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
        paidAt: true,
      },
    }),

    prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
    }),
  ]);

  const chartMap = new Map();

//   const formatLabel = (date) => {
//     if (range === "7d") {
//       return date.toLocaleDateString("en-US", {
//         weekday: "short",
//       });
//     }

//     if (range === "30d") {
//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       });
//     }

//   if (range === "90d") {
//   return date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });
// }

//     return date.toLocaleDateString("en-US", {
//       month: "short",
//     });
//   };

const formatLabel = (date) => {
  if (range === "7d") {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  }

  if (range === "30d") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  if (range === "90d") {
    const diff = Math.floor(
      (date - startDate) / (1000 * 60 * 60 * 24)
    );

    return `Week ${Math.floor(diff / 7) + 1}`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
  });
};

  payments.forEach((payment) => {
    const label = formatLabel(new Date(payment.paidAt));

    if (!chartMap.has(label)) {
      chartMap.set(label, {
        label,
        revenue: 0,
        orders: 0,
      });
    }

    chartMap.get(label).revenue += Number(payment.amount);
  });

  orders.forEach((order) => {
    const label = formatLabel(new Date(order.createdAt));

    if (!chartMap.has(label)) {
      chartMap.set(label, {
        label,
        revenue: 0,
        orders: 0,
      });
    }

    chartMap.get(label).orders += 1;
  });

//   const labels = [];

// for (let i = days - 1; i >= 0; i--) {
//   const date = new Date();
//   date.setDate(date.getDate() - i);

//   labels.push(formatLabel(date));
// }

let labels = [];

if (range === "90d") {
  labels = Array.from(
    { length: Math.ceil(days / 7) },
    (_, index) => `Week ${index + 1}`
  );
}
else if (range === "1y") {
  const today = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1
    );

    labels.push(
      date.toLocaleDateString("en-US", {
        month: "short",
      })
    );
  }
}
else {
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    labels.push(formatLabel(date));
  }
}


const chart = labels.map((label) => {
  const existing = chartMap.get(label);

  return {
    label,
    revenue: existing?.revenue ?? 0,
    orders: existing?.orders ?? 0,
  };
});

  const totalRevenue = chart.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const totalOrders = chart.reduce(
    (sum, item) => sum + item.orders,
    0
  );

  return {
    totalRevenue,
    totalOrders,
    chart,
  };
};
// ======================
//PART - 3
// ======================
export const getRecentOrders = async ({
  page = 1,
  limit = 5,
} = {}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },

        payment: {
          select: {
            status: true,
            paymentMethod: true,
          },
        },

        orderItems: {
          take: 1,
          include: {
            product: {
              select: {
                name: true,
                images: {
                  take: 1,
                  orderBy: {
                    displayOrder: "asc",
                  },
                  select: {
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    }),

    prisma.order.count(),
  ]);

  return {
    orders: orders.map((order) => ({
      id: order.id,

      receipt: order.receipt,

      customer: {
        id: order.customer.id,
        name: order.customer.name,
        phone: order.customer.phone,
      },

      total: Number(order.total),

      status: order.status,

      paymentStatus: order.payment?.status ?? "PENDING",

      paymentMethod: order.payment?.paymentMethod ?? null,

      product:
        order.orderItems.length > 0
          ? {
              name: order.orderItems[0].product.name,
              image:
                order.orderItems[0].product.images[0]?.imageUrl ??
                null,
            }
          : null,

      createdAt: order.createdAt,
    })),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ======================
//PART - 4
// ======================
export const getTopSellingProducts = async (limit = 5) => {
  limit = Number(limit);

  const groupedProducts = await prisma.orderItem.groupBy({
    by: ["productId"],

    _sum: {
      quantity: true,
      price: true,
    },

    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },

    take: limit,
  });

  const productIds = groupedProducts.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },

    include: {
      images: {
        take: 1,
        orderBy: {
          displayOrder: "asc",
        },
        select: {
          imageUrl: true,
        },
      },

      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const productMap = new Map(
    products.map((product) => [product.id, product])
  );

  // return groupedProducts.map((item, index) => {
  //   const product = productMap.get(item.productId);

  //   return {
  //     rank: index + 1,

  //     id: product.id,

  //     name: product.name,

  //     sku: product.sku,

  //     category: product.category.name,

  //     image: product.images[0]?.imageUrl ?? null,

  //     sold: Number(item._sum.quantity ?? 0),

  //     revenue:
  //       Number(item._sum.price ?? 0),

  //     stock: product.stock,

  //     status: product.status,
  //   };

  const maxSold = Math.max(
  ...groupedProducts.map(
    (item) => Number(item._sum.quantity ?? 0)
  ),
  1
);

return groupedProducts.map((item, index) => {
  const product = productMap.get(item.productId);

  const sold = Number(item._sum.quantity ?? 0);

  const revenue =
    sold *
    Number(product.discountPrice ?? product.price);

  return {
    rank: index + 1,

    id: product.id,

    name: product.name,

    sku: product.sku,

    category: product.category.name,

    image: product.images[0]?.imageUrl ?? null,

    sold,

    revenue,

    salesPercentage: Math.round(
      (sold / maxSold) * 100
    ),

    stock: product.stock,

    status: product.status,
  };
});
  
};

// ======================
//PART - 5
// ======================

export const getInventoryOverview = async () => {
  const [
    totalProducts,
    healthyProducts,
    lowStockProducts,
    outOfStockProducts,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.product.count({
      where: {
        stock: {
          gt: 10,
        },
      },
    }),

    prisma.product.count({
      where: {
        stock: {
          gt: 0,
          lte: 10,
        },
      },
    }),

    prisma.product.count({
      where: {
        stock: 0,
      },
    }),
  ]);
return {
    totalProducts,
    healthyProducts,
    lowStockProducts,
    outOfStockProducts,
  };
};

// ======================
//PART - 6
// ======================

// export const getCustomerOverview = async () => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const monthStart = new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     1
//   );

//   const [
//     totalCustomers,
//     newCustomersToday,
//     newCustomersThisMonth,
//     customers,
//   ] = await Promise.all([
//     prisma.customer.count(),

//     prisma.customer.count({
//       where: {
//         createdAt: {
//           gte: today,
//         },
//       },
//     }),

//     prisma.customer.count({
//       where: {
//         createdAt: {
//           gte: monthStart,
//         },
//       },
//     }),

//     prisma.customer.findMany({
//       select: {
//         id: true,
//         _count: {
//           select: {
//             orders: true,
//           },
//         },
//       },
//     }),
//   ]);

//   const repeatCustomers = customers.filter(
//     (customer) => customer._count.orders >= 2
//   ).length;

//   const returningPercentage =
//   totalCustomers === 0
//     ? 0
//     : Number(
//         ((repeatCustomers / totalCustomers) * 100).toFixed(1)
//       );

// const newPercentage = Number(
//   (100 - returningPercentage).toFixed(1)
// );

//   return {
//     totalCustomers,
//     newCustomersToday,
//     newCustomersThisMonth,
//     repeatCustomers,

//     returningPercentage,
//     newPercentage
//   };
// };

export const getCustomerOverview = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const [
    totalCustomers,
    newCustomersToday,
    newCustomersThisMonth,
    customers,
    paymentStats,
  ] = await Promise.all([
    prisma.customer.count(),

    prisma.customer.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    }),

    prisma.customer.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    }),

    prisma.customer.findMany({
      select: {
        id: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    }),
  ]);

  const repeatCustomers = customers.filter(
    (customer) => customer._count.orders >= 2
  ).length;

  const returningPercentage =
    totalCustomers === 0
      ? 0
      : Number(
          (
            (repeatCustomers / totalCustomers) *
            100
          ).toFixed(1)
        );

  const newPercentage = Number(
    (100 - returningPercentage).toFixed(1)
  );

  const totalRevenue = Number(paymentStats._sum.amount ?? 0);

  const successfulOrders = paymentStats._count.id;

  const averageOrderValue =
    successfulOrders === 0
      ? 0
      : Number(
          (totalRevenue / successfulOrders).toFixed(2)
        );

  return {
    totalCustomers,

    newCustomersToday,

    newCustomersThisMonth,

    repeatCustomers,

    returningPercentage,

    newPercentage,

    averageOrderValue,
  };
};
// ======================
//PART - 7
// ======================

export const getNotifications = async () => {
  const [
    pendingOrders,
    processingOrders,
    packedOrders,
    lowStockProducts,
    outOfStockProducts,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.order.count({
      where: {
        status: "PROCESSING",
      },
    }),

    prisma.order.count({
      where: {
        status: "PACKED",
      },
    }),

    prisma.product.findMany({
      where: {
        stock: {
          gt: 0,
          lte: 10,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
      },
      take: 5,
      orderBy: {
        stock: "asc",
      },
    }),

    prisma.product.findMany({
      where: {
        stock: 0,
      },
      select: {
        id: true,
        name: true,
      },
      take: 5,
    }),
  ]);

  const notifications = [];

  if (pendingOrders > 0) {
    notifications.push({
      type: "PENDING_ORDERS",
      title: "Pending Orders",
      message: `${pendingOrders} order(s) are waiting to be processed.`,
      severity: "warning",
    });
  }

  if (processingOrders > 0) {
    notifications.push({
      type: "PROCESSING_ORDERS",
      title: "Orders in Processing",
      message: `${processingOrders} order(s) are currently being processed.`,
      severity: "info",
    });
  }

  if (packedOrders > 0) {
    notifications.push({
      type: "PACKED_ORDERS",
      title: "Ready to Ship",
      message: `${packedOrders} packed order(s) are ready for shipment.`,
      severity: "success",
    });
  }

  lowStockProducts.forEach((product) => {
    notifications.push({
      type: "LOW_STOCK",
      title: "Low Stock",
      message: `${product.name} has only ${product.stock} item(s) remaining.`,
      severity: "warning",
    });
  });

  outOfStockProducts.forEach((product) => {
    notifications.push({
      type: "OUT_OF_STOCK",
      title: "Out of Stock",
      message: `${product.name} is out of stock.`,
      severity: "error",
    });
  });

  const severityOrder = {
  error: 1,
  warning: 2,
  info: 3,
  success: 4,
};

notifications.sort(
  (a, b) =>
    severityOrder[a.severity] -
    severityOrder[b.severity]
);

  return notifications;
};

export const getDashboard = async (admin) => {
  const [
    summary,
    revenueChart,
    recentOrders,
    topProducts,
    inventory,
    customers,
    notifications,
  ] = await Promise.all([
    getSummary(admin),
    getRevenueChart("30d"),
    getRecentOrders(),
    getTopSellingProducts(),
    getInventoryOverview(),
    getCustomerOverview(),
    getNotifications(),
  ]);

  return {
    lastUpdated: new Date(),

    summary,
    revenueChart,
    recentOrders,
    topProducts,
    inventory,
    customers,
    notifications,
  };
};

// import prisma from "../lib/prisma.js";

// export const getSummary = async () => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const yesterday = new Date(today);
//   yesterday.setDate(today.getDate() - 1);

//   const tomorrow = new Date(today);
//   tomorrow.setDate(today.getDate() + 1);

//   const [
//     todayOrders,
//     yesterdayOrders,
//     todayRevenue,
//     yesterdayRevenue,
//     pendingOrders,
//     processingOrders,
//     packedOrders,
//     lowStockProducts,
//   ] = await Promise.all([
//     prisma.order.count({
//       where: {
//         createdAt: {
//           gte: today,
//           lt: tomorrow,
//         },
//       },
//     }),

//     prisma.order.count({
//       where: {
//         createdAt: {
//           gte: yesterday,
//           lt: today,
//         },
//       },
//     }),

//     prisma.payment.aggregate({
//       where: {
//         status: "SUCCESS",
//         paidAt: {
//           gte: today,
//           lt: tomorrow,
//         },
//       },
//       _sum: {
//         amount: true,
//       },
//     }),

//     prisma.payment.aggregate({
//       where: {
//         status: "SUCCESS",
//         paidAt: {
//           gte: yesterday,
//           lt: today,
//         },
//       },
//       _sum: {
//         amount: true,
//       },
//     }),

//     prisma.order.count({
//       where: {
//         status: "PENDING",
//       },
//     }),

//     prisma.order.count({
//       where: {
//         status: "PROCESSING",
//       },
//     }),

//     prisma.order.count({
//       where: {
//         status: "PACKED",
//       },
//     }),

//     prisma.product.count({
//       where: {
//         stock: {
//           lte: 10,
//         },
//       },
//     }),
//   ]);

//   const todayRevenueAmount = Number(todayRevenue._sum.amount || 0);
//   const yesterdayRevenueAmount = Number(yesterdayRevenue._sum.amount || 0);

//   const orderGrowth =
//     yesterdayOrders === 0
//       ? 100
//       : ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100;

//   const revenueGrowth =
//     yesterdayRevenueAmount === 0
//       ? 100
//       : ((todayRevenueAmount - yesterdayRevenueAmount) /
//           yesterdayRevenueAmount) *
//         100;

//   return {
//     todayOrders,
//     todayRevenue: todayRevenueAmount,

//     todayOrdersGrowth: Number(orderGrowth.toFixed(1)),
//     todayRevenueGrowth: Number(revenueGrowth.toFixed(1)),

//     pendingActions: pendingOrders + processingOrders + packedOrders,

//     lowStockProducts,
//   };
// };