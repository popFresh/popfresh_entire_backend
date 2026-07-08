import { baseEmail } from "./baseEmail.js";

export const feedbackRequestTemplate = ({
  receipt,
  feedbackLink,
}) =>
  baseEmail({
    badge: "WE'D LOVE YOUR FEEDBACK",

    heading: "How Was Your Pop Fresh Experience? 💚",

    description:
      "We hope you're enjoying every bite of your freshly roasted makhanas! Your feedback helps us improve and continue delivering the best snacking experience possible. We'd truly appreciate it if you could spare a minute to share your thoughts.",

    status: "Order Completed",

    delivery: "Delivered Successfully",

    receipt,

    buttonText: "Share Your Feedback",

    buttonLink: feedbackLink,
  });

// import { baseTemplate } from "./baseEmail.js";

// export const feedbackRequestTemplate = (order) =>
//   baseTemplate({
//     heading: "How Was Your Experience? 💚",
//     content: `
//       <p>We hope you enjoyed your PopFresh order!</p>

//       <p><strong>Order ID:</strong> ${order.orderNumber}</p>

//       <p>Your feedback helps us improve our products and service.</p>

//       <p>It only takes a minute and means a lot to us.</p>
//     `,
//     buttonText: "Leave Feedback",
//     buttonUrl: `https://popfresh.in/feedback/${order.orderNumber}`,
//   });