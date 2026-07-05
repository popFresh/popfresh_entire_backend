import prisma from "../../lib/prisma.js";

import ApiError from "../../utils/ApiError.js";

import { schedulePickup } from "./pickup.service.js";

/**
 * Schedule pickup for an existing shipment.
 *
 * @param {String} orderId
 */

export const schedulePickupForOrder = async (orderId) => {

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

    if (order.shipment.status !== "AWB_ASSIGNED") {
        throw new ApiError(
            400,
            "Pickup can only be scheduled after AWB assignment."
        );
    }

    if (!order.shipment.awbCode) {
        throw new ApiError(
            400,
            "AWB has not been assigned yet."
        );
    }

    if (!order.shipment.shiprocketShipmentId) {
        throw new ApiError(
            400,
            "Shiprocket shipment ID not found."
        );
    }

    if (!order.shipment.labelUrl) {
        throw new ApiError(
            400,
            "Shipping label has not been generated yet."
        );
    }

    if (!order.shipment.invoiceUrl) {
        throw new ApiError(
            400,
            "Shipping invoice has not been generated yet."
        );
    }

    // if (!order.shipment.manifestUrl) {
    //     throw new ApiError(
    //         400,
    //         "Shipping manifest has not been generated yet."
    //     );
    // }

    if (order.shipment.pickupScheduled) {
        throw new ApiError(
            400,
            "Pickup has already been scheduled."
        );
    }

    // =====================================================
    // Schedule Pickup
    // =====================================================

    const pickup = await schedulePickup({
        shipment_id: [
            Number(order.shipment.shiprocketShipmentId),
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
            status: "PICKUP_SCHEDULED",

            pickupScheduled: pickup.pickupScheduled,

            pickupDate: pickup.pickupDate,

            rawResponse: pickup.rawResponse,
        },
    });

    return updatedShipment;

};