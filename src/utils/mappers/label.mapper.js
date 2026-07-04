import ApiError from "../ApiError.js";

export const mapLabelResponse = (response) => {

    // =====================================================
    // Shiprocket Label Generation Failed
    // =====================================================

    if (response.label_created !== 1) {
        throw new ApiError(
            400,
            response.message || "Failed to generate shipping label."
        );
    }

    // =====================================================
    // Success
    // =====================================================

    return {

        labelUrl:
            response.label_url || null,

        shiprocketStatus:
            response.status || null,

        rawResponse: response,
    };

};