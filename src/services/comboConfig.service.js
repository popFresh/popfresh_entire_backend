import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

// ==============================================
// CREATE COMBO CONFIG
// ==============================================

export const createComboConfig = async (data) => {
  const existing = await prisma.comboConfig.findUnique({
    where: {
      packSize: data.packSize,
    },
  });

  if (existing) {
    throw new ApiError(
      409,
      `Pack of ${data.packSize} already exists.`
    );
  }

  const comboConfig = await prisma.comboConfig.create({
    data: {
      packSize: data.packSize,

      price: data.price,

      discountPrice: data.discountPrice ?? null,

      isActive: data.isActive ?? true,
    },
  });

  return comboConfig;
};

// ==============================================
// GET ALL COMBO CONFIGS
// ==============================================

export const getAllComboConfigs = async () => {
  return prisma.comboConfig.findMany({
    orderBy: {
      packSize: "asc",
    },
  });
};

// ==============================================
// GET ACTIVE COMBO CONFIGS
// ==============================================

export const getActiveComboConfigs = async () => {
  return prisma.comboConfig.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      packSize: "asc",
    },
  });
};

// ==============================================
// GET COMBO CONFIG BY PACK SIZE
// ==============================================

export const getComboConfigByPackSize = async (packSize) => {
  const comboConfig = await prisma.comboConfig.findUnique({
    where: {
      packSize: Number(packSize),
    },
  });

  if (!comboConfig) {
    throw new ApiError(
      404,
      `Pack of ${packSize} configuration not found.`
    );
  }

  return comboConfig;
};

// ==============================================
// UPDATE COMBO CONFIG
// ==============================================

export const updateComboConfig = async (packSize, data) => {
  await getComboConfigByPackSize(packSize);

  const comboConfig = await prisma.comboConfig.update({
    where: {
      packSize: Number(packSize),
    },

    data: {
      ...(data.price !== undefined && {
        price: data.price,
      }),

      ...(data.discountPrice !== undefined && {
        discountPrice: data.discountPrice,
      }),

      ...(data.isActive !== undefined && {
        isActive: data.isActive,
      }),
    },
  });

  return comboConfig;
};

// ==============================================
// DELETE COMBO CONFIG
// ==============================================

export const deleteComboConfig = async (packSize) => {
  await getComboConfigByPackSize(packSize);

  await prisma.comboConfig.delete({
    where: {
      packSize: Number(packSize),
    },
  });
};