import prisma from "../../lib/prisma.js";

import ApiError from "../../utils/ApiError.js";

import { generateLabel } from "./label.service.js";

/**
 * Generate shipping label for an existing shipment.
 *
 * @param {String} orderId
 */

export const generateLabelForOrder = async (orderId) => {

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
            "Shipping label can only be generated after AWB assignment."
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

    if (order.shipment.labelUrl) {
        throw new ApiError(
            400,
            "Shipping label has already been generated."
        );
    }

    // =====================================================
    // Generate Label
    // =====================================================

    const label = await generateLabel({
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
            labelUrl: label.labelUrl,

            rawResponse: label.rawResponse,
        },
    });

    return updatedShipment;

};