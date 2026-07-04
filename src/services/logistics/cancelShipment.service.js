import { shiprocketClient } from "./shiprocketClient.js";

import { handleShiprocketError } from "../../utils/shiprocketError.js";

import { mapCancelShipmentResponse } from "../../utils/mappers/cancelShipment.mapper.js";

/**
 * Cancel shipment in Shiprocket.
 *
 * @param {Object} payload
 * @param {Array<number>} payload.ids
 *
 * @returns {Object}
 */

export const cancelShipment = async (payload) => {

    try {

        const client = await shiprocketClient();

        const { data } = await client.post(
            "/orders/cancel",
            payload
        );

        return mapCancelShipmentResponse(data);

    } catch (error) {

        handleShiprocketError(error);

    }

};