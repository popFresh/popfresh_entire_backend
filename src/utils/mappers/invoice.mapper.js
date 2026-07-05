import ApiError from "../ApiError.js";

export const mapInvoiceResponse = (response) => {

    // =====================================================
    // Shiprocket Invoice Generation Failed
    // =====================================================

    if (!response.is_invoice_created) {
    throw new ApiError(
        400,
        response.message || "Failed to generate invoice."
    );
}

    // =====================================================
    // Success
    // =====================================================

    return {

        invoiceUrl:
            response.invoice_url || null,

        shiprocketStatus:
            response.status || null,

        rawResponse: response,

    };

};