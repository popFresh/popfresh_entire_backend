import { shiprocketClient } from "./shiprocketClient.js";

import { handleShiprocketError } from "../../utils/shiprocketError.js";

import { mapAwbResponse } from "../../utils/mappers/awb.mapper.js";

/**
 * Assign AWB to an existing Shiprocket shipment.
 *
 * @param {Object} payload
 * @param {number} payload.shipment_id
 * @param {number} payload.courier_id
 *
 * @returns {Object}
 */

export const assignAwb = async (payload) => {
    try {
        const client = await shiprocketClient();

        const { data } = await client.post(
            "/courier/assign/awb",
            payload
        );

        return mapAwbResponse(data);
    } catch (error) {

    // Already one of our application errors
    if (error.statusCode) {
        throw error;
    }

    // Axios / Shiprocket HTTP error
    handleShiprocketError(error);

}
};