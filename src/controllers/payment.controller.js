import asyncHandler from "../middlewares/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";

import {
  getPaymentStats,
  getAllPayments,
  getPaymentById,
} from "../services/payment.service.js";

//////////////////////////////////////////////////////////////
// GET PAYMENT STATS
//////////////////////////////////////////////////////////////

export const getStats = asyncHandler(async (req, res) => {

  const stats = await getPaymentStats();

  return res.status(200).json(

    new ApiResponse(
  200,
  "Payment statistics fetched successfully.",
  stats
)

  );

});

//////////////////////////////////////////////////////////////
// GET ALL PAYMENTS
//////////////////////////////////////////////////////////////

export const getPayments = asyncHandler(async (req, res) => {

  const {

    page,

    limit,

    search,

    status,

    sort,

  } = req.query;

  const payments = await getAllPayments({

    page,

    limit,

    search,

    status,

    sort,

  });

  return res.status(200).json(

   new ApiResponse(
  200,
  "Payments fetched successfully.",
  payments
)

  );

});

//////////////////////////////////////////////////////////////
// GET PAYMENT BY ID
//////////////////////////////////////////////////////////////

export const getPayment = asyncHandler(async (req, res) => {

  const payment = await getPaymentById(

    req.params.id

  );

  return res.status(200).json(

    new ApiResponse(
  200,
  "Payment fetched successfully.",
  payment
)

  );

});

//////////////////////////////////////////////////////////////
// DEFAULT EXPORT
//////////////////////////////////////////////////////////////

export default {

  getStats,

  getPayments,

  getPayment,

};