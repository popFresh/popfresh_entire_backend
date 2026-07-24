import { shiprocketClient } from "./shiprocketClient.js";
import { handleShiprocketError } from "../../utils/shiprocketError.js";
import { mapShipment } from "../../utils/mappers/shipment.mapper.js";
import techService from "../tech.service.js";

/**
 * Create a shipment in Shiprocket.
 *
 * @param {Object} shipmentData
 * @returns {Object} Mapped shipment response
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
    await techService.error({
      category: "SHIPROCKET",
      title: "Shipment Creation Failed",
      message: error.message,
      metadata: {
        provider: "Shiprocket",
        endpoint: "/orders/create/adhoc",
        shipmentData,
        response: error.response?.data || null,
        statusCode: error.response?.status || null,
        stack: error.stack,
      },
    });

    handleShiprocketError(error);
  }
};





// worked but added logger in the top version 
// import { shiprocketClient } from "./shiprocketClient.js";
// import { handleShiprocketError } from "../../utils/shiprocketError.js";
// import { mapShipment } from "../../utils/mappers/shipment.mapper.js";


// /**
//  * Create a shipment in Shiprocket.
//  *
//  * @param {Object} shipmentData
//  * @returns {Object} Raw Shiprocket response
//  */
// export const createShipment = async (shipmentData) => {
//     try {
//         const client = await shiprocketClient();

//         const { data } = await client.post(
//             "/orders/create/adhoc",
//             shipmentData
//         );

//         return mapShipment(data);
//     } catch (error) {
//         handleShiprocketError(error);
//     }
// };