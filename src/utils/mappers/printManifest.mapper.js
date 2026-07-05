import ApiError from "../ApiError.js";

export const mapPrintManifestResponse = (response) => {

    if (!response.manifest_url) {
        throw new ApiError(
            400,
            response.message || "Failed to print manifest."
        );
    }

    return {
        manifestUrl: response.manifest_url,
        rawResponse: response,
    };

};