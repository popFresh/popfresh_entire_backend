import whatsappService from "../services/whatsapp/whatsapp.service.js";

export const testWhatsApp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const response = await whatsappService.sendOrderConfirmation({
      phone,
    //   customerName: "Mohit",
    //   orderNumber: "PF1001",
    });

    return res.status(200).json({
      success: true,
      message: "WhatsApp message sent successfully",
      data: response,
    });
  } catch (error) {
    console.error(
      "WhatsApp Test Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send WhatsApp message",
      error: error.response?.data || error.message,
    });
  }
};








// this also worked , but this was for testing only 
// import whatsappService from "../services/whatsapp/whatsapp.service.js";

// export const testWhatsApp = async (req, res) => {
//   try {
//     const { phone } = req.body;

//     if (!phone) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone number is required",
//       });
//     }

//     const response = await whatsappService.sendTemplate({
//       phone,
//       template: "hello_world",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "WhatsApp message sent successfully",
//       data: response,
//     });
//   } catch (error) {
//     console.error("WhatsApp Test Error:", error.response?.data || error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to send WhatsApp message",
//       error: error.response?.data || error.message,
//     });
//   }
// };