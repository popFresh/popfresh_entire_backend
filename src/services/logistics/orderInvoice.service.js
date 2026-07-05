import prisma from "../../lib/prisma.js";

import ApiError from "../../utils/ApiError.js";

import { generateInvoice } from "./invoice.service.js";

/**
 * Generate shipping invoice for an existing shipment.
 *
 * @param {String} orderId
 */

export const generateInvoiceForOrder = async (orderId) => {

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
            "Invoice can only be generated after AWB assignment."
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

    if (order.shipment.invoiceUrl) {
        throw new ApiError(
            400,
            "Invoice has already been generated."
        );
    }

    // =====================================================
    // Generate Invoice
    // =====================================================

    const invoice = await generateInvoice({
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
            invoiceUrl: invoice.invoiceUrl,

            rawResponse: invoice.rawResponse,
        },
    });

    return updatedShipment;

};