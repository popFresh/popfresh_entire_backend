export const mapOrderStatus = (shipmentStatus) => {

    switch (shipmentStatus) {

        case "PICKED_UP":
        case "IN_TRANSIT":
        case "OUT_FOR_DELIVERY":
            return "SHIPPED";

        case "DELIVERED":
            return "DELIVERED";

        case "CANCELLED":
            return "CANCELLED";

        case "RTO":
            return "RETURNED";

        default:
            return null;

    }

};