import prisma from "../../lib/prisma.js";

import ApiError from "../../utils/ApiError.js";

import { cancelShipment } from "./cancelShipment.service.js";

/**
 * Cancel an existing shipment.
 *
 * @param {String} orderId
 */

export const cancelShipmentForOrder = async (orderId) => {

    // =====================================================
    // Fetch Order
    // =====================================================

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },

        include: {
            shipment: true,
        },
    });

    // =====================================================
    // Order Validation
    // =====================================================

    if (!order) {
        throw new ApiError(
            404,
            "Order not found."
        );
    }

    // =====================================================
    // Shipment Validation
    // =====================================================

    if (!order.shipment) {
        throw new ApiError(
            400,
            "Shipment has not been created yet."
        );
    }

    if (!order.shipment.shiprocketOrderId) {
        throw new ApiError(
            400,
            "Shiprocket order ID not found."
        );
    }

    if (order.shipment.status === "CANCELLED") {
        throw new ApiError(
            400,
            "Shipment has already been cancelled."
        );
    }

    // =====================================================
    // Cancel Shipment
    // =====================================================

    const result = await cancelShipment({
        ids: [
            Number(order.shipment.shiprocketOrderId),
        ],
    });

    // =====================================================
    // Update Shipment
    // =====================================================

    const updatedShipment = await prisma.shipment.update({
        where: {
            id: order.shipment.id,
        },

        data: {
            status: "CANCELLED",

            rawResponse: result.rawResponse,
        },
    });

    // =====================================================
    // Update Order
    // =====================================================

    await prisma.order.update({
        where: {
            id: order.id,
        },

        data: {
            status: "CANCELLED",

            cancelledAt: new Date(),
        },
    });

    await prisma.orderStatusHistory.create({
  data: {
    orderId: order.id,
    status: "CANCELLED",
    note: "Shipment cancelled.",
  },
});

    return updatedShipment;

};