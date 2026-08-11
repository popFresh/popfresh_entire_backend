import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  createComboConfig,
  getAllComboConfigs,
  getActiveComboConfigs,
  getComboConfigByPackSize,
  updateComboConfig,
  deleteComboConfig,
} from "../services/comboConfig.service.js";

import {
  createComboConfigSchema,
  updateComboConfigSchema,
} from "../validators/comboConfig.validator.js";


// ==============================================
// CREATE COMBO CONFIG
// ==============================================

export const createComboConfigController = asyncHandler(
  async (req, res) => {
    const validatedData =
      createComboConfigSchema.parse(req.body);

    const comboConfig =
      await createComboConfig(validatedData);

    return res.status(201).json(
      new ApiResponse(
        201,
        "Combo configuration created successfully.",
        comboConfig
      )
    );
  }
);


// ==============================================
// GET ALL COMBO CONFIGS
// ==============================================

export const getAllComboConfigsController = asyncHandler(
  async (req, res) => {
    const comboConfigs =
      await getAllComboConfigs();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Combo configurations fetched successfully.",
        comboConfigs
      )
    );
  }
);


// ==============================================
// GET ACTIVE COMBO CONFIGS
// ==============================================

export const getActiveComboConfigsController = asyncHandler(
  async (req, res) => {
    const comboConfigs =
      await getActiveComboConfigs();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Active combo configurations fetched successfully.",
        comboConfigs
      )
    );
  }
);


// ==============================================
// GET COMBO CONFIG BY PACK SIZE
// ==============================================

export const getComboConfigByPackSizeController =
  asyncHandler(async (req, res) => {
    const comboConfig =
      await getComboConfigByPackSize(
        req.params.packSize
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Combo configuration fetched successfully.",
        comboConfig
      )
    );
  });


// ==============================================
// UPDATE COMBO CONFIG
// ==============================================

export const updateComboConfigController = asyncHandler(
  async (req, res) => {
    const validatedData =
      updateComboConfigSchema.parse(req.body);

    const comboConfig =
      await updateComboConfig(
        req.params.packSize,
        validatedData
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Combo configuration updated successfully.",
        comboConfig
      )
    );
  }
);


// ==============================================
// DELETE COMBO CONFIG
// ==============================================

export const deleteComboConfigController = asyncHandler(
  async (req, res) => {
    await deleteComboConfig(
      req.params.packSize
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Combo configuration deleted successfully."
      )
    );
  }
);


