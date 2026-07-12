import prisma from "../lib/prisma.js";

export const addOrderActivity = async ({
  orderId,
  status,
  note,
}) => {
  await prisma.orderStatusHistory.create({
    data: {
      orderId,
      status,
      note,
    },
  });
};