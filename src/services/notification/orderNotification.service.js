import whatsappService from "../whatsapp/whatsapp.service.js";
import emailService from "../email/email.service.js";
import  {addOrderActivity}  from "../orderActivity.service.js";

// =====================================================
// ORDER CONFIRMATION
// =====================================================

const sendOrderConfirmation = async (data) => {
  try {
    await emailService.sendOrderConfirmation(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📧 Order confirmation email sent successfully.",
    });
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Order confirmation email failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }

  try {
    await whatsappService.sendOrderConfirmation(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📱 Order confirmation WhatsApp sent successfully.",
    });
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Order confirmation WhatsApp failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }
};

// =====================================================
// ORDER PACKED
// =====================================================

const sendOrderPacked = async (data) => {
  try {
    await emailService.sendOrderPacked(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📧 Packed email sent successfully.",
    });
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Packed email failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }

  try {
    await whatsappService.sendOrderPacked(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📱 Packed WhatsApp sent successfully.",
    });
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Packed WhatsApp failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }
};

// =====================================================
// ORDER SHIPPED
// =====================================================

const sendOrderShipped = async (data) => {
  try {
    await emailService.sendOrderShipped(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📧 Shipped email sent successfully.",
    });
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Shipped email failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }

  try {
    await whatsappService.sendOrderShipped(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📱 Shipped WhatsApp sent successfully.",
    });
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Shipped WhatsApp failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }
};

// =====================================================
// OUT FOR DELIVERY
// =====================================================

const sendOutForDelivery = async (data) => {
  try {
    await emailService.sendOutForDelivery(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📧 Out For Delivery email sent successfully.",
    });
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Out For Delivery email failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }

  try {
    await whatsappService.sendOutForDelivery(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📱 Out For Delivery WhatsApp sent successfully.",
    });
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Out For Delivery WhatsApp failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }
};

// =====================================================
// ORDER DELIVERED
// =====================================================

const sendOrderDelivered = async (data) => {
  try {
    await emailService.sendOrderDelivered(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📧 Delivered email sent successfully.",
    });
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Delivered email failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }

  try {
    await whatsappService.sendOrderDelivered(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📱 Delivered WhatsApp sent successfully.",
    });
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Delivered WhatsApp failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }
};

// =====================================================
// FEEDBACK REQUEST
// =====================================================

const sendFeedbackRequest = async (data) => {
  try {
    await emailService.sendFeedbackRequest(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📧 Feedback request email sent successfully.",
    });
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Feedback request email failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }

  try {
    await whatsappService.sendFeedback(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📱 Feedback request WhatsApp sent successfully.",
    });
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Feedback request WhatsApp failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }
};

// =====================================================
// ORDER CANCELLED
// =====================================================

const sendOrderCancelled = async (data) => {
  try {
    await emailService.sendOrderCancelled(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📧 Cancelled email sent successfully.",
    });
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Cancelled email failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }

  try {
    await whatsappService.sendOrderCancelled(data);

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: "📱 Cancelled WhatsApp sent successfully.",
    });
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );

    await addOrderActivity({
      orderId: data.order.id,
      status: data.order.status,
      note: `❌ Cancelled WhatsApp failed.\nReason: ${
        error.response?.data?.message || error.message
      }`,
    });
  }
};

export default {
  sendOrderConfirmation,
  sendOrderPacked,
  sendOrderShipped,
  sendOutForDelivery,
  sendOrderDelivered,
  sendFeedbackRequest,
  sendOrderCancelled
};

// import whatsappService from "../whatsapp/whatsapp.service.js";
// import emailService from "../email/email.service.js";

// const sendOrderConfirmation = async (data) => {
//   try {
//     await emailService.sendOrderConfirmation(data);
//   } catch (error) {
//     console.error(
//       "Email notification failed:",
//       error.response?.data || error.message
//     );
//   }

//   try {
//     await whatsappService.sendOrderConfirmation(data);
//   } catch (error) {
//     console.error(
//       "WhatsApp notification failed:",
//       error.response?.data || error.message
//     );
//   }
// };


// const sendOrderPacked = async (data) => {
//   try {
//     console.log("Inside orderNotificationService.sendOrderPacked");
//     await emailService.sendOrderPacked(data);
//   } catch (error) {
//     console.error(
//       "Email notification failed:",
//       error.response?.data || error.message
//     );
//   }

//   try {
//     await whatsappService.sendOrderPacked(data);
//   } catch (error) {
//     console.error(
//       "WhatsApp notification failed:",
//       error.response?.data || error.message
//     );
//   }
// };

// const sendOrderShipped = async (data) => {
//   try {
//     await emailService.sendOrderShipped(data);
//   } catch (error) {
//     console.error(
//       "Email notification failed:",
//       error.response?.data || error.message
//     );
//   }

//   try {
//     await whatsappService.sendOrderShipped(data);
//   } catch (error) {
//     console.error(
//       "WhatsApp notification failed:",
//       error.response?.data || error.message
//     );
//   }
// };

// const sendOutForDelivery = async (data) => {
//   try {
//     await emailService.sendOutForDelivery(data);
//   } catch (error) {
//     console.error(
//       "Email notification failed:",
//       error.response?.data || error.message
//     );
//   }

//   try {
//     await whatsappService.sendOutForDelivery(data);
//   } catch (error) {
//     console.error(
//       "WhatsApp notification failed:",
//       error.response?.data || error.message
//     );
//   }
// };

// const sendOrderDelivered = async (data) => {
//   try {
//     await emailService.sendOrderDelivered(data);
//   } catch (error) {
//     console.error(
//       "Email notification failed:",
//       error.response?.data || error.message
//     );
//   }

//   try {
//     await whatsappService.sendOrderDelivered(data);
//   } catch (error) {
//     console.error(
//       "WhatsApp notification failed:",
//       error.response?.data || error.message
//     );
//   }
// };

// const sendFeedbackRequest = async (data) => {
//   try {
//     await emailService.sendFeedbackRequest(data);
//   } catch (error) {
//     console.error(
//       "Email notification failed:",
//       error.response?.data || error.message
//     );
//   }

//   try {
//     await whatsappService.sendFeedback(data);
//   } catch (error) {
//     console.error(
//       "WhatsApp notification failed:",
//       error.response?.data || error.message
//     );
//   }
// };

// export default {
//   sendOrderConfirmation,
//   sendOrderPacked,
//   sendOrderShipped,
//   sendOutForDelivery,
//   sendOrderDelivered,
//   sendFeedbackRequest,
// };


// // import whatsappService from "../whatsapp/whatsapp.service.js";
// // import {sendEmail} from "../email/email.service.js";

// // const sendOrderConfirmation = async (order) => {
// //   // Send Email
// //   try {
// //     await sendEmail.sendOrderConfirmation(order);
// //   } catch (error) {
// //     console.error("Email notification failed:", error.message);
// //   }

// //   // Send WhatsApp
// //   try {
// //     await whatsappService.sendOrderConfirmation({
// //       phone: order.phone,
// //       customerName: order.customerName,
// //       orderNumber: order.orderNumber,
// //     });
// //   } catch (error) {
// //     console.error("WhatsApp notification failed:", error.message);
// //   }
// // };

// // export default {
// //   sendOrderConfirmation,
// // };