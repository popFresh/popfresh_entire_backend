import ApiError from "../ApiError.js";

export const mapManifestResponse = (response) => {

    // =====================================================
    // Shiprocket Manifest Generation Failed
    // =====================================================

    if (response.manifest_url == null) {
        throw new ApiError(
            400,
            response.message || "Failed to generate manifest."
        );
    }

    // =====================================================
    // Success
    // =====================================================

    return {

        manifestUrl:
            response.manifest_url,

        shiprocketStatus:
            response.status || null,

        rawResponse: response,

    };

};