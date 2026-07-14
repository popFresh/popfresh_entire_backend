import { trackOrderSchema } from "../validators/orderTracking.validator.js";
import { trackOrder } from "../services/orderTracking.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const trackOrderController = asyncHandler(async (req, res) => {
  const { query } = trackOrderSchema.parse(req.query);

  const result = await trackOrder(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Order(s) fetched successfully.",
      result
    )
  );
});