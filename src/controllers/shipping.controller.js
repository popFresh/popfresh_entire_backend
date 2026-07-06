import { getShippingDashboard } from "../services/shipping.service.js";

import asyncHandler from "../middlewares/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";

export const getShippingDashboardController =
    asyncHandler(async (req, res) => {

        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 10;

        const search =
            req.query.search || "";

        const status =
            req.query.status || "";

        const data =
            await getShippingDashboard({

                page,
                limit,
                search,
                status,

            });

        return res.status(200).json(

            new ApiResponse(
                200,
                "Shipping dashboard fetched successfully.",
                data
            )

        );

    });