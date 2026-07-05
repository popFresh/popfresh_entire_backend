import prisma from "../../lib/prisma.js";

import ApiError from "../../utils/ApiError.js";

import { assignAwb } from "./awb.service.js";

/**
 * Assign AWB to an existing shipment.
 *
 * @param {String} orderId
 * @param {Number} courierCompanyId
 */

export const assignAwbForOrder = async (
    orderId,
    courierCompanyId
) => {

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

   // Allow AWB assignment as long as an AWB has not
// already been successfully assigned.

if (order.shipment.awbCode) {
    throw new ApiError(
        400,
        "AWB has already been assigned."
    );
}

   

    if (!order.shipment.shiprocketShipmentId) {
        throw new ApiError(
            400,
            "Shiprocket shipment ID not found."
        );
    }

    // =====================================================
    // Assign AWB via Shiprocket
    // =====================================================

    const awb = await assignAwb({
        shipment_id: Number(
            order.shipment.shiprocketShipmentId
        ),

        courier_id: Number(courierCompanyId),
    });

    // =====================================================
    // Update Shipment
    // =====================================================

    const updatedShipment = await prisma.shipment.update({
        where: {
            id: order.shipment.id,
        },

        data: {
            status: "AWB_ASSIGNED",

            awbCode: awb.awbCode,

            courierCompanyId: awb.courierCompanyId,

            courierName: awb.courierName,

            trackingUrl: awb.trackingUrl,

            shippingCharge: awb.shippingCharge,

            estimatedDeliveryDate:
                awb.estimatedDeliveryDate,

            rawResponse: awb.rawResponse,
        },
    });

    return updatedShipment;
};