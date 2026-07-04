import ApiError from "../ApiError.js";

export const mapCancelShipmentResponse = (response) => {

    // =====================================================
    // Shipment Cancellation Failed
    // =====================================================

    if (response.status !== 200) {
        throw new ApiError(
            400,
            response.message || "Failed to cancel shipment."
        );
    }

    // =====================================================
    // Success
    // =====================================================

    return {

        cancelled: true,

        message:
            response.message || "Shipment cancelled successfully.",

        rawResponse: response,

    };

};