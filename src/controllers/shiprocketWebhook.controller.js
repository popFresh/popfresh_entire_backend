import { processShiprocketWebhook } from "../services/shiprocketWebhook.service.js";

export const handleShiprocketWebhook = async (req, res, next) => {
  try {
    await processShiprocketWebhook(req.body);

    return res.status(200).json({
      success: true,
      message: "Webhook received successfully.",
    });
  } catch (error) {
    next(error);
  }
};