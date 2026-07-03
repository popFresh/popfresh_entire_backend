import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

// GENERATE UNIQUE SLUG

const generateUniqueSlug = async (name) => {

  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  let slug = baseSlug;

  let counter = 2;

  while (true) {

    const existing = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;

    counter++;

  }

};



// ===============================================
// CREATE PRODUCT
// ===============================================



export const createProduct = async (data) => {

    // 1. Generate slug automatically
    const slug = await generateUniqueSlug(data.name);
    // 2. Check SKU

    const existingSku = await prisma.product.findUnique({
        where: {
            sku: data.sku,
        },
    });

    if (existingSku) {
        throw new ApiError(409, "SKU already exists.");
    }

    

    // 3. Check Category

    const category = await prisma.category.findUnique({
        where: {
            id: data.categoryId,
        },
    });

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    // 4. Create Product

    const product = await prisma.product.create({

        data: {

  name: data.name,

  slug,

  sku: data.sku,

  description: data.description,

  price: data.price,

  discountPrice: data.discountPrice,

  stock: data.stock,

  weight: data.weight,

  categoryId: data.categoryId,

  isFeatured: data.isFeatured,

  isActive: data.isActive,

  // ==========================
  // DISPLAY SETTINGS
  // ==========================

  badge: data.badge || null,

  cardTheme: data.cardTheme || "GREEN",

  highlights: data.highlights || [],

  displayOrder: data.displayOrder || 0,

},
        include: {
            category: true,
        },

    });

    return product;
};
// ===============================================
// GET ALL PRODUCTS
// ===============================================

export const getAllProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  featured,
  sort = "newest",
  isAdmin,
}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  // ------------------------
  // WHERE CLAUSE
  // ------------------------

  const where = {};

if (isAdmin !== "true") {
  where.isActive = true;
}

  // Search by name or description
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Category filter using slug
  if (category) {
    where.category = {
      slug: category,
    };
  }

  // Featured filter
  if (featured === "true") {
    where.isFeatured = true;
  }

  // ------------------------
  // SORTING
  // ------------------------

  let orderBy = {
    createdAt: "desc",
  };

  switch (sort) {
    case "oldest":
      orderBy = {
        createdAt: "asc",
      };
      break;

    case "price_asc":
      orderBy = {
        price: "asc",
      };
      break;

    case "price_desc":
      orderBy = {
        price: "desc",
      };
      break;

    case "newest":
    default:
      orderBy = {
        createdAt: "desc",
      };
  }

  // ------------------------
  // DATABASE CALLS
  // ------------------------

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,

      include: {
        category: true,
        images: true,
      },

      skip,

      take: limit,

      orderBy,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,

    pagination: {
      page,

      limit,

      totalProducts,

      totalPages: Math.ceil(totalProducts / limit),
    },
  };
};



// ===============================================
// GET PRODUCT BY ID
// ===============================================

export const getProductById = async (id) => {

    const product = await prisma.product.findUnique({

        where: {

            id

        },

        include: {

            category: true,

            images: true

        }

    });

    if (!product) {

        throw new ApiError(404, "Product not found.");

    }

    return product;

};



//GET PRODUCT BY ID - PUBLIC

export const getPublicProductById = async (id) => {

    const product = await prisma.product.findFirst({

        where: {
            id,
            isActive: true,
        },

        include: {
            category: true,
            images: true,
        },

    });

    if (!product) {

        throw new ApiError(
            404,
            "Product not found."
        );

    }

    return product;

};

// ===============================================
// UPDATE PRODUCT
// ===============================================

export const updateProduct = async (id, data) => {

    await getProductById(id);

    if (data.categoryId) {

        const category = await prisma.category.findUnique({

            where: {

                id: data.categoryId

            }

        });

        if (!category) {

            throw new ApiError(404, "Category not found.");

        }

    }

    const updatedProduct = await prisma.product.update({

  where: {

    id,

  },

  data: {

    ...data,

    badge: data.badge,

    cardTheme: data.cardTheme,

    highlights: data.highlights,

    displayOrder: data.displayOrder,

  },

  include: {

    category: true,

    images: true,

  },

});

    return updatedProduct;

};




// ===============================================
// DELETE PRODUCT
// ===============================================

export const deleteProduct = async (id) => {

    await getProductById(id);

    await prisma.product.delete({

        where: {

            id

        }

    });

};

// ===============================================
// GET PRODUCT BY SLUG
// ===============================================

export const getProductBySlug = async (slug) => {

    const product = await prisma.product.findFirst({
  where: {
    slug,
    isActive: true,
  },
  include: {
    category: true,
    images: true,
  },
});

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    return product;

};

// ===============================================
// TOGGLE FEATURED
// ===============================================

export const updateFeaturedStatus = async (id, isFeatured) => {

    await getProductById(id);

    return prisma.product.update({

        where: {
            id
        },

        data: {
            isFeatured
        }

    });

};

// ===============================================
// TOGGLE ACTIVE STATUS
// ===============================================

export const updateProductStatus = async (id, isActive) => {

    await getProductById(id);

    return prisma.product.update({

        where: {
            id
        },

        data: {
            isActive
        }

    });

};

// ===============================================
// UPDATE STOCK
// ===============================================

export const updateProductStock = async (id, stock) => {

    await getProductById(id);

    if (stock < 0) {
        throw new ApiError(400, "Stock cannot be negative.");
    }

    return prisma.product.update({

        where: {
            id
        },

        data: {
            stock
        }

    });

};

