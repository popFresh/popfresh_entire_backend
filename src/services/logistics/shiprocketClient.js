import axios from "axios";
import { handleShiprocketError } from "../../utils/shiprocketError.js";
const BASE_URL = process.env.SHIPROCKET_BASE_URL;

let token = null;
let tokenExpiry = null;

// Create ONE axios instance
const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

/**
 * Authenticate with Shiprocket
 */
const login = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD,
        });

        token = response.data.token;
        const TOKEN_VALIDITY_HOURS = 240;

        // Token expires in 240 hours (10 days)
        // tokenExpiry = Date.now() + 240 * 60 * 60 * 1000;
        tokenExpiry =
    Date.now() + TOKEN_VALIDITY_HOURS * 60 * 60 * 1000;

        // Update axios instance header
        client.defaults.headers.common.Authorization = `Bearer ${token}`;

        console.log("✅ Shiprocket authenticated");

        return token;
    } catch (error) {
    handleShiprocketError(error);
}
};

/**
 * Returns a valid token
 */
const ensureAuthenticated = async () => {
    const fiveMinutes = 5 * 60 * 1000;

    if (
        token &&
        tokenExpiry &&
        Date.now() < tokenExpiry - fiveMinutes
    ) {
        return;
    }

    await login();
};

/**
 * Returns authenticated axios client
 */
export const shiprocketClient = async () => {
    await ensureAuthenticated();
    return client;
};

// import axios from "axios";

// const BASE_URL = process.env.SHIPROCKET_BASE_URL;

// let token = null;
// let tokenExpiry = null;

// /**
//  * Generate a fresh Shiprocket token
//  */
// const login = async () => {
//     try {
//         const response = await axios.post(
//             `${BASE_URL}/auth/login`,
//             {
//                 email: process.env.SHIPROCKET_EMAIL,
//                 password: process.env.SHIPROCKET_PASSWORD,
//             }
//         );

//         token = response.data.token;

//         // Token valid for 240 hours (10 days)
//         tokenExpiry = Date.now() + 240 * 60 * 60 * 1000;

//         console.log("✅ Shiprocket authenticated");

//         return token;
//     } catch (error) {
//         console.error(
//             "❌ Shiprocket Login Failed:",
//             error.response?.data || error.message
//         );

//         throw error;
//     }
// };

// /**
//  * Returns a valid token
//  */
// const getToken = async () => {
//     if (
//         token &&
//         tokenExpiry &&
//         Date.now() < tokenExpiry - 5 * 60 * 1000 // Refresh 5 mins before expiry
//     ) {
//         return token;
//     }

//     return await login();
// };

// /**
//  * Returns an authenticated axios instance
//  */
// export const shiprocketClient = async () => {
//     const authToken = await getToken();

//     return axios.create({
//         baseURL: BASE_URL,
//         headers: {
//             Authorization: `Bearer ${authToken}`,
//             "Content-Type": "application/json",
//         },
//     });
// };