import prisma from "../lib/prisma.js";

export const search = async (query) => {
  const searchQuery = query.trim();

  if (!searchQuery) {
    return [];
  }

  const [products, customers, orders] = await Promise.all([
    // ==============================================
    // Products
    // ==============================================

    prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            sku: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
      },
    }),

    // ==============================================
    // Customers
    // ==============================================

    prisma.customer.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    }),

    // ==============================================
    // Orders
    // ==============================================

    prisma.order.findMany({
      where: {
        OR: [
          {
            receipt: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            customer: {
              is: {
                OR: [
                  {
                    name: {
                      contains: searchQuery,
                      mode: "insensitive",
                    },
                  },
                  {
                    phone: {
                      contains: searchQuery,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        receipt: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    }),
  ]);

  // ==============================================
  // Format Results
  // ==============================================

  return [
   ...products.map((product) => ({
  id: product.id,
  type: "Product",
  title: product.name,
  subtitle: `${product.sku} • Stock: ${product.stock}`,
  route: "/products",
  entityId: product.id,
})),

...customers.map((customer) => ({
  id: customer.id,
  type: "Customer",
  title: customer.name,
  subtitle: customer.email
    ? `${customer.phone} • ${customer.email}`
    : customer.phone,
  route: "/customers",
  entityId: customer.id,
})),
   

  ...orders.map((order) => ({
  id: order.id,
  type: "Order",
  title: order.receipt ?? order.id,
  subtitle: `${order.customer.name} • ${order.customer.phone}`,
  route: "/orders",
  entityId: order.id,
})),
  ];
};