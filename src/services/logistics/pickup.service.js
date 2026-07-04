import { shiprocketClient } from "./shiprocketClient.js";

import { handleShiprocketError } from "../../utils/shiprocketError.js";

import { mapPickupResponse } from "../../utils/mappers/pickup.mapper.js";

/**
 * Schedule pickup for shipment(s).
 *
 * @param {Object} payload
 * @param {Array<number>} payload.shipment_id
 *
 * @returns {Object}
 */

export const schedulePickup = async (payload) => {

    try {

        const client = await shiprocketClient();

        const { data } = await client.post(
            "/courier/generate/pickup",
            payload
        );

        return mapPickupResponse(data);

    } catch (error) {

        handleShiprocketError(error);

    }

};