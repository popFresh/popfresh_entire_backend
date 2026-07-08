// src/controllers/team.controller.js

import asyncHandler from "../middlewares/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import {
  inviteMember,
  getTeamDashboard,
  deleteInvitation,
  resendInvitation,
  removeMember as removeMemberService,
} from "../services/team.service.js";

import {
  inviteMemberSchema,
} from "../validators/team.validator.js";

// ==============================================
// GET TEAM DASHBOARD
// GET /api/v1/team
// ==============================================

export const getTeamDashboardController =
  asyncHandler(async (req, res) => {

    const team =
      await getTeamDashboard();

    return res.status(200).json(

      new ApiResponse(
        200,
        "Team fetched successfully.",
        team
      )

    );

  });

// ==============================================
// INVITE TEAM MEMBER
// POST /api/v1/team/invite
// ==============================================

export const inviteMemberController =
  asyncHandler(async (req, res) => {

    const validatedData =
      inviteMemberSchema.parse(req.body);

    const invitation =
      await inviteMember(
        req.user.id,
        validatedData
      );

    return res.status(201).json(

      new ApiResponse(
        201,
        "Invitation created successfully.",
        invitation
      )

    );

  });

// ==============================================
// DELETE INVITATION
// DELETE /api/v1/team/invite/:id
// ==============================================

export const deleteInvitationController =
  asyncHandler(async (req, res) => {

    const invitation =
      await deleteInvitation(
        req.params.id
      );

    return res.status(200).json(

      new ApiResponse(
        200,
        "Invitation deleted successfully.",
        invitation
      )

    );

  });


  // ==============================================
// RESEND INVITATION
// POST /api/v1/team/invite/:id/resend
// ==============================================

export const resendInvitationController =
  asyncHandler(async (req, res) => {

    const invitation =
      await resendInvitation(
        req.params.id
      );

    return res.status(200).json(

      new ApiResponse(
        200,
        "Invitation resent successfully.",
        invitation
      )

    );

  });
  

  // ==============================================
// REMOVE MEMBER
// DELETE /api/v1/team/:id
// ==============================================

export const removeMemberController =
  asyncHandler(async (req, res) => {

    await removeMemberService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json(

      new ApiResponse(
        200,
        "Team member removed successfully."
      )

    );

  });