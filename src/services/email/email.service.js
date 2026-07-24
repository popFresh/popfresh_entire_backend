
import { Resend } from "resend";

import techService from "../tech.service.js";

import { orderConfirmationTemplate } from "./templates/orderConfirmation.js";
import { orderPackedTemplate } from "./templates/orderPacked.js";
import { orderShippedTemplate } from "./templates/orderShipped.js";
import { outForDeliveryTemplate } from "./templates/outForDeliveryTemplate.js";
import { orderDeliveredTemplate } from "./templates/orderDelivered.js";
import { feedbackRequestTemplate } from "./templates/feedbackRequestTemplate.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    return await resend.emails.send({
      from: "PopFresh Orders <orders@popfresh.in>",
      to,
      subject,
      html,
    });
  } catch (error) {
    await techService.error({
      category: "EMAIL",
      title: "Email Send Failed",
      message: error.message,
      metadata: {
        provider: "Resend",
        to,
        subject,
        response: error.response?.data || null,
        stack: error.stack,
      },
    });

    throw error;
  }
};

const sendOrderConfirmation = async ({ order, customer }) => {
  return sendEmail({
    to: customer.email,
    subject: "Your Pop Fresh Order Has Been Confirmed ✅",
    html: orderConfirmationTemplate({
      receipt: order.receipt,
      trackingUrl: "https://popfresh.in/track-order",
    }),
  });
};

const sendOrderPacked = async ({ order, customer }) => {
  return sendEmail({
    to: customer.email,
    subject: "Great News! Your Order Has Been Packed 📦",
    html: orderPackedTemplate({
      receipt: order.receipt,
      trackingUrl: "https://popfresh.in/track-order",
    }),
  });
};

const sendOrderShipped = async ({ order, customer }) => {
  return sendEmail({
    to: customer.email,
    subject: "🚚 Your Pop Fresh Order Is On Its Way!",
    html: orderShippedTemplate({
      receipt: order.receipt,
      trackingUrl: "https://popfresh.in/track-order",
    }),
  });
};

const sendOutForDelivery = async ({ order, customer }) => {
  return sendEmail({
    to: customer.email,
    subject: "🚛 Your Order Is Out For Delivery",
    html: outForDeliveryTemplate({
      receipt: order.receipt,
      trackingUrl: "https://popfresh.in/track-order",
    }),
  });
};

const sendOrderDelivered = async ({ order, customer }) => {
  return sendEmail({
    to: customer.email,
    subject: "🎉 Your Pop Fresh Order Has Been Delivered",
    html: orderDeliveredTemplate({
      receipt: order.receipt,
      trackingUrl: "https://popfresh.in/track-order",
    }),
  });
};

const sendFeedbackRequest = async ({ customer }) => {
  return sendEmail({
    to: customer.email,
    subject: "How Did We Do? We'd Love Your Feedback 💚",
    html: feedbackRequestTemplate({
      trackingUrl: "https://popfresh.in/track-order",
    }),
  });
};

export default {
  sendEmail,
  sendOrderConfirmation,
  sendOrderPacked,
  sendOrderShipped,
  sendOutForDelivery,
  sendOrderDelivered,
  sendFeedbackRequest,
};



// all worked, in the new version which is before that added loggings
// import { Resend } from "resend";

// import { orderConfirmationTemplate } from "./templates/orderConfirmation.js";
// import { orderPackedTemplate } from "./templates/orderPacked.js";
// import { orderShippedTemplate } from "./templates/orderShipped.js";
// import { outForDeliveryTemplate } from "./templates/outForDeliveryTemplate.js";
// import { orderDeliveredTemplate } from "./templates/orderDelivered.js";
// import { feedbackRequestTemplate } from "./templates/feedbackRequestTemplate.js";


// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendEmail = async ({ to, subject, html }) => {
//   try {
//     return await resend.emails.send({
//       from: "PopFresh Orders <orders@popfresh.in>",
//       to,
//       subject,
//       html,
//     });
//   } catch (error) {
//     techService.error({
//       category: "EMAIL",
//       title: "Email Send Failed",
//       message: error.message,
//       metadata: {
//         to,
//         subject,
//       },
//     });

//     throw error;
//   }
// };

// const sendOrderConfirmation = async ({ order, customer }) => {
//     console.log("Order object:", order);
//   return sendEmail({
//     to: customer.email,
//     subject: `Your Pop Fresh Order Has Been Confirmed ✅`,
//     html: orderConfirmationTemplate({
//       receipt: order.receipt,
//        trackingUrl: `https://popfresh.in/track-order`,
//     //   total: order.total,
//     }),
//   });
// };

// const sendOrderPacked = async ({ order, customer }) => {
//   console.log("Sending PACKED email");
//   console.log(customer.email);

//   return sendEmail({
//     to: customer.email,
//     subject: `Great News! Your Order Has Been Packed 📦`,
//     html: orderPackedTemplate({
//       receipt: order.receipt,
//        trackingUrl: `https://popfresh.in/track-order`,
//     }),
//   });
// };

// const sendOrderShipped = async ({ order, customer }) => {
//   return sendEmail({
//     to: customer.email,
//     subject: `🚚 Your Pop Fresh Order Is On Its Way!`,
//     html: orderShippedTemplate({
//       receipt: order.receipt,
//       trackingUrl: `https://popfresh.in/track-order`,
//     }),
//   });
// };

// const sendOutForDelivery = async ({ order, customer }) => {
//   return sendEmail({
//     to: customer.email,
//     subject: `🚛 Your Order Is Out For Delivery`,
//     html: outForDeliveryTemplate({
//       receipt: order.receipt,
//       trackingUrl: `https://popfresh.in/track-order`,
//     }),
//   });
// };

// const sendOrderDelivered = async ({ order, customer }) => {
//   return sendEmail({
//     to: customer.email,
//     subject: `🎉 Your Pop Fresh Order Has Been Delivered`,
//     html: orderDeliveredTemplate({
//       receipt: order.receipt,
//       trackingUrl: `https://popfresh.in/track-order`,
//     }),
//   });
// };

// const sendFeedbackRequest = async ({ order, customer }) => {
//   return sendEmail({
//     to: customer.email,
//     subject: `How Did We Do? We'd Love Your Feedback 💚`,
//     html: feedbackRequestTemplate({
//       trackingUrl: `https://popfresh.in/track-order`,
//     }),
//   });
// };


// export default {
//     sendEmail,

//     sendOrderConfirmation,

//     sendOrderShipped,

//     sendOutForDelivery,

//     sendOrderDelivered,

//     sendFeedbackRequest,
//     sendOrderPacked,
    
// }

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

