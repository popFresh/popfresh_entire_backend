import { shiprocketClient } from "./shiprocketClient.js";
import { handleShiprocketError } from "../../utils/shiprocketError.js";
import { mapManifestResponse } from "../../utils/mappers/manifest.mapper.js";

export const generateManifest = async (payload) => {

    try {

        const client = await shiprocketClient();

        console.log(
    "Manifest Payload:",
    JSON.stringify(payload, null, 2)
)

        const { data } = await client.post(
            "/courier/generate/manifest",
            payload
        );

        console.log(
            "Shiprocket Manifest Response:",
            JSON.stringify(data, null, 2)
        );

        return mapManifestResponse(data);

    } catch (error) {
        console.log(
        "Manifest Error Response:",
        JSON.stringify(error.response?.data, null, 2)
    );
        if (error.statusCode) {
            throw error;
        }

        handleShiprocketError(error);

    }

};


// import { shiprocketClient } from "./shiprocketClient.js";

// import { handleShiprocketError } from "../../utils/shiprocketError.js";

// import { mapManifestResponse } from "../../utils/mappers/manifest.mapper.js";

// /**
//  * Generate shipping manifest.
//  *
//  * @param {Object} payload
//  * @param {Array<number>} payload.shipment_id
//  */

// export const generateManifest = async (payload) => {

//     try {

//         const client = await shiprocketClient();

//         const { data } = await client.post(
//             "/courier/generate/manifest",
//             payload
//         );

//         return mapManifestResponse(data);

//     } catch (error) {

//         handleShiprocketError(error);

//     }

// };