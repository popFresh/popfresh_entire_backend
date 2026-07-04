import prisma from "../../lib/prisma.js";

import ApiError from "../../utils/ApiError.js";

import { getShipmentTracking } from "./tracking.service.js";

import { mapShipmentStatus } from "../../utils/mapShipmentStatus.js";

import { mapOrderStatus } from "../../utils/mapOrderStatus.js";

export const getTrackingForOrder = async (orderId) => {

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
    // Validation
    // =====================================================

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

    if (!order.shipment.shiprocketShipmentId) {
        throw new ApiError(
            400,
            "Shiprocket shipment ID not found."
        );
    }

    // =====================================================
    // Fetch Tracking from Shiprocket
    // =====================================================

    const tracking = await getShipmentTracking(
        Number(order.shipment.shiprocketShipmentId)
    );

    const shipmentStatus = mapShipmentStatus(
    tracking.currentStatus
);

const orderStatus = mapOrderStatus(
    shipmentStatus
);

    // =====================================================
    // Save Tracking History
    // =====================================================

    for (const event of tracking.history) {

    // ==========================================
    // Map Shiprocket Status
    // ==========================================

    const mappedStatus = mapShipmentStatus(
        event.status
    );

    // Skip unknown statuses
    if (!mappedStatus) {
        continue;
    }

    const exists =
        await prisma.shipmentTracking.findFirst({

            where: {

                shipmentId: order.shipment.id,

                status: mappedStatus,

                eventTime: event.eventTime,

            },

        });

    if (!exists) {

        await prisma.shipmentTracking.create({

            data: {

                shipmentId: order.shipment.id,

                status: mappedStatus,

                location: event.location,

                remarks: event.remarks,

                eventTime: event.eventTime,

            },

        });

    }

}

    // =====================================================
    // Update Shipment
    // =====================================================

    await prisma.shipment.update({

    where: {
        id: order.shipment.id,
    },

    data: {

        status:
            shipmentStatus ?? order.shipment.status,

        trackingUrl:
            tracking.trackingUrl,

        rawResponse:
            tracking.rawResponse,

    },

});

if (orderStatus) {

    await prisma.order.update({

        where: {
            id: order.id,
        },

        data: {
            status: orderStatus,
        },

    });

}

    // =====================================================
    // Return Latest Tracking
    // =====================================================

    const updatedShipment =
        await prisma.shipment.findUnique({

            where: {
                id: order.shipment.id,
            },

            include: {

                trackingHistory: {

                    orderBy: {
                        eventTime: "asc",
                    },

                },

            },

        });

    return {

        shipment: updatedShipment,

        tracking,

    };

};