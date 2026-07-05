import prisma from "../../lib/prisma.js";

import ApiError from "../../utils/ApiError.js";

import { checkServiceability } from "./serviceability.service.js";

/**
 * Get available couriers for an order.
 *
 * @param {String} orderId
 * @returns {Object}
 */
export const getServiceabilityForOrder = async (
    orderId
) => {

    // =====================================================
    // Fetch Order
    // =====================================================

    const order = await prisma.order.findUnique({

        where: {
            id: orderId,
        },

        include: {

            payment: true,

            orderItems: {

                include: {

                    product: true,

                },

            },

        },

    });

    if (!order) {

        throw new ApiError(
            404,
            "Order not found."
        );

    }

    // =====================================================
    // Calculate Weight (KG)
    // =====================================================

    let totalWeightInGrams = 0;

    let maxLength = 0;

    let maxBreadth = 0;

    let totalHeight = 0;

    for (const item of order.orderItems) {

        const weight = parseFloat(
            item.product.weight?.toString() ?? "0"
        );

        const length = parseFloat(
            item.product.length?.toString() ?? "0"
        );

        const breadth = parseFloat(
            item.product.breadth?.toString() ?? "0"
        );

        const height = parseFloat(
            item.product.height?.toString() ?? "0"
        );

        totalWeightInGrams +=
            weight * item.quantity;

        maxLength = Math.max(
            maxLength,
            length
        );

        maxBreadth = Math.max(
            maxBreadth,
            breadth
        );

        totalHeight +=
            height * item.quantity;

    }

    // =====================================================
    // Shiprocket Params
    // =====================================================

    const params = {

        pickup_postcode:
            process.env.SHIPROCKET_PICKUP_PINCODE,

        delivery_postcode:
            order.shippingPincode,

        cod:
            order.payment?.status === "SUCCESS"
                ? 0
                : 1,

        weight:
            totalWeightInGrams / 1000,

        length:
            maxLength || 10,

        breadth:
            maxBreadth || 10,

        height:
            totalHeight || 5,

    };

    // =====================================================
    // Check Serviceability
    // =====================================================

    return await checkServiceability(params);

};