import { z } from "zod";

// ==============================================
// INVITE TEAM MEMBER
// ==============================================

export const inviteMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  role: z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER"], {
    message: "Invalid role selected.",
  }),
});