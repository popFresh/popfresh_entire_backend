import ApiError from "../ApiError.js";

export const mapAwbResponse = (response) => {
    // =====================================================
    // Shiprocket AWB Assignment Failed
    // =====================================================

    if (response.awb_assign_status !== 1) {
        throw new ApiError(
            400,
            response.message || "Failed to assign AWB."
        );
    }

    // =====================================================
    // Success
    // =====================================================

    return {
        awbCode: response.response?.data?.awb_code || null,

        courierCompanyId:
            response.response?.data?.courier_id
                ? Number(response.response.data.courier_id)
                : null,

        courierName:
            response.response?.data?.courier_name || null,

        shipmentId:
            response.response?.data?.shipment_id || null,

        shiprocketOrderId:
            response.response?.data?.order_id || null,

        shippingCharge:
            response.response?.data?.freight_charge !== undefined
                ? Number(response.response.data.freight_charge)
                : null,

        estimatedDeliveryDate:
            response.response?.data?.estimated_delivery_date || null,

        trackingUrl:
            response.response?.data?.tracking_url || null,

        shiprocketStatus:
            response.response?.data?.status || null,

        rawResponse: response,
    };
};