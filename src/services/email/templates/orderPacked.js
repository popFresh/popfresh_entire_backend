import { baseEmail } from "./baseEmail.js";

export const orderPackedTemplate = ({
  receipt,
  trackingUrl,
}) =>
  baseEmail({
    badge: "ORDER PACKED",

    heading: "Your Order Has Been Packed!",

    description:
      "Great news! Your Pop Fresh order has been freshly packed and is now ready to begin its journey. Our delivery partner will be picking it up shortly, and we'll notify you as soon as it's on the way.",

    status: "Packed",

    delivery: "Dispatching Soon",

    receipt,

    buttonText: "Track My Order",

    buttonLink: trackingUrl,
  });


// import { baseTemplate } from "./baseEmail.js";

// export const orderPackedTemplate = (order)=>
// baseTemplate({
// heading:"Your Order Has Been Packed 📦",

// content:`

// <p>Good news!</p>

// <p>Your order is carefully packed and ready for dispatch.</p>

// <p><strong>Order:</strong> ${order.receipt}</p>

// <p>Our delivery partner will pick it up shortly.</p>

// `,

// buttonText:"Track Order",
// buttonUrl:`https://popfresh.in/orders/${order.receipt}`

// });