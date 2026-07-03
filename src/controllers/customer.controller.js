import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  getAllCustomers,
  getCustomerById,
  getCustomerStats,
  exportCustomers,
} from "../services/customer.service.js";

//////////////////////////////////////////////////////////////
// GET ALL CUSTOMERS
// GET /api/v1/customers
//////////////////////////////////////////////////////////////

export const getAllCustomersController = asyncHandler(async (req, res) => {

  const {
    page,
    limit,
    search,
    sort,
  } = req.query;

  const result = await getAllCustomers({
    page,
    limit,
    search,
    sort,
  });

  return res.status(200).json(

    new ApiResponse(
      200,
      "Customers fetched successfully.",
      result
    )

  );

});

//////////////////////////////////////////////////////////////
// GET CUSTOMER STATS
// GET /api/v1/customers/stats
//////////////////////////////////////////////////////////////

export const getCustomerStatsController = asyncHandler(async (req, res) => {

  const stats = await getCustomerStats();

  return res.status(200).json(

    new ApiResponse(
      200,
      "Customer statistics fetched successfully.",
      stats
    )

  );

});

//////////////////////////////////////////////////////////////
// GET CUSTOMER BY ID
// GET /api/v1/customers/:id
//////////////////////////////////////////////////////////////

export const getCustomerByIdController = asyncHandler(async (req, res) => {

  const customer = await getCustomerById(
    req.params.id
  );

  return res.status(200).json(

    new ApiResponse(
      200,
      "Customer fetched successfully.",
      customer
    )

  );

});

//////////////////////////////////////////////////////////////
// EXPORT CUSTOMERS
// GET /api/v1/customers/export
//////////////////////////////////////////////////////////////

export const exportCustomersController = asyncHandler(async (req, res) => {

  const customers = await exportCustomers();

  return res.status(200).json(

    new ApiResponse(
      200,
      "Customers exported successfully.",
      customers
    )

  );

});