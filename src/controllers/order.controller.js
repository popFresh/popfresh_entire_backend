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
import { assignAwbForOrder } from "../services/logistics/orderAwb.service.js";
import { generateLabelForOrder } from "../services/logistics/orderLabel.service.js";
import { generateInvoiceForOrder } from "../services/logistics/orderInvoice.service.js";
import { generateManifestForOrder } from "../services/logistics/orderManifest.service.js";
import { schedulePickupForOrder } from "../services/logistics/orderPickup.service.js";
import { getTrackingForOrder } from "../services/logistics/orderTracking.service.js";
import { cancelShipmentForOrder } from "../services/logistics/orderCancelShipment.service.js";
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


// ==============================================
// CREATE SHIPMENT (SHIPROCKET)
// POST /api/v1/orders/:id/create-shipment
// ==============================================

export const createShipmentController = asyncHandler(async (req, res) => {

  const shipment = await createShipmentForOrder(req.params.id);

  return res.status(201).json(

    new ApiResponse(
      201,
      "Shipment created successfully.",
      shipment
    )

  );

});// ==============================================
// ASSIGN AWB (SHIPROCKET)
// POST /api/v1/orders/:id/assign-awb
// ==============================================

export const assignAwbController = asyncHandler(async (req, res) => {

    const { courierCompanyId } = req.body;

    const shipment = await assignAwbForOrder(
        req.params.id,
        courierCompanyId
    );

    return res.status(200).json(

        new ApiResponse(
            200,
            "AWB assigned successfully.",
            shipment
        )

    );

});


// ==============================================
// GENERATE SHIPPING LABEL (SHIPROCKET)
// POST /api/v1/orders/:id/generate-label
// ==============================================

export const generateLabelController = asyncHandler(async (req, res) => {

    const shipment = await generateLabelForOrder(
        req.params.id
    );

    return res.status(200).json(

        new ApiResponse(
            200,
            "Shipping label generated successfully.",
            shipment
        )

    );

});

// ==============================================
// GENERATE SHIPPING INVOICE (SHIPROCKET)
// POST /api/v1/orders/:id/generate-invoice
// ==============================================

export const generateInvoiceController = asyncHandler(async (req, res) => {

    const shipment = await generateInvoiceForOrder(
        req.params.id
    );

    return res.status(200).json(

        new ApiResponse(
            200,
            "Shipping invoice generated successfully.",
            shipment
        )

    );

});

// ==============================================
// GENERATE SHIPPING MANIFEST (SHIPROCKET)
// POST /api/v1/orders/:id/generate-manifest
// ==============================================

export const generateManifestController = asyncHandler(async (req, res) => {

    const shipment = await generateManifestForOrder(
        req.params.id
    );

    return res.status(200).json(

        new ApiResponse(
            200,
            "Shipping manifest generated successfully.",
            shipment
        )

    );

});

// ==============================================
// SCHEDULE PICKUP (SHIPROCKET)
// POST /api/v1/orders/:id/schedule-pickup
// ==============================================

export const schedulePickupController = asyncHandler(async (req, res) => {

    const shipment = await schedulePickupForOrder(
        req.params.id
    );

    return res.status(200).json(

        new ApiResponse(
            200,
            "Pickup scheduled successfully.",
            shipment
        )

    );

});

// ==============================================
// GET SHIPMENT TRACKING (SHIPROCKET)
// GET /api/v1/orders/:id/tracking
// ==============================================

export const getTrackingController = asyncHandler(async (req, res) => {

    const tracking = await getTrackingForOrder(
        req.params.id
    );

    return res.status(200).json(

        new ApiResponse(
            200,
            "Shipment tracking fetched successfully.",
            tracking
        )

    );

});


// ==============================================
// CANCEL SHIPMENT (SHIPROCKET)
// POST /api/v1/orders/:id/cancel-shipment
// ==============================================

export const cancelShipmentController = asyncHandler(async (req, res) => {

    const shipment = await cancelShipmentForOrder(
        req.params.id
    );

    return res.status(200).json(

        new ApiResponse(
            200,
            "Shipment cancelled successfully.",
            shipment
        )

    );

});