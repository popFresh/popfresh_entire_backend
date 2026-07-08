// src/services/auth.service.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import prisma from "../lib/prisma.js";
import { sendPasswordResetEmail } from "./email/passwordResetEmail.service.js";

// ==============================================
// LOGIN
// ==============================================

const login = async ({ email, password }) => {
  const admin = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  if (!admin) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    admin.password
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return {
    token,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    },
  };
};

// ==============================================
// GET CURRENT USER
// ==============================================

const getCurrentUser = async (userId) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!admin) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return admin;
};


// ==============================================
// VALIDATE INVITATION
// ==============================================

const validateInvitation = async (token) => {
  const invitation = await prisma.invitation.findUnique({
  where: {
    token,
  },
  include: {
    invitedBy: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
});

  if (!invitation) {
    const error = new Error("Invalid invitation link.");
    error.statusCode = 404;
    throw error;
  }

  if (invitation.expiresAt < new Date()) {
    const error = new Error("Invitation has expired.");
    error.statusCode = 410;
    throw error;
  }

  return {
    name: invitation.name,
    email: invitation.email,
    role: invitation.role,

    expiresAt: invitation.expiresAt,
    invitedBy: invitation.invitedBy,
  };
};

// ==============================================
// COMPLETE INVITATION
// ==============================================

const completeInvitation = async (
  token,
  password
) => {

  const invitation = await prisma.invitation.findUnique({
    where: {
      token,
    },
  });

  if (!invitation) {
    const error = new Error("Invalid invitation link.");
    error.statusCode = 404;
    throw error;
  }

  if (invitation.expiresAt < new Date()) {
    const error = new Error("Invitation has expired.");
    error.statusCode = 410;
    throw error;
  }

  // Check if account already exists

  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email: invitation.email,
    },
  });

  if (existingAdmin) {
    const error = new Error(
      "An account with this email already exists."
    );
    error.statusCode = 409;
    throw error;
  }

  // Hash password

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  // Create Admin & Delete Invitation

  const admin = await prisma.$transaction(
    async (tx) => {

      const createdAdmin =
        await tx.admin.create({
          data: {
            name: invitation.name,
            email: invitation.email,
            role: invitation.role,
            password: hashedPassword,
          },
        });

      await tx.invitation.delete({
        where: {
          id: invitation.id,
        },
      });

      return createdAdmin;

    }
  );

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
};

// ==============================================
// FORGOT PASSWORD
// ==============================================

const forgotPassword = async (email) => {

  const admin = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  // Don't reveal whether the account exists

  if (!admin) {
    return;
  }

  // Delete previous reset links

  await prisma.passwordReset.deleteMany({
    where: {
      adminId: admin.id,
    },
  });

  // Generate secure token

  const token = randomBytes(32).toString("hex");

  // Expires in 30 minutes

  const expiresAt = new Date(
    Date.now() + 30 * 60 * 1000
  );

  // Save token

  await prisma.passwordReset.create({
    data: {
      token,
      adminId: admin.id,
      expiresAt,
    },
  });

  // Send email

  await sendPasswordResetEmail({
    name: admin.name,
    email: admin.email,
    token,
  });

};

// ==============================================
// VALIDATE RESET TOKEN
// ==============================================

const validateResetToken = async (token) => {

  const passwordReset =
    await prisma.passwordReset.findUnique({
      where: {
        token,
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

  if (!passwordReset) {
    const error = new Error(
      "Invalid password reset link."
    );
    error.statusCode = 404;
    throw error;
  }

  if (passwordReset.expiresAt < new Date()) {

    await prisma.passwordReset.delete({
      where: {
        id: passwordReset.id,
      },
    });

    const error = new Error(
      "Password reset link has expired."
    );
    error.statusCode = 410;
    throw error;
  }

  return {
    name: passwordReset.admin.name,
    email: passwordReset.admin.email,
  };

};

// ==============================================
// RESET PASSWORD
// ==============================================

const resetPassword = async (
  token,
  password
) => {

  const passwordReset =
    await prisma.passwordReset.findUnique({
      where: {
        token,
      },
      include: {
        admin: true,
      },
    });

  if (!passwordReset) {
    const error = new Error(
      "Invalid password reset link."
    );
    error.statusCode = 404;
    throw error;
  }

  if (passwordReset.expiresAt < new Date()) {

    await prisma.passwordReset.delete({
      where: {
        id: passwordReset.id,
      },
    });

    const error = new Error(
      "Password reset link has expired."
    );
    error.statusCode = 410;
    throw error;
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {

    await tx.admin.update({
      where: {
        id: passwordReset.adminId,
      },
      data: {
        password: hashedPassword,
      },
    });

    await tx.passwordReset.delete({
      where: {
        id: passwordReset.id,
      },
    });

  });

  return true;

};

// ==============================================
// UPDATE PROFILE
// ==============================================

const updateProfile = async (userId, data) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingAdmin) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const emailExists = await prisma.admin.findFirst({
    where: {
      email: data.email,
      NOT: {
        id: userId,
      },
    },
  });

  if (emailExists) {
    const error = new Error("Email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const updatedAdmin = await prisma.admin.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedAdmin;
};

// ==============================================
// CHANGE PASSWORD
// ==============================================

const changePassword = async (
  userId,
  {
    currentPassword,
    newPassword,
  }
) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id: userId,
    },
  });

  if (!admin) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isCurrentPasswordValid =
    await bcrypt.compare(
      currentPassword,
      admin.password
    );

  if (!isCurrentPasswordValid) {
    const error = new Error(
      "Current password is incorrect."
    );
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword =
    await bcrypt.hash(newPassword, 10);

  await prisma.admin.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    success: true,
  };
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