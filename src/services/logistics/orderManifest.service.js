import prisma from "../../lib/prisma.js";

import ApiError from "../../utils/ApiError.js";

import { generateManifest } from "./manifest.service.js";
import { printManifest } from "./printManifest.service.js";

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
//---------CHECK this 
    // if (order.shipment.status !== "AWB_ASSIGNED") {
    //     throw new ApiError(
    //         400,
    //         "Manifest can only be generated after AWB assignment."
    //     );
    // }


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

    // const manifest = await generateManifest({
    //     shipment_id: [
    //         Number(order.shipment.shiprocketShipmentId),
    //     ],
    // });

//     const manifest = await printManifest({
//     order_ids: [
//         Number(order.shipment.shiprocketOrderId),
//     ],
// });

///----trying better approach
// const manifest = await printManifest({
//     order_ids: [
//         Number(order.shipment.shiprocketOrderId),
//     ],
// });

let manifest;

try {

    manifest = await generateManifest({
        shipment_id: [
            Number(order.shipment.shiprocketShipmentId),
        ],
    });

} catch (error) {

    console.log(
        "Generate Manifest failed, trying Print Manifest..."
    );

    manifest = await printManifest({
        order_ids: [
            Number(order.shipment.shiprocketOrderId),
        ],
    });

}

console.log("Manifest Object:");
console.log(manifest);
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

console.log("Updated Shipment:");
console.log(updatedShipment);

return updatedShipment;
};