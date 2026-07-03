import { verifyConnection } from "../services/logistics/auth.service.js";
import { checkServiceability } from "../services/logistics/serviceability.service.js";
import { createShipment } from "../services/logistics/shipment.service.js";


export const testShiprocketConnection = async (req, res) => {
    try {
        const result = await verifyConnection();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




export const getServiceability = async (req, res) => {
    try {
        const result = await checkServiceability(req.query);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            details: error.details,
        });
    }
};


export const createShipmentController = async (req, res) => {
    try {
        const result = await createShipment(req.body);

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            details: error.details,
        });
    }
};