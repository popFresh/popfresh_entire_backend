/*
  Warnings:

  - A unique constraint covering the columns `[receipt]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpayOrderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpayPaymentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Payment_razorpayOrderId_idx";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "receipt" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "receipt" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_receipt_key" ON "Order"("receipt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");
