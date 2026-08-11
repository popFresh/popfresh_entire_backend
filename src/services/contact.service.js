import { Resend } from "resend";
import { contactEmailTemplate } from "./email/templates/contactForm.js";
import techService from "./tech.service.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async ({
  name,
  email,
  phone,
  message,
}) => {
  try {
    return await resend.emails.send({
      from: "PopFresh Contact <contact@popfresh.in>",
      to: "infopopfresh@gmail.com",
      subject: `📩 New Contact Form - ${name}`,
      html: contactEmailTemplate({
        name,
        email,
        phone,
        message,
      }),
    });
  } catch (error) {
    techService.error({
      category: "CONTACT",
      title: "Contact Email Failed",
      message: error.message,
      metadata: {
        provider: "Resend",
        name,
        email,
        phone,
        subject: `📩 New Contact Form - ${name}`,
        stack: error.stack,
      },
    });

    throw error;
  }
};