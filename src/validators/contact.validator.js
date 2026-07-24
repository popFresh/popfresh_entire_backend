// contact.validator.js

import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().trim().min(10),
  message: z.string().trim().min(10),
});