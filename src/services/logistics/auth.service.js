import { shiprocketClient } from "./shiprocketClient.js";
import { handleShiprocketError } from "../../utils/shiprocketError.js";

export const verifyConnection = async () => {
    try {
        await shiprocketClient();

        return {
            success: true,
            message: "Shiprocket connected successfully."
        };
    } catch (error) {
        handleShiprocketError(error);
    
    }
};