import { shiprocketClient } from "./shiprocketClient.js";
import { handleShiprocketError } from "../../utils/shiprocketError.js";
import { mapShippingEstimate } from "../../utils/mappers/shiprocket.mapper.js";

/**
 * Check courier serviceability using Shiprocket.
 *
 * @param {Object} params
 * @returns {Object}
 */
export const checkServiceability = async (params) => {
    try {
        const client = await shiprocketClient();

        const { data } = await client.get("/courier/serviceability", {
            params,
        });

        return mapShippingEstimate(data);
    } catch (error) {
        handleShiprocketError(error);
    }
};

// export const checkServiceability = async ({
//     pickup_postcode,
//     delivery_postcode,
//     weight,
//     cod = 0,
//     length,
//     breadth,
//     height,
//     declared_value,
// }) => {
//     try {
//         const client = await shiprocketClient();

//         const { data } = await client.get("/courier/serviceability", {
//             params: {
//                 pickup_postcode,
//                 delivery_postcode,
//                 weight,
//                 cod,
//                 length,
//                 breadth,
//                 height,
//                 declared_value,
//             },
//         });

//         return data;
//     } catch (error) {
//         handleShiprocketError(error);
//     }
// };