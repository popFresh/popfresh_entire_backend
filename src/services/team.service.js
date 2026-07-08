// src/services/team.service.js

import crypto from "crypto";

import prisma from "../lib/prisma.js";
import { sendInvitationEmail } from "./email/invitationEmail.service.js";
// ==============================================
// INVITE TEAM MEMBER
// ==============================================

export const inviteMember = async (
  invitedById,
  {
    name,
    email,
    role,
  }
) => {
  // ==========================================
  // Remove Expired Invitations
  // ==========================================

  await prisma.invitation.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  // ==========================================
  // Check if Admin Already Exists
  // ==========================================

  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    const error = new Error(
      "A user with this email already exists."
    );
    error.statusCode = 409;
    throw error;
  }

  // ==========================================
  // Check Existing Pending Invitation
  // ==========================================

  const existingInvitation =
    await prisma.invitation.findFirst({
      where: {
        email,
      },
    });

  if (existingInvitation) {
    const error = new Error(
      "An invitation has already been sent to this email."
    );
    error.statusCode = 409;
    throw error;
  }

  // ==========================================
  // Generate Secure Token
  // ==========================================

  const token = crypto
    .randomBytes(32)
    .toString("hex");

  // ==========================================
  // Set Expiry (24 Hours)
  // ==========================================

  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  // ==========================================
  // Create Invitation
  // ==========================================

  const invitation =
  await prisma.invitation.create({
    data: {
      name,
      email,
      role,
      token,
      invitedById,
      expiresAt,
    },
  });

// Send Invitation Email

await sendInvitationEmail({
  name: invitation.name,
  email: invitation.email,
  role: invitation.role,
  token: invitation.token,
});

return invitation;
};

// ==============================================
// GET TEAM DASHBOARD
// ==============================================

export const getTeamDashboard = async () => {
  const [members, pendingInvitations] =
    await Promise.all([
      prisma.admin.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      prisma.invitation.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          expiresAt: true,
          createdAt: true,

          invitedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

  return {
    members,
    pendingInvitations,
  };
};

// ==============================================
// DELETE INVITATION
// ==============================================

export const deleteInvitation = async (
  invitationId
) => {
  const invitation =
    await prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
    });

  if (!invitation) {
    const error = new Error(
      "Invitation not found."
    );
    error.statusCode = 404;
    throw error;
  }

  const deletedInvitation =
    await prisma.invitation.delete({
      where: {
        id: invitationId,
      },
    });

  return deletedInvitation;
};

// ==============================================
// RESEND INVITATION
// ==============================================

export const resendInvitation = async (
  invitationId
) => {
  const invitation =
    await prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
    });

  if (!invitation) {
    const error = new Error(
      "Invitation not found."
    );
    error.statusCode = 404;
    throw error;
  }

  // Generate a new secure token

  const token = crypto
    .randomBytes(32)
    .toString("hex");

  // Extend expiry by another 24 hours

  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  const updatedInvitation =
  await prisma.invitation.update({
    where: {
      id: invitationId,
    },
    data: {
      token,
      expiresAt,
    },
  });

// Send New Invitation Email

await sendInvitationEmail({
  name: updatedInvitation.name,
  email: updatedInvitation.email,
  role: updatedInvitation.role,
  token: updatedInvitation.token,
});

return updatedInvitation;
};


// ==============================================
// REMOVE TEAM MEMBER
// ==============================================

export const removeMember = async (
  memberId,
  currentUserId
) => {

  const member = await prisma.admin.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) {
    const error = new Error(
      "Team member not found."
    );
    error.statusCode = 404;
    throw error;
  }

  // Prevent deleting yourself
  if (member.id === currentUserId) {
    const error = new Error(
      "You cannot remove your own account."
    );
    error.statusCode = 400;
    throw error;
  }

  await prisma.admin.delete({
    where: {
      id: memberId,
    },
  });

  return true;
};