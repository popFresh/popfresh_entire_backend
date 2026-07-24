import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  searchFeedbackOrdersSchema,
  submitFeedbackSchema,
} from "../validators/feedback.validator.js";

import {
  searchFeedbackOrders,
  submitFeedback,
} from "../services/feedback.service.js";

// ======================================================
// SEARCH ORDERS
// ======================================================

export const searchFeedbackOrdersController =
  asyncHandler(async (req, res) => {
    const { query } =
      searchFeedbackOrdersSchema.parse(req.query);

    const orders = await searchFeedbackOrders(query);

    return res.status(200).json(
      new ApiResponse(
        200,
        "Order(s) fetched successfully.",
        orders
      )
    );
  });

// ======================================================
// SUBMIT FEEDBACK
// ======================================================

export const submitFeedbackController =
  asyncHandler(async (req, res) => {
    const data =
      submitFeedbackSchema.parse(req.body);

    const feedback = await submitFeedback(data);

    return res.status(201).json(
      ApiResponse.created(
        "Feedback submitted successfully.",
        feedback
      )
    );
  });