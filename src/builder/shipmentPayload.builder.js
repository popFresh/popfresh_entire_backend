export const buildShipmentPayload = (order) => {

    const dimensions = calculateOrderDimensions(
        order.orderItems
    );

    return {

        order_id: order.receipt,

        order_date: order.createdAt
            .toISOString()
            .split("T")[0],

        pickup_location:
            process.env.SHIPROCKET_PICKUP_LOCATION,

        billing_customer_name:
            order.shippingName,

        billing_last_name: "",

        billing_address:
            order.shippingAddress1,

        billing_address_2:
            order.shippingAddress2 || "",

        billing_city:
            order.shippingCity,

        billing_pincode:
            order.shippingPincode,

        billing_state:
            order.shippingState,

        billing_country: "India",

        billing_email:
            order.customer.email || "",

        billing_phone:
            order.shippingPhone,

        shipping_is_billing: true,

        order_items: order.orderItems.map((item) => ({
            name: item.product.name,
            sku: item.product.sku,
            units: item.quantity,
            selling_price: Number(item.price),
        })),

        payment_method:
            order.payment?.status === "SUCCESS"
                ? "Prepaid"
                : "COD",

        sub_total: Number(order.subtotal),

        // =====================================================
        // Package Dimensions (CM)
        // =====================================================

        length: dimensions.length,

        breadth: dimensions.breadth,

        height: dimensions.height,

        // =====================================================
        // Package Weight (KG)
        // =====================================================

        weight: calculateOrderWeight(
            order.orderItems
        ),

    };

};

/**
 * ==========================================================
 * Calculates total order weight in KG.
 *
 * Database stores product weight in GRAMS.
 * Shiprocket expects weight in KILOGRAMS.
 * ==========================================================
 */

const calculateOrderWeight = (items) => {

    let totalWeightInGrams = 0;

    for (const item of items) {

        const weight = parseFloat(
            item.product.weight?.toString() ?? "0"
        );

        totalWeightInGrams +=
            weight * item.quantity;

    }

    return totalWeightInGrams / 1000;

};

/**
 * ==========================================================
 * Calculates package dimensions.
 *
 * Strategy:
 * - Length  = Maximum product length
 * - Breadth = Maximum product breadth
 * - Height  = Sum of product heights × quantity
 *
 * Units:
 * Database : Centimeters
 * Shiprocket : Centimeters
 * ==========================================================
 */

const calculateOrderDimensions = (items) => {

    let maxLength = 0;

    let maxBreadth = 0;

    let totalHeight = 0;

    for (const item of items) {

        const length = parseFloat(
            item.product.length?.toString() ?? "0"
        );

        const breadth = parseFloat(
            item.product.breadth?.toString() ?? "0"
        );

        const height = parseFloat(
            item.product.height?.toString() ?? "0"
        );

        maxLength = Math.max(
            maxLength,
            length
        );

        maxBreadth = Math.max(
            maxBreadth,
            breadth
        );

        totalHeight +=
            height * item.quantity;

    }

    return {

        length: maxLength || 10,

        breadth: maxBreadth || 10,

        height: totalHeight || 5,

    };

};

