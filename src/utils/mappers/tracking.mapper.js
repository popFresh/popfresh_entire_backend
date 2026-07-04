import ApiError from "../ApiError.js";

export const mapTrackingResponse = (response) => {

    // =====================================================
    // Validation
    // =====================================================

    if (!response.tracking_data) {
        throw new ApiError(
            400,
            response.message || "Unable to fetch shipment tracking."
        );
    }

    const tracking = response.tracking_data;

    const shipment = tracking.shipment_track?.[0] || {};

    const activities =
        tracking.shipment_track_activities || [];

    return {

        awbCode:
            shipment.awb_code || null,

        courierName:
            shipment.courier_name || null,

        currentStatus:
            shipment.current_status || null,

        currentStatusCode:
            shipment.current_status_code || null,

        trackingUrl:
            shipment.track_url || null,

        estimatedDeliveryDate:
            shipment.etd || null,

        history: activities.map((activity) => ({

            status:
                activity.activity || null,

            location:
                activity.location || null,

            remarks:
                activity["sr-status-label"] || null,

            eventTime:
                activity.date
                    ? new Date(activity.date)
                    : null,

        })),

        rawResponse: response,

    };

};