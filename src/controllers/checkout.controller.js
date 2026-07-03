import asyncHandler from "../middlewares/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { createRazorpayOrderSchema } from "../validators/checkout.validator.js";

import { createRazorpayOrder,verifyPayment } from "../services/checkout.service.js";

export const createRazorpayOrderController = asyncHandler(

  async (req, res) => {

    const validatedData =
      createRazorpayOrderSchema.parse(req.body);

    const order =
      await createRazorpayOrder(validatedData);

    return res.status(201).json(

      new ApiResponse(

        201,

        "Razorpay Order Created Successfully.",

        order

      )

    );

  }

);


export const verifyPaymentController =
asyncHandler(async (req, res) => {

  const order = await verifyPayment(req.body);

  return res.status(200).json(

    new ApiResponse(

      200,

      "Payment verified successfully.",

      order

    )

  );

});