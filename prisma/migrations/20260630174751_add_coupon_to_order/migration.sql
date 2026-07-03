-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "discount" DECIMAL(65,30) NOT NULL DEFAULT 0;
