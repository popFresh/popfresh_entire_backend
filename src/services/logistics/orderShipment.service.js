import prisma from "../../lib/prisma.js";

import { buildShipmentPayload } from "../../builder/shipmentPayload.builder.js";
import { createShipment } from "./shipment.service.js";

export const createShipmentForOrder = async (orderId) => {
    // =====================================================
    // Fetch Order
    // =====================================================

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            customer: true,

            payment: true,

            shipment: true,

            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    // =====================================================
    // Validation
    // =====================================================

    if (!order) {
        const error = new Error("Order not found.");
        error.statusCode = 404;
        throw error;
    }

    if (order.status !== "PACKED") {
        const error = new Error(
            "Only packed orders can be shipped."
        );
        error.statusCode = 400;
        throw error;
    }

    if (order.shipment) {
        const error = new Error(
            "Shipment already exists for this order."
        );
        error.statusCode = 400;
        throw error;
    }

    // =====================================================
    // Build Shiprocket Payload
    // =====================================================

    const payload = buildShipmentPayload(order);

    // =====================================================
    // Create Shipment in Shiprocket
    // =====================================================

    const shipment = await createShipment(payload);

    // =====================================================
    // Save Shipment in Database
    // =====================================================

    const savedShipment = await prisma.shipment.create({
        data: {
            orderId: order.id,

            provider: "SHIPROCKET",

            status: "CREATED",

            shiprocketOrderId:
                shipment.shiprocketOrderId?.toString(),

            shiprocketShipmentId:
                shipment.shiprocketShipmentId?.toString(),

            courierCompanyId:
                shipment.courierCompanyId,

            courierName:
                shipment.courierName,

            awbCode:
                shipment.awbCode,

            trackingUrl: null,
        },
    });

    return savedShipment;
};