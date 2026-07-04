import express from "express";
import { 
    testShiprocketConnection,
    getServiceability,
    createShipmentController 
} from "../../../controllers/logistics/logistics.controller.js";

const router = express.Router();

router.get("/test-connection", testShiprocketConnection);
router.get("/serviceability", getServiceability);
// Temporary testing endpoint
router.post("/shipment", createShipmentController);
export default router;
