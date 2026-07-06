import { baseTemplate } from "./baseTemplate.js";

export const feedbackRequestTemplate = (order) =>
  baseTemplate({
    heading: "How Was Your Experience? 💚",
    content: `
      <p>We hope you enjoyed your PopFresh order!</p>

      <p><strong>Order ID:</strong> ${order.orderNumber}</p>

      <p>Your feedback helps us improve our products and service.</p>

      <p>It only takes a minute and means a lot to us.</p>
    `,
    buttonText: "Leave Feedback",
    buttonUrl: `https://popfresh.in/feedback/${order.orderNumber}`,
  });