import { SHIPMENT_STATUS_MAP } from "../constants/shipmentStatusMap.js";

export const mapShipmentStatus = (status) => {

    return SHIPMENT_STATUS_MAP[status] || null;

};