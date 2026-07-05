import { shiprocketClient } from "./shiprocketClient.js";
import { handleShiprocketError } from "../../utils/shiprocketError.js";
import { mapPrintManifestResponse } from "../../utils/mappers/printManifest.mapper.js";

export const printManifest = async (payload) => {

    try {

        const client = await shiprocketClient();

        const { data } = await client.post(
            "/manifests/print",
            payload
        );

        console.log(
            "Print Manifest Response:",
            JSON.stringify(data, null, 2)
        );

        return mapPrintManifestResponse(data);

    } catch (error) {

        console.log(
            "Print Manifest Error:",
            JSON.stringify(error.response?.data, null, 2)
        );

        handleShiprocketError(error);

    }

};

// import { shiprocketClient } from "./shiprocketClient.js";
// import { handleShiprocketError } from "../../utils/shiprocketError.js";

// export const printManifest = async (payload) => {
//     try {
//         const client = await shiprocketClient();

//         const { data } = await client.post(
//             "/manifests/print",
//             payload
//         );

//         console.log(
//             "Print Manifest Response:",
//             JSON.stringify(data, null, 2)
//         );

//         return data;

//     } catch (error) {

//         console.log(
//             "Print Manifest Error:",
//             JSON.stringify(error.response?.data, null, 2)
//         );

//         handleShiprocketError(error);
//     }
// };

// import { shiprocketClient } from "./shiprocketClient.js";
// import { handleShiprocketError } from "../../utils/shiprocketError.js";

// export const printManifest = async (payload) => {
//     try {
//         const client = await shiprocketClient();

//         const { data } = await client.post(
//             "/manifests/print",
//             payload
//         );

//         return data;
//     } catch (error) {
//         handleShiprocketError(error);
//     }
// };