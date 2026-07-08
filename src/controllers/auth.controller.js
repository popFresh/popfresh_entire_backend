// src/controllers/auth.controller.js

import authService from "../services/auth.service.js";

import {
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  completeInvitationSchema,
  invitationTokenSchema,
   forgotPasswordSchema,
  resetPasswordSchema,
  

} from "../validators/auth.validator.js";

// ==============================================
// LOGIN
// ==============================================

const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const data = await authService.login(validatedData);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================================
// GET CURRENT USER
// ==============================================

const getCurrentUser = async (req, res, next) => {
  try {
    const data = await authService.getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};


// ==============================================
// VALIDATE INVITATION
// GET /api/v1/auth/invite/:token
// ==============================================

const validateInvitation = async (
  req,
  res,
  next
) => {
  try {

    const { token } =
      invitationTokenSchema.parse(req.params);

    const data =
      await authService.validateInvitation(token);

    res.status(200).json({
      success: true,
      message: "Invitation validated successfully.",
      data,
    });

  } catch (error) {
    next(error);
  }
};

// ==============================================
// COMPLETE INVITATION
// POST /api/v1/auth/invite/:token
// ==============================================

const completeInvitation = async (
  req,
  res,
  next
) => {
  try {

    const { token } =
      invitationTokenSchema.parse(req.params);

    const validatedData =
      completeInvitationSchema.parse(req.body);

    const data =
      await authService.completeInvitation(
        token,
        validatedData.password
      );

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data,
    });

  } catch (error) {
    next(error);
  }
};


// ==============================================
// FORGOT PASSWORD
// POST /api/v1/auth/forgot-password
// ==============================================

const forgotPassword = async (
  req,
  res,
  next
) => {

  try {

    const validatedData =
      forgotPasswordSchema.parse(req.body);

    await authService.forgotPassword(
      validatedData.email
    );

    res.status(200).json({

      success: true,

      message:
        "If an account exists with this email, a password reset link has been sent.",

    });

  } catch (error) {

    next(error);

  }

};

// ==============================================
// VALIDATE RESET TOKEN
// GET /api/v1/auth/reset-password/:token
// ==============================================

const validateResetToken = async (
  req,
  res,
  next
) => {

  try {

    const { token } =
      invitationTokenSchema.parse(req.params);

    const data =
      await authService.validateResetToken(
        token
      );

    res.status(200).json({

      success: true,

      message:
        "Reset link is valid.",

      data,

    });

  } catch (error) {

    next(error);

  }

};

// ==============================================
// RESET PASSWORD
// POST /api/v1/auth/reset-password/:token
// ==============================================

const resetPassword = async (
  req,
  res,
  next
) => {

  try {

    const { token } =
      invitationTokenSchema.parse(req.params);

    const validatedData =
      resetPasswordSchema.parse(req.body);

    await authService.resetPassword(

      token,

      validatedData.password

    );

    res.status(200).json({

      success: true,

      message:
        "Password reset successfully.",

    });

  } catch (error) {

    next(error);

  }

};


// ==============================================
// UPDATE PROFILE
// ==============================================

const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const data = await authService.updateProfile(
      req.user.id,
      validatedData
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================================
// CHANGE PASSWORD
// ==============================================

const changePassword = async (req, res, next) => {
  try {
    const validatedData =
      changePasswordSchema.parse(req.body);

    await authService.changePassword(
      req.user.id,
      validatedData
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export default {

  login,

  getCurrentUser,

  updateProfile,

  changePassword,

  validateInvitation,

  completeInvitation,

  forgotPassword,

  validateResetToken,

  resetPassword,

};