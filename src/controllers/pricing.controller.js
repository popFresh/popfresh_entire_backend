import asyncHandler from "../middlewares/asyncHandler.js";
import { calculatePricing } from "../services/pricing.service.js";

export const calculatePricingController =
  asyncHandler(async (req, res) => {

    const pricing =
      await calculatePricing(req.body);

    res.status(200).json({

      success: true,

      statusCode: 200,

      message:
        "Pricing calculated successfully.",

      data: pricing,

    });

  });