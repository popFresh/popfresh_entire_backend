import { shiprocketClient } from "./shiprocketClient.js";

import { handleShiprocketError } from "../../utils/shiprocketError.js";

import { mapInvoiceResponse } from "../../utils/mappers/invoice.mapper.js";

/**
 * Generate shipping invoice.
 *
 * @param {Object} payload
 * @param {Array<number>} payload.shipment_id
 *
 * @returns {Object}
 */

export const generateInvoice = async (payload) => {

    try {

        const client = await shiprocketClient();

        const { data } = await client.post(
            "/orders/print/invoice",
            payload
        );

        console.log(
    "Shiprocket Invoice Response:",
    JSON.stringify(data, null, 2)
);
        return mapInvoiceResponse(data);

    } catch (error) {
        
        if (error.statusCode) {
        throw error;
    }

        handleShiprocketError(error);

    }

};