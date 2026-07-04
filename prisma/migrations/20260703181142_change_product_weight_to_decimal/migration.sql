/*
  Warnings:

  - The `weight` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "weight",
ADD COLUMN     "weight" DECIMAL(10,2);
