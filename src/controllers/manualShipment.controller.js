import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { 
    createManualShipment,
    markManualShipmentOutForDelivery,
    markManualShipmentDelivered
 } from "../services/manualShipment.service.js";

import { 
    createManualShipmentSchema,
    updateManualShipmentStatusSchema,
    markManualShipmentDeliveredSchema
} from "../validators/manualShipment.validator.js";

// =====================================================
// CREATE MANUAL SHIPMENT
// POST /api/v1/orders/:id/manual-shipment
// =====================================================

export const createManualShipmentController = asyncHandler(
  async (req, res) => {

    const validatedData =
      createManualShipmentSchema.parse(req.body);

    const shipment = await createManualShipment(
      req.params.id,
      validatedData
    );

    return res.status(201).json(

      new ApiResponse(
        201,
        "Manual shipment created successfully.",
        shipment
      )

    );

  }
);


export const markManualShipmentOutForDeliveryController =
  asyncHandler(async (req, res) => {

    const validatedData =
      updateManualShipmentStatusSchema.parse(
        req.body
      );

    const shipment =
      await markManualShipmentOutForDelivery(
        req.params.id,
        validatedData
      );

    return res.status(200).json(

      new ApiResponse(
        200,
        "Manual shipment marked as Out For Delivery.",
        shipment
      )

    );

  });


  export const markManualShipmentDeliveredController =
  asyncHandler(async (req, res) => {

    const validatedData =
      markManualShipmentDeliveredSchema.parse(
        req.body
      );

    const shipment =
      await markManualShipmentDelivered(
        req.params.id,
        validatedData
      );

    return res.status(200).json(

      new ApiResponse(
        200,
        "Manual shipment marked as Delivered.",
        shipment
      )

    );

  });

  