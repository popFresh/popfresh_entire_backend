import asyncHandler from "../middlewares/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import {createShippingRule, getShippingRule, updateShippingRule, } from "../services/shippingRule.service.js";

import {

  createShippingRuleSchema,
  updateShippingRuleSchema

} from "../validators/shippingRule.validator.js";


export const createShippingRuleController =
asyncHandler(async (req, res) => {

  const validatedData =
    createShippingRuleSchema.parse(req.body);

  const rule =
    await createShippingRule(validatedData);

  return res.status(201).json(

    new ApiResponse(

      201,

      "Shipping rule created successfully.",

      rule

    )

  );

});


export const getShippingRuleController =
asyncHandler(async (req, res) => {

  const rule =
    await getShippingRule();

  return res.status(200).json(

    new ApiResponse(

      200,

      "Shipping rule fetched successfully.",

      rule

    )

  );

});

export const updateShippingRuleController =
asyncHandler(async (req, res) => {

  const validatedData =
    updateShippingRuleSchema.parse(req.body);

  const rule =
    await updateShippingRule(validatedData);

  return res.status(200).json(

    new ApiResponse(

      200,

      "Shipping rule updated successfully.",

      rule

    )

  );

});