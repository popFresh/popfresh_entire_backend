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
        const message = error.response?.data?.message;

if (
    message &&
    message.toLowerCase().includes("already in pickup queue")
) {
    // return {
    //     pickupScheduled: true,
    //     pickupDate: new Date(),
    //     rawResponse: error.response.data,
    // };

    return {

    pickupScheduled: true,

    pickupDate: new Date(),

    pickupToken: null,

    shiprocketStatus: 1,

    rawResponse: error.response.data,

};
}

handleShiprocketError(error);

        

    }

};