// contact.controller.js

import { contactSchema } from "../validators/contact.validator.js";
import { sendContactEmail } from "../services/contact.service.js";
import {ApiResponse} from "../utils/ApiResponse.js";

export const submitContactForm = async (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body);

    await sendContactEmail(data);

    return res.status(200).json(
      new ApiResponse(
        200,
        "Your message has been sent successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};