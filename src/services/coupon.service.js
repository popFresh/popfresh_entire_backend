import { calculatePricing } from "./pricing.service.js";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

export const createCoupon = async (data) => {

  const existingCoupon =
    await prisma.coupon.findUnique({

      where: {

        code: data.code,

      },

    });

  if (existingCoupon) {

    throw new ApiError(

      400,

      "Coupon already exists."

    );

  }

  return prisma.coupon.create({

    data,

  });

};



export const getCoupons = async () => {

  return prisma.coupon.findMany({

    orderBy: {

      createdAt: "desc",

    },

  });

};

export const getCouponById = async (id) => {

  const coupon =
    await prisma.coupon.findUnique({

      where: {

        id,

      },

    });

  if (!coupon) {

    throw new ApiError(

      404,

      "Coupon not found."

    );

  }

  return coupon;

};

export const updateCoupon = async (
  id,
  data
) => {

  const coupon =
    await prisma.coupon.findUnique({

      where: {

        id,

      },

    });

  if (!coupon) {

    throw new ApiError(

      404,

      "Coupon not found."

    );

  }

  return prisma.coupon.update({

    where: {

      id,

    },

    data,

  });

};

export const applyCoupon = async (

  cartItems,

  couponCode,

) => {

  return calculatePricing({

    cartItems,

    couponCode,

  });

};