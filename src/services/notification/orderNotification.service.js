import whatsappService from "../whatsapp/whatsapp.service.js";
import emailService from "../email/email.service.js";

const sendOrderConfirmation = async (data) => {
  try {
    await emailService.sendOrderConfirmation(data);
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );
  }

  try {
    await whatsappService.sendOrderConfirmation(data);
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );
  }
};


const sendOrderPacked = async (data) => {
  try {
    console.log("Inside orderNotificationService.sendOrderPacked");
    await emailService.sendOrderPacked(data);
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );
  }

  try {
    await whatsappService.sendOrderPacked(data);
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );
  }
};

const sendOrderShipped = async (data) => {
  try {
    await emailService.sendOrderShipped(data);
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );
  }

  try {
    await whatsappService.sendOrderShipped(data);
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );
  }
};

const sendOutForDelivery = async (data) => {
  try {
    await emailService.sendOutForDelivery(data);
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );
  }

  try {
    await whatsappService.sendOutForDelivery(data);
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );
  }
};

const sendOrderDelivered = async (data) => {
  try {
    await emailService.sendOrderDelivered(data);
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );
  }

  try {
    await whatsappService.sendOrderDelivered(data);
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );
  }
};

const sendFeedbackRequest = async (data) => {
  try {
    await emailService.sendFeedbackRequest(data);
  } catch (error) {
    console.error(
      "Email notification failed:",
      error.response?.data || error.message
    );
  }

  try {
    await whatsappService.sendFeedback(data);
  } catch (error) {
    console.error(
      "WhatsApp notification failed:",
      error.response?.data || error.message
    );
  }
};

export default {
  sendOrderConfirmation,
  sendOrderPacked,
  sendOrderShipped,
  sendOutForDelivery,
  sendOrderDelivered,
  sendFeedbackRequest,
};


// import whatsappService from "../whatsapp/whatsapp.service.js";
// import {sendEmail} from "../email/email.service.js";

// const sendOrderConfirmation = async (order) => {
//   // Send Email
//   try {
//     await sendEmail.sendOrderConfirmation(order);
//   } catch (error) {
//     console.error("Email notification failed:", error.message);
//   }

//   // Send WhatsApp
//   try {
//     await whatsappService.sendOrderConfirmation({
//       phone: order.phone,
//       customerName: order.customerName,
//       orderNumber: order.orderNumber,
//     });
//   } catch (error) {
//     console.error("WhatsApp notification failed:", error.message);
//   }
// };

// export default {
//   sendOrderConfirmation,
// };