import { shiprocketClient } from "./shiprocketClient.js";

import { handleShiprocketError } from "../../utils/shiprocketError.js";

import { mapLabelResponse } from "../../utils/mappers/label.mapper.js";

/**
 * Generate shipping label.
 *
 * @param {Object} payload
 * @param {Array<number>} payload.shipment_id
 *
 * @returns {Object}
 */

export const generateLabel = async (payload) => {

    try {

        const client = await shiprocketClient();

        const { data } = await client.post(
            "/courier/generate/label",
            payload
        );

        return mapLabelResponse(data);

    } catch (error) {

        handleShiprocketError(error);

    }

};