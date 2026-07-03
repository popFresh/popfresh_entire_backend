import asyncHandler from "../../middlewares/asyncHandler.js";
import {ApiResponse} from "../../utils/ApiResponse.js";

import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../../services/category/category.service.js";

import {
    createCategorySchema,
    updateCategorySchema
} from "../../validators/category.validator.js";

export const createCategoryController = asyncHandler(async (req, res) => {

    const validatedData = createCategorySchema.parse(req.body);

    const category = await createCategory(validatedData);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Category created successfully",
            category
        )
    );

});

export const getAllCategoriesController = asyncHandler(async (req, res) => {

    const categories = await getAllCategories();

    return res.json(
        new ApiResponse(
            200,
            "Categories fetched successfully",
            categories
        )
    );

});

export const getCategoryByIdController = asyncHandler(async (req, res) => {

    const category = await getCategoryById(req.params.id);

    return res.json(
        new ApiResponse(
            200,
            "Category fetched successfully",
            category
        )
    );

});

export const updateCategoryController = asyncHandler(async (req, res) => {

    const validatedData = updateCategorySchema.parse(req.body);

    const category = await updateCategory(
        req.params.id,
        validatedData
    );

    return res.json(
        new ApiResponse(
            200,
            "Category updated successfully",
            category
        )
    );

});

export const deleteCategoryController = asyncHandler(async (req, res) => {

    await deleteCategory(req.params.id);

    return res.json(
        new ApiResponse(
            200,
            "Category deleted successfully"
        )
    );

});