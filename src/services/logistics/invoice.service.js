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
            "/courier/generate/invoice",
            payload
        );

        return mapInvoiceResponse(data);

    } catch (error) {

        handleShiprocketError(error);

    }

};