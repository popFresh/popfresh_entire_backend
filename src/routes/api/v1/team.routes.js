// src/routes/api/v1/team.routes.js

import { Router } from "express";

import authenticate from "../../../middlewares/auth.middleware.js";

import {
  getTeamDashboardController,
  inviteMemberController,
  deleteInvitationController,
  resendInvitationController,
  removeMemberController
} from "../../../controllers/team.controller.js";

const router = Router();

// ==============================================
// Protect All Team Routes
// ==============================================

router.use(authenticate);

// ==============================================
// GET TEAM DASHBOARD
// GET /api/v1/team
// ==============================================

router.get(
  "/",
  getTeamDashboardController
);

// ==============================================
// INVITE TEAM MEMBER
// POST /api/v1/team/invite
// ==============================================

router.post(
  "/invite",
  inviteMemberController
);



// ==============================================
// RESEND INVITATION
// POST /api/v1/team/invite/:id/resend
// ==============================================

router.post(
  "/invite/:id/resend",
  resendInvitationController
);
// ==============================================
// DELETE INVITATION
// DELETE /api/v1/team/invite/:id
// ==============================================

router.delete(
  "/invite/:id",
  deleteInvitationController
);

router.delete(
  "/:id",
  authenticate,
  removeMemberController
);
export default router;