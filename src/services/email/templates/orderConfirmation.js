import { baseEmail } from "./baseEmail.js";

export const orderConfirmationTemplate = ({
  receipt,
  trackingUrl,
}) =>
  baseEmail({
    badge: "ORDER CONFIRMED",

    heading: "Your Order Is Confirmed!",

    description:
      "We're just as excited as you are! Our team has already started preparing your freshly roasted makhanas. We'll keep you updated at every stage until your order reaches your doorstep.",

    status: "Confirmed",

    delivery: "6–8 Working Days",

    receipt,

    buttonText: "Track My Order",

    buttonLink: trackingUrl,
  });


// import { baseTemplate } from "./baseTemplate.js";

// export const orderConfirmationTemplate = (order) =>
// baseTemplate({
// heading:"Order Confirmed ✅",
// content:`

// <p>Your order has been confirmed successfully.</p>

// <p><strong>Order ID:</strong> ${order.receipt}</p>

// <p><strong>Total:</strong> ₹${order.total}</p>

// <p>We'll start preparing your order shortly.</p>

// `,
// buttonText:"Track Order",
// buttonUrl:`https://popfresh.in/orders/${order.receipt}`
// });