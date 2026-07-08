import { baseEmail } from "./baseEmail.js";

export const orderShippedTemplate = ({
  receipt,
  trackingUrl,
}) =>
  baseEmail({
    badge: "ORDER SHIPPED",

    heading: "🚚 Your Order Is On Its Way!",

    description:
      "Exciting news! Your Pop Fresh order has been shipped and is now on its way to you. You can track your shipment anytime using the button below. We can't wait for you to enjoy every crunchy bite!",

    status: "Shipped",

    delivery: "Expected in 2–4 Days",

    receipt,

    buttonText: "Track Shipment",

    buttonLink: trackingUrl,
  });

// import { baseTemplate } from "./baseEmail.js";

// export const orderShippedTemplate=(order)=>
// baseTemplate({

// heading:"Your Order is On the Way 🚚",

// content:`

// <p>Your order has been shipped.</p>

// <p><strong>Tracking Number:</strong>
// ${order.trackingId}</p>

// <p>Expected Delivery:
// <strong>${order.expectedDelivery}</strong></p>

// `,

// buttonText:"Track Shipment",

// buttonUrl:order.trackingUrl

// });