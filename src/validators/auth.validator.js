import { z } from "zod";

// ==============================================
// LOGIN
// ==============================================

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required."),
});

// ==============================================
// UPDATE PROFILE
// ==============================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  phone: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit mobile number."
    ),
});

// ==============================================
// CHANGE PASSWORD
// ==============================================

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(100, "Password cannot exceed 100 characters."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password."),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "New password and confirm password do not match.",
      path: ["confirmPassword"],
    }
  );

  // ==============================================
// VALIDATE INVITATION TOKEN
// ==============================================

export const invitationTokenSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, "Invitation token is required."),
});

// ==============================================
// COMPLETE INVITATION
// ==============================================

export const completeInvitationSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),

    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters."),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

  // ==============================================
// FORGOT PASSWORD
// ==============================================

export const forgotPasswordSchema = z.object({

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

});

// ==============================================
// RESET PASSWORD
// ==============================================

export const resetPasswordSchema = z
  .object({

    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),

    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters."),

  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );