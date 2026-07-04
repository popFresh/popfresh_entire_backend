import { shiprocketClient } from "./shiprocketClient.js";

import { handleShiprocketError } from "../../utils/shiprocketError.js";

import { mapTrackingResponse } from "../../utils/mappers/tracking.mapper.js";

/**
 * Fetch shipment tracking from Shiprocket.
 *
 * @param {Number} shipmentId
 *
 * @returns {Object}
 */

export const getShipmentTracking = async (shipmentId) => {

    try {

        const client = await shiprocketClient();

        const { data } = await client.get(
            `/courier/track/shipment/${shipmentId}`
        );

        return mapTrackingResponse(data);

    } catch (error) {

        handleShiprocketError(error);

    }

};