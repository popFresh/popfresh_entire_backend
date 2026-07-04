import { shiprocketClient } from "./shiprocketClient.js";

import { handleShiprocketError } from "../../utils/shiprocketError.js";

import { mapManifestResponse } from "../../utils/mappers/manifest.mapper.js";

/**
 * Generate shipping manifest.
 *
 * @param {Object} payload
 * @param {Array<number>} payload.shipment_id
 */

export const generateManifest = async (payload) => {

    try {

        const client = await shiprocketClient();

        const { data } = await client.post(
            "/courier/generate/manifest",
            payload
        );

        return mapManifestResponse(data);

    } catch (error) {

        handleShiprocketError(error);

    }

};