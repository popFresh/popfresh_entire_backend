-- AlterEnum
ALTER TYPE "ShippingProvider" ADD VALUE 'MANUAL';

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "driverName" TEXT,
ADD COLUMN     "driverPhone" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "partnerName" TEXT,
ADD COLUMN     "trackingNumber" TEXT;
