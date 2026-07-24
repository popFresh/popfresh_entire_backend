import { processShiprocketWebhook } from "../services/shiprocketWebhook.service.js";

export const handleShiprocketWebhook = async (
  req,
  res,
  next
) => {

  try {

    // const apiKey = req.headers["x-api-key"];

    // if (
    //   apiKey !== process.env.SHIPROCKET_WEBHOOK_SECRET
    // ) {

    //   return res.status(401).json({

    //     success: false,

    //     message: "Unauthorized webhook.",

    //   });

    // }

    await processShiprocketWebhook(req.body);

    return res.status(200).json({

      success: true,

      message: "Webhook received successfully.",

    });

  } catch (error) {

    next(error);

  }

};