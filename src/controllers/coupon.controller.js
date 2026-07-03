import asyncHandler from "../middlewares/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import {

  createCouponSchema,
  updateCouponSchema,
  applyCouponSchema,
  

} from "../validators/coupon.validator.js";

import {

  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  applyCoupon

} from "../services/coupon.service.js";

export const createCouponController =
asyncHandler(async (req, res) => {

  const validatedData =
    createCouponSchema.parse(req.body);

  const coupon =
    await createCoupon(validatedData);

  return res.status(201).json(

    new ApiResponse(

      201,

      "Coupon created successfully.",

      coupon

    )

  );

});

export const getCouponsController =
asyncHandler(async (req, res) => {

  const coupons =
    await getCoupons();

  return res.status(200).json(

    new ApiResponse(

      200,

      "Coupons fetched successfully.",

      coupons

    )

  );

});

export const getCouponByIdController =
asyncHandler(async (req, res) => {

  const coupon =
    await getCouponById(req.params.id);

  return res.status(200).json(

    new ApiResponse(

      200,

      "Coupon fetched successfully.",

      coupon

    )

  );

});

export const updateCouponController =
asyncHandler(async (req, res) => {

  const validatedData =
    updateCouponSchema.parse(req.body);

  const coupon =
    await updateCoupon(

      req.params.id,

      validatedData

    );

  return res.status(200).json(

    new ApiResponse(

      200,

      "Coupon updated successfully.",

      coupon

    )

  );

});

export const applyCouponController =
asyncHandler(async (req, res) => {

  const {

  code,

  cartItems,

} = applyCouponSchema.parse(req.body);

  const result =
  await applyCoupon(

    cartItems,

    code

  );

  return res.status(200).json(

    new ApiResponse(

      200,

      "Coupon applied successfully.",

      result

    )

  );

});

