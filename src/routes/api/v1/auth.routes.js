import express from "express";

import authController from "../../../controllers/auth.controller.js";
import authenticate from "../../../middlewares/auth.middleware.js";

const router = express.Router();

// ==============================================
// PUBLIC AUTH ROUTES
// ==============================================

// Login
router.post(
  "/login",
  authController.login
);

// ==============================================
// INVITATION
// ==============================================

// Validate Invitation
router.get(
  "/invite/:token",
  authController.validateInvitation
);

// Complete Invitation
router.post(
  "/invite/:token",
  authController.completeInvitation
);

// ==============================================
// FORGOT PASSWORD
// ==============================================

// Request Password Reset
router.post(
  "/forgot-password",
  authController.forgotPassword
);

// Validate Reset Token
router.get(
  "/reset-password/:token",
  authController.validateResetToken
);

// Reset Password
router.post(
  "/reset-password/:token",
  authController.resetPassword
);

// ==============================================
// PROTECTED ROUTES
// ==============================================

// Current User
router.get(
  "/me",
  authenticate,
  authController.getCurrentUser
);

// Update Profile
router.patch(
  "/profile",
  authenticate,
  authController.updateProfile
);

// Change Password
router.patch(
  "/change-password",
  authenticate,
  authController.changePassword
);

export default router;

// import express from "express";

// import authController from "../../../controllers/auth.controller.js";

// import authenticate from "../../../middlewares/auth.middleware.js";

// const router = express.Router();

// // ==============================================
// // AUTH
// // ==============================================

// // Login
// router.post(
//   "/login",
//   authController.login
// );

// // ==============================================
// // INVITATION (PUBLIC)
// // ==============================================

// // Validate Invitation Token
// router.get(
//   "/invite/:token",
//   authController.validateInvitation
// );

// // Complete Invitation Signup
// router.post(
//   "/invite/:token",
//   authController.completeInvitation
// );

// // ==============================================
// // AUTHENTICATED ROUTES
// // ==============================================

// // Current User
// router.get(
//   "/me",
//   authenticate,
//   authController.getCurrentUser
// );

// // Update Profile
// router.patch(
//   "/profile",
//   authenticate,
//   authController.updateProfile
// );

// // Change Password
// router.patch(
//   "/change-password",
//   authenticate,
//   authController.changePassword
// );

// export default router;

// import express from "express";

// import authController from "../../../controllers/auth.controller.js";

// import authenticate from "../../../middlewares/auth.middleware.js";

// const router = express.Router();

// // ==============================================
// // AUTH
// // ==============================================

// // Login
// router.post(
//   "/login",
//   authController.login
// );

// // Get Logged In User
// router.get(
//   "/me",
//   authenticate,
//   authController.getCurrentUser
// );

// // ==============================================
// // PROFILE
// // ==============================================

// // Update Profile
// router.patch(
//   "/profile",
//   authenticate,
//   authController.updateProfile
// );

// // Change Password
// router.patch(
//   "/change-password",
//   authenticate,
//   authController.changePassword
// );

// export default router;