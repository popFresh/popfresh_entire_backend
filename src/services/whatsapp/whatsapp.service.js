import axios from "axios";
import TEMPLATES from "../../config/whatsappTemplates.js";
import techService from "../tech.service.js";

const BASE_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

// ==========================
// Format Phone Number
// ==========================

const formatPhoneNumber = (phone) => {
  const cleaned = String(phone).replace(/\D/g, "");

  if (cleaned.startsWith("91")) {
    return cleaned;
  }

  return `91${cleaned}`;
};

// ==========================
// Generic Template Sender
// ==========================

const sendTemplate = async ({
  phone,
  template,
  values = [],
  headerImage = null,
  language = "en",
  metadata = {},
}) => {
  try {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formatPhoneNumber(phone),
      type: "template",
      template: {
        name: template,
        language: {
          code: language,
        },
      },
    };

    const components = [];

    // Header Image
    if (headerImage) {
      components.push({
        type: "header",
        parameters: [
          {
            type: "image",
            image: {
              link: headerImage,
            },
          },
        ],
      });
    }

    // Body Parameters
    if (values.length > 0) {
      components.push({
        type: "body",
        parameters: values.map((value) => ({
          type: "text",
          text: String(value),
        })),
      });
    }

    if (components.length > 0) {
      payload.template.components = components;
    }

    const response = await axios.post(BASE_URL, payload, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    await techService.error({
      category: "WHATSAPP",
      title: "WhatsApp Message Failed",
      message: error.message,
      metadata: {
        provider: "Meta WhatsApp Cloud API",
        phone: formatPhoneNumber(phone),
        template,
        values,
        ...metadata,
        response: error.response?.data || null,
        stack: error.stack,
      },
    });

    throw error;
  }
};

// ==========================
// Wrapper Functions
// ==========================

const sendOrderConfirmation = async ({ order, customer }) => {
  return sendTemplate({
    phone: customer.phone,
    template: TEMPLATES.ORDER_CONFIRMATION,
    headerImage:
      "https://res.cloudinary.com/diksf0ddl/image/upload/v1783436890/pf_orderConfirmed_yx8t2d.png",
    values: [customer.name, order.receipt],
    metadata: {
      receipt: order.receipt,
      orderId: order.id,
      customerId: customer.id,
    },
  });
};

const sendOrderPacked = async ({ order, customer }) => {
  return sendTemplate({
    phone: customer.phone,
    template: TEMPLATES.ORDER_PACKED,
    headerImage:
      "https://res.cloudinary.com/diksf0ddl/image/upload/v1783439191/pf_orderPacked_x1egib.jpg",
    values: [customer.name, order.receipt],
    metadata: {
      receipt: order.receipt,
      orderId: order.id,
      customerId: customer.id,
    },
  });
};

const sendOrderShipped = async ({ order, customer }) => {
  return sendTemplate({
    phone: customer.phone,
    template: TEMPLATES.ORDER_SHIPPED,
    headerImage:
      "https://res.cloudinary.com/diksf0ddl/image/upload/v1783439388/pf_orderShipped_hlljwz.png",
    values: [customer.name, order.receipt],
    metadata: {
      receipt: order.receipt,
      orderId: order.id,
      customerId: customer.id,
    },
  });
};

const sendOutForDelivery = async ({ order, customer }) => {
  return sendTemplate({
    phone: customer.phone,
    template: TEMPLATES.OUT_FOR_DELIVERY,
    headerImage:
      "https://res.cloudinary.com/diksf0ddl/image/upload/v1783439563/pf_orderOutForDelivery_j35hmm.png",
    values: [customer.name, order.receipt],
    metadata: {
      receipt: order.receipt,
      orderId: order.id,
      customerId: customer.id,
    },
  });
};

const sendOrderDelivered = async ({ order, customer }) => {
  return sendTemplate({
    phone: customer.phone,
    template: TEMPLATES.DELIVERED,
    headerImage:
      "https://res.cloudinary.com/diksf0ddl/image/upload/v1783439676/pf_orderDelivered_1_pd7kav.png",
    values: [customer.name, order.receipt],
    metadata: {
      receipt: order.receipt,
      orderId: order.id,
      customerId: customer.id,
    },
  });
};

const sendFeedback = async ({ order, customer }) => {
  return sendTemplate({
    phone: customer.phone,
    template: TEMPLATES.FEEDBACK_REQUEST,
    metadata: {
      receipt: order?.receipt,
      orderId: order?.id,
      customerId: customer.id,
    },
  });
};

export default {
  sendTemplate,
  sendOrderConfirmation,
  sendOrderPacked,
  sendOrderShipped,
  sendOutForDelivery,
  sendOrderDelivered,
  sendFeedback,
};





//working but in the top version, added logger
// import axios from "axios";
// import TEMPLATES from "../../config/whatsappTemplates.js";

// const BASE_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

// // ==========================
// // Format Phone Number
// // ==========================

// const formatPhoneNumber = (phone) => {
//   const cleaned = String(phone).replace(/\D/g, "");

//   if (cleaned.startsWith("91")) {
//     return cleaned;
//   }

//   return `91${cleaned}`;
// };


// /**
//  * Generic function to send any WhatsApp template
//  */
// const sendTemplate = async ({
//   phone,
//   template,
//   values = [],
//    headerImage = null,
//   language = "en",
// }) => {
//   try {
//     const payload = {
//       messaging_product: "whatsapp",
//       recipient_type: "individual",
//       to: formatPhoneNumber(phone),
//       type: "template",
//       template: {
//         name: template,
//         language: {
//           code: language,
//         },
//       },
//     };
// const components = [];

//     // -------------------------
//     // Header Image (Optional)
//     // -------------------------
//     if (headerImage) {
//       components.push({
//         type: "header",
//         parameters: [
//           {
//             type: "image",
//             image: {
//               link: headerImage,
//             },
//           },
//         ],
//       });
//     }

//     // Only attach body parameters if the template requires them
//     // if (values.length > 0) {
//     //   payload.template.components = [
//     //     {
//     //       type: "body",
//     //       parameters: values.map((value) => ({
//     //         type: "text",
//     //         text: String(value),
//     //       })),
//     //     },
//     //   ];
//     // }
//     if (values.length > 0) {
//       components.push({
//         type: "body",
//         parameters: values.map((value) => ({
//           type: "text",
//           text: String(value),
//         })),
//       });
//     }

// if (components.length > 0) {
//       payload.template.components = components;
//     }

//     const response = await axios.post(BASE_URL, payload, {
//       headers: {
//         Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error(
//       "WhatsApp Error:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// /**
//  * ==========================
//  * Wrapper Functions
//  * (Temporary - using hello_world)
//  * ==========================
//  */

// // const sendOrderConfirmation = async ({ customer }) => {
// //   return sendTemplate({
// //     phone: customer.phone,
// //     template: TEMPLATES.ORDER_CONFIRMATION,
// //   });
// // };

// // const sendOrderConfirmation = async ({ order, customer }) => {
// //   return sendTemplate({
// //     phone: customer.phone,
// //     template: TEMPLATES.ORDER_CONFIRMATION,
// //     values: [
// //       customer.name,
// //       order.receipt,
// //     ],
// //   });
// // };

// const sendOrderConfirmation = async ({ order, customer }) => {
//   return sendTemplate({
//     phone: customer.phone,
//     template: TEMPLATES.ORDER_CONFIRMATION,
//     headerImage: "https://res.cloudinary.com/diksf0ddl/image/upload/v1783436890/pf_orderConfirmed_yx8t2d.png",
//     values: [
//       customer.name,
//       order.receipt,
//     ],
//   });
// };

// // const sendOrderPacked = async ({ customer }) => {
// //     console.log("Sending PACKED WhatsApp");
// // console.log(customer.phone);
// //   return sendTemplate({
// //     phone: customer.phone,
// //     template: TEMPLATES.ORDER_PACKED,
// //   });
// // };

// const sendOrderPacked = async ({ order, customer }) => {
//   console.log("Sending PACKED WhatsApp");
//   console.log(customer.phone);

//   return sendTemplate({
//     phone: customer.phone,
//     template: TEMPLATES.ORDER_PACKED,
//     headerImage: "https://res.cloudinary.com/diksf0ddl/image/upload/v1783439191/pf_orderPacked_x1egib.jpg",
//     values: [
//       customer.name,
//       order.receipt,
//     ],
//   });
// };

// // const sendOrderShipped = async ({ customer }) => {
// //   return sendTemplate({
// //     phone: customer.phone,
// //     template: TEMPLATES.ORDER_SHIPPED,
// //   });
// // };

// const sendOrderShipped = async ({ order, customer }) => {
//   return sendTemplate({
//     phone: customer.phone,
//     template: TEMPLATES.ORDER_SHIPPED,
//     headerImage: "https://res.cloudinary.com/diksf0ddl/image/upload/v1783439388/pf_orderShipped_hlljwz.png",
//     values: [
//       customer.name,
//       order.receipt,
//     ],
//   });
// };

// // const sendOutForDelivery = async ({ customer }) => {
// //   return sendTemplate({
// //     phone: customer.phone,
// //     template: TEMPLATES.OUT_FOR_DELIVERY,
// //   });
// // };


// const sendOutForDelivery = async ({ order, customer }) => {
//   return sendTemplate({
//     phone: customer.phone,
//     template: TEMPLATES.OUT_FOR_DELIVERY,
//     headerImage: "https://res.cloudinary.com/diksf0ddl/image/upload/v1783439563/pf_orderOutForDelivery_j35hmm.png",
//     values: [
//       customer.name,
//       order.receipt,
//     ],
//   });
// };

// // const sendDelivered = async ({ customer }) => {
// //   return sendTemplate({
// //     phone: customer.phone,
// //     template: TEMPLATES.DELIVERED,
// //   });
// // };

// // const sendDelivered = async ({ order, customer }) => {
// //   return sendTemplate({
// //     phone: customer.phone,
// //     template: TEMPLATES.DELIVERED,
// //     headerImage: process.env.WHATSAPP_HEADER_IMAGE,
// //     values: [
// //       customer.name,
// //       order.receipt,
// //     ],
// //   });
// // };


// const sendOrderDelivered = async ({ order, customer }) => {
//   return sendTemplate({
//     phone: customer.phone,
//     template: TEMPLATES.DELIVERED,
//     headerImage: "https://res.cloudinary.com/diksf0ddl/image/upload/v1783439676/pf_orderDelivered_1_pd7kav.png",
//     values: [
//       customer.name,
//       order.receipt,
//     ],
//   });
// };

// const sendFeedback = async ({ customer }) => {
//   return sendTemplate({
//     phone: customer.phone,
//     template: TEMPLATES.FEEDBACK_REQUEST,
//   });
// };

// export default {
//   sendTemplate,
//   sendOrderConfirmation,
//   sendOrderShipped,
//   sendOutForDelivery,
//   sendOrderDelivered,
//   sendFeedback,
//   sendOrderPacked
// };






// After approving template, will use this 
// import axios from "axios";
// import TEMPLATES from "../../config/whatsappTemplates.js";

// const BASE_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

// const sendTemplate = async ({
//   phone,
//   template,
//   values = [],
//   language = "en_US",
// }) => {
//   try {
//     const bodyParameters = values.map((value) => ({
//       type: "text",
//       text: String(value),
//     }));

//     const payload = {
//       messaging_product: "whatsapp",
//       recipient_type: "individual",
//       to: phone,
//       type: "template",
//       template: {
//         name: template,
//         language: {
//           code: language,
//         },
//         components: [
//           {
//             type: "body",
//             parameters: bodyParameters,
//           },
//         ],
//       },
//     };

//     const response = await axios.post(BASE_URL, payload, {
//       headers: {
//         Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error(
//       "WhatsApp Error:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// /**
//  * ===========================
//  * Wrapper Functions
//  * ===========================
//  */

// const sendOrderConfirmation = async ({
//   phone,
//   customerName,
//   orderNumber,
// }) => {
//   return sendTemplate({
//     phone,
//     template: TEMPLATES.ORDER_CONFIRMATION,
//     values: [customerName, orderNumber],
//   });
// };

// const sendOrderShipped = async ({
//   phone,
//   customerName,
//   orderNumber,
//   trackingNumber,
// }) => {
//   return sendTemplate({
//     phone,
//     template: TEMPLATES.ORDER_SHIPPED,
//     values: [customerName, orderNumber, trackingNumber],
//   });
// };

// const sendOutForDelivery = async ({
//   phone,
//   customerName,
//   orderNumber,
// }) => {
//   return sendTemplate({
//     phone,
//     template: TEMPLATES.OUT_FOR_DELIVERY,
//     values: [customerName, orderNumber],
//   });
// };

// const sendDelivered = async ({
//   phone,
//   customerName,
//   orderNumber,
// }) => {
//   return sendTemplate({
//     phone,
//     template: TEMPLATES.DELIVERED,
//     values: [customerName, orderNumber],
//   });
// };

// const sendFeedback = async ({
//   phone,
//   customerName,
//   orderNumber,
//   feedbackUrl,
// }) => {
//   return sendTemplate({
//     phone,
//     template: TEMPLATES.FEEDBACK_REQUEST,
//     values: [customerName, orderNumber, feedbackUrl],
//   });
// };

// export default {
//   sendTemplate,
//   sendOrderConfirmation,
//   sendOrderShipped,
//   sendOutForDelivery,
//   sendDelivered,
//   sendFeedback,
// };


//This worked, but this meant only for testing
// import axios from "axios";

// console.log(process.env.WHATSAPP_ACCESS_TOKEN);
// console.log(process.env.WHATSAPP_PHONE_NUMBER_ID);
// console.log(process.env.WHATSAPP_API_VERSION);

// const BASE_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

// const sendTemplate = async ({
//   phone,
//   template,
//   parameters = [],
//   language = "en_US",
// }) => {
//   try {
//     const response = await axios.post(
//       BASE_URL,
//       {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         to: phone,
//         type: "template",
//         template: {
//           name: template,
//           language: {
//             code: language,
//           },
//           components: [
//             {
//               type: "body",
//               parameters,
//             },
//           ],
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("WhatsApp Error:");

//     if (error.response) {
//       console.error(error.response.data);
//     } else {
//       console.error(error.message);
//     }

//     throw error;
//   }
// };

// export default {
//   sendTemplate,
// };