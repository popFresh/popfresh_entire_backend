import prisma from "../../lib/prisma.js";

import ApiError from "../../utils/ApiError.js";

import { generateManifest } from "./manifest.service.js";

export const generateManifestForOrder = async (orderId) => {

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

    if (!order) {
        throw new ApiError(
            404,
            "Order not found."
        );
    }

    if (!order.shipment) {
        throw new ApiError(
            400,
            "Shipment has not been created yet."
        );
    }

    if (order.shipment.status !== "AWB_ASSIGNED") {
        throw new ApiError(
            400,
            "Manifest can only be generated after AWB assignment."
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

    if (order.shipment.manifestUrl) {
        throw new ApiError(
            400,
            "Manifest has already been generated."
        );
    }

    // =====================================================
    // Generate Manifest
    // =====================================================

    const manifest = await generateManifest({
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
            manifestUrl: manifest.manifestUrl,

            rawResponse: manifest.rawResponse,
        },
    });

    return updatedShipment;

};