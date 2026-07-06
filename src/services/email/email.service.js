import { Resend } from "resend";

import { orderConfirmationTemplate } from "./templates/orderConfirmation.js";
import { orderPackedTemplate } from "./templates/orderPacked.js";
import { orderShippedTemplate } from "./templates/orderShipped.js";
import { outForDeliveryTemplate } from "./templates/outForDeliveryTemplate.js";
import { orderDeliveredTemplate } from "./templates/orderDelivered.js";
import { feedbackRequestTemplate } from "./templates/feedbackRequestTemplate.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  return resend.emails.send({
    from: "PopFresh Orders <orders@popfresh.in>",
    to,
    subject,
    html,
  });
};

const sendOrderConfirmation = async ({ order, customer }) => {
  return sendEmail({
    to: customer.email,
    subject: `Order Confirmed • ${order.receipt}`,
    html: orderConfirmationTemplate({
      orderNumber: order.receipt,
      total: order.total,
    }),
  });
};

const sendOrderPacked = async ({ order, customer }) => {
  console.log("Sending PACKED email");
  console.log(customer.email);

  return sendEmail({
    to: customer.email,
    subject: `Your Order Has Been Packed • ${order.receipt}`,
    html: orderPackedTemplate({
      receipt: order.receipt,
      total: order.total,
    }),
  });
};

const sendOrderShipped = async ({ order, customer }) => {
  return sendEmail({
    to: customer.email,
    subject: `Your Order Has Been Shipped • ${order.receipt}`,
    html: orderShippedTemplate({
      receipt: order.receipt,
      total: order.total,
    }),
  });
};

const sendOutForDelivery = async ({ order, customer }) => {
  return sendEmail({
    to: customer.email,
    subject: `Out for Delivery • ${order.receipt}`,
    html: outForDeliveryTemplate({
      receipt: order.receipt,
      total: order.total,
    }),
  });
};

const sendOrderDelivered = async ({ order, customer }) => {
  return sendEmail({
    to: customer.email,
    subject: `Order Delivered • ${order.receipt}`,
    html: orderDeliveredTemplate({
      receipt: order.receipt,
      total: order.total,
    }),
  });
};

const sendFeedbackRequest = async ({ order, customer }) => {
  return sendEmail({
    to: customer.email,
    subject: `How was your PopFresh order?`,
    html: feedbackRequestTemplate({
      receipt: order.receipt,
    }),
  });
};
export default {
    sendEmail,

    sendOrderConfirmation,

    sendOrderShipped,

    sendOutForDelivery,

    sendOrderDelivered,

    sendFeedbackRequest,
    sendOrderPacked
}

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendEmail = async ({ to, subject, html }) => {
//   try {
//     const response = await resend.emails.send({
//     //   from: "onboarding@resend.dev",
//     // from: "orders@popfresh.in", 
//     from: "PopFresh Orders <orders@popfresh.in>",
//       to,
//       subject,
//       html,
//     });

//     return response;
//   } catch (error) {
//     console.error("Email Error:", error);
//     throw error;
//   }
// };