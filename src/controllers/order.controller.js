import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  getAllOrders,
  getOrderById,
  getOrderStats,
  updateOrderStatus,
} from "../services/order.service.js";

import {
  updateOrderStatusSchema,
} from "../validators/order.validator.js";

import { createShipmentForOrder } from "../services/logistics/orderShipment.service.js";
// ==============================================
// GET ALL ORDERS
// GET /api/v1/orders
// ==============================================

export const getAllOrdersController = asyncHandler(async (req, res) => {

  const {
    page,
    limit,
    search,
    status,
    sort,
  } = req.query;

  const result = await getAllOrders({
    page,
    limit,
    search,
    status,
    sort,
  });

  return res.status(200).json(

    new ApiResponse(
      200,
      "Orders fetched successfully.",
      result
    )

  );

});

// ==============================================
// GET ORDER STATS
// GET /api/v1/orders/stats
// ==============================================

export const getOrderStatsController = asyncHandler(async (req, res) => {

  const stats = await getOrderStats();

  return res.status(200).json(

    new ApiResponse(
      200,
      "Order statistics fetched successfully.",
      stats
    )

  );

});

// ==============================================
// GET ORDER BY ID
// GET /api/v1/orders/:id
// ==============================================

export const getOrderByIdController = asyncHandler(async (req, res) => {

  const order = await getOrderById(req.params.id);

  return res.status(200).json(

    new ApiResponse(
      200,
      "Order fetched successfully.",
      order
    )

  );

});

// ==============================================
// UPDATE ORDER STATUS
// PATCH /api/v1/orders/:id/status
// ==============================================

// ==============================================
// UPDATE ORDER STATUS
// PATCH /api/v1/orders/:id/status
// ==============================================

export const updateOrderStatusController = asyncHandler(async (req, res) => {

  const validatedData = updateOrderStatusSchema.parse(req.body);

  const updatedOrder = await updateOrderStatus(

    req.params.id,

    validatedData

  );

  return res.status(200).json(

    new ApiResponse(
      200,
      "Order status updated successfully.",
      updatedOrder
    )

  );

});