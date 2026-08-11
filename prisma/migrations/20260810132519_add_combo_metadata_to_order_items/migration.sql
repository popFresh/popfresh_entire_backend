-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "comboPackSize" INTEGER,
ADD COLUMN     "isCombo" BOOLEAN NOT NULL DEFAULT false;
