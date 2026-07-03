export const buildShipmentPayload = (order) => {
    return {
        order_id: order.receipt,

        order_date: order.createdAt.toISOString().split("T")[0],

        pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,

        billing_customer_name: order.shippingName,

        billing_last_name: "",

        billing_address: order.shippingAddress1,

        billing_address_2: order.shippingAddress2 || "",

        billing_city: order.shippingCity,

        billing_pincode: order.shippingPincode,

        billing_state: order.shippingState,

        billing_country: "India",

        billing_email: order.customer.email || "",

        billing_phone: order.shippingPhone,

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

        length: 10,

        breadth: 10,

        height: 5,

        weight: calculateOrderWeight(order.orderItems),
    };
};

/**
 * Calculates total order weight in KG.
 */
const calculateOrderWeight = (items) => {
    let totalWeight = 0;

    for (const item of items) {
        const weight = Number(item.product.weight || 0);

        totalWeight += weight * item.quantity;
    }

    return totalWeight;
};