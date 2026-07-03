export const mapShipment = (response) => {
    return {
        shiprocketOrderId: response.order_id,
        shiprocketShipmentId: response.shipment_id,
        channelOrderId: response.channel_order_id,

        shiprocketStatus: response.status,

        statusCode: response.status_code,

        awbCode: response.awb_code || null,

        courierCompanyId: response.courier_company_id || null,

        courierName: response.courier_name || null,

        onboardingCompleted:
            Boolean(response.onboarding_completed_now),

        newChannel: response.new_channel,

        packagingBoxError:
            response.packaging_box_error || null,
    };
};