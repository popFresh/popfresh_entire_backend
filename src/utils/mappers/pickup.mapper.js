import ApiError from "../../utils/ApiError.js";

export const mapPickupResponse = (response) => {

    // =====================================================
    // Shiprocket Pickup Scheduling Failed
    // =====================================================

    if (response.pickup_status !== 1) {
        throw new ApiError(
            400,
            response.message || "Failed to schedule pickup."
        );
    }

    // =====================================================
    // Success
    // =====================================================

    return {

        pickupToken:
            response.response?.pickup_token || null,

        pickupScheduled: true,

        pickupDate: new Date(),

        shiprocketStatus:
            response.status || null,

        rawResponse: response,

    };

};