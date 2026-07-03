import prisma from "../lib/prisma.js";

import ApiError from "../utils/ApiError.js";

export const createShippingRule = async (data) => {

  const existingRule =
  await prisma.shippingRule.findFirst();

  if (existingRule) {

   throw new ApiError(
  400,
  "Only one shipping rule can exist."
);

  }

  return prisma.shippingRule.create({

    data,

  });

};

export const getShippingRule = async () => {

const rule = await prisma.shippingRule.findFirst();

  if (!rule) {

    throw new ApiError(

      404,

      "Shipping rule not found."

    );

  }

  return rule;

};

export const updateShippingRule = async (data) => {

  const existingRule =
  await prisma.shippingRule.findFirst();

  if (!existingRule) {

    throw new ApiError(

      404,

      "Shipping rule not found."

    );

  }

  return prisma.shippingRule.update({

    where: {

      id: existingRule.id,

    },

    data,

  });

};