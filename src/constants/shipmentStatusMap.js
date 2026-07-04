export const SHIPMENT_STATUS_MAP = {

    // =====================================================
    // Shipment Created
    // =====================================================

    "NEW": "CREATED",

    "AWB Assigned": "AWB_ASSIGNED",

    "Pickup Scheduled": "PICKUP_SCHEDULED",

    "Pickup Generated": "PICKUP_SCHEDULED",

    "Pickup Queued": "PICKUP_SCHEDULED",

    // =====================================================
    // Shipment Movement
    // =====================================================

    "Picked Up": "PICKED_UP",

    "In Transit": "IN_TRANSIT",

    "Reached Destination Hub": "IN_TRANSIT",

    "Out For Delivery": "OUT_FOR_DELIVERY",

    // =====================================================
    // Final States
    // =====================================================

    "Delivered": "DELIVERED",

    "Cancelled": "CANCELLED",

    "RTO": "RTO",

    "RTO Delivered": "RTO",

};