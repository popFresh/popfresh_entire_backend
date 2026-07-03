import { shiprocketClient } from "./shiprocketClient.js";
import { handleShiprocketError } from "../../utils/shiprocketError.js";
import { mapShipment } from "../../utils/mappers/shipment.mapper.js";


/**
 * Create a shipment in Shiprocket.
 *
 * @param {Object} shipmentData
 * @returns {Object} Raw Shiprocket response
 */
export const createShipment = async (shipmentData) => {
    try {
        const client = await shiprocketClient();

        const { data } = await client.post(
            "/orders/create/adhoc",
            shipmentData
        );

        return mapShipment(data);
    } catch (error) {
        handleShiprocketError(error);
    }
};