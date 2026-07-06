import { baseTemplate } from "./baseTemplate.js";

export const outForDeliveryTemplate = (order) =>
  baseTemplate({
    heading: "Out for Delivery 🚚",
    content: `
      <p>Great news! Your PopFresh order is out for delivery.</p>

      <p><strong>Order ID:</strong> ${order.orderNumber}</p>

      <p>Your delivery partner is on the way and your order should reach you soon.</p>

      <p>Please keep your phone nearby in case the delivery partner needs to contact you.</p>
    `,
    buttonText: "Track Order",
    buttonUrl: `https://popfresh.in/orders/${order.orderNumber}`,
  });