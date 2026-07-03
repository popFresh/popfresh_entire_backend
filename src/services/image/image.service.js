import { Readable } from "stream";
import cloudinary from "../../config/cloudinary.js";
import prisma from "../../lib/prisma.js";
import ApiError from "../../utils/ApiError.js";

// ======================================================
// Upload Single Image to Cloudinary
// ======================================================

export const uploadImageToCloudinary = (
  fileBuffer,
  folder = "popfresh"
) => {

  return new Promise((resolve, reject) => {

    console.log("🚀 Starting upload to Cloudinary...");

    const uploadStream = cloudinary.uploader.upload_stream(

      {
        folder,
        resource_type: "image",
      },

      (error, result) => {

        if (error) {

          console.error("❌ Cloudinary Error:", error);

          return reject(error);

        }

        console.log(
          "✅ Uploaded Successfully:",
          result.public_id
        );

        resolve(result);

      }

    );

    uploadStream.on("error", (err) => {

      console.error("❌ Stream Error:", err);

      reject(err);

    });

    Readable.from(fileBuffer).pipe(uploadStream);

  });

};

// ======================================================
// Upload Multiple Images
// ======================================================

export const saveProductImages = async (
  productId,
  files
) => {

  console.log("================================");
  console.log("📦 Product:", productId);
  console.log("📸 Files Received:", files?.length);
  console.log("================================");

  const product = await prisma.product.findUnique({

    where: {
      id: productId,
    },

  });

  if (!product) {

    throw new ApiError(
      404,
      "Product not found."
    );

  }

  const uploadedImages = [];

for (const [index, file] of files.entries()) {

  console.log(
    `\n📤 Uploading Image ${index + 1}:`,
    file.originalname
  );

  try {

    const result = await uploadImageToCloudinary(
      file.buffer
    );

    console.log(
      "☁️ Cloudinary Public ID:",
      result.public_id
    );

    const image = await prisma.productImage.create({

      data: {

        imageUrl: result.secure_url,

        publicId: result.public_id,

        productId,

      },

    });

    console.log(
      "💾 Saved in Database:",
      image.id
    );

    uploadedImages.push(image);

  } catch (error) {

    console.error(
      `❌ Failed to upload ${file.originalname}:`,
      error
    );

    // Stop immediately if any image fails
    throw error;

  }

}


console.log("\n🎉 Upload Completed");

console.log(
  "Images Saved:",
  uploadedImages.length
);

return uploadedImages;
}

// ======================================================
// Delete Product Image
// ======================================================

export const deleteProductImage = async (
  imageId
) => {

  const image =
    await prisma.productImage.findUnique({

      where: {
        id: imageId,
      },

    });

  if (!image) {

    throw new ApiError(
      404,
      "Image not found."
    );

  }

  console.log(
    "🗑️ Deleting:",
    image.publicId
  );

  await cloudinary.uploader.destroy(
    image.publicId
  );

  await prisma.productImage.delete({

    where: {
      id: imageId,
    },

  });

  console.log("✅ Image Deleted");

  return {

    message:
      "Image deleted successfully.",

  };

};