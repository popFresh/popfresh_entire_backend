import prisma from "../../lib/prisma.js";
import ApiError from "../../utils/ApiError.js";

export const createCategory = async (data) => {

    const existingCategory = await prisma.category.findFirst({
        where: {
            OR: [
                { name: data.name },
                { slug: data.slug }
            ]
        }
    });

    if (existingCategory) {
        throw new ApiError(409, "Category already exists");
    }

    return prisma.category.create({
        data
    });

};

export const getAllCategories = async () => {

    return prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

};

export const getCategoryById = async (id) => {

    const category = await prisma.category.findUnique({
        where: {
            id
        }
    });

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return category;

};

export const updateCategory = async (id, data) => {

    await getCategoryById(id);

    return prisma.category.update({
        where: { id },
        data
    });

};

export const deleteCategory = async (id) => {

    await getCategoryById(id);

    return prisma.category.delete({
        where: { id }
    });

};

