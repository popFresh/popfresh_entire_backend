/*
  Warnings:

  - You are about to drop the column `courierName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `trackingUrl` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('NOT_CREATED', 'CREATED', 'AWB_ASSIGNED', 'LABEL_GENERATED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RTO');

-- CreateEnum
CREATE TYPE "ShippingProvider" AS ENUM ('SHIPROCKET');

-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('CREATED', 'AWB_ASSIGNED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RTO');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "courierName",
DROP COLUMN "trackingNumber",
DROP COLUMN "trackingUrl";

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "ShippingProvider" NOT NULL DEFAULT 'SHIPROCKET',
    "status" "ShipmentStatus" NOT NULL DEFAULT 'NOT_CREATED',
    "shiprocketOrderId" TEXT,
    "shiprocketShipmentId" TEXT,
    "awbCode" TEXT,
    "courierCompanyId" INTEGER,
    "courierName" TEXT,
    "trackingUrl" TEXT,
    "shippingCharge" DECIMAL(10,2),
    "estimatedDeliveryDate" TIMESTAMP(3),
    "labelUrl" TEXT,
    "invoiceUrl" TEXT,
    "manifestUrl" TEXT,
    "pickupScheduled" BOOLEAN NOT NULL DEFAULT false,
    "pickupDate" TIMESTAMP(3),
    "rawResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentTracking" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" "TrackingStatus" NOT NULL,
    "location" TEXT,
    "remarks" TEXT,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentWebhook" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_orderId_key" ON "Shipment"("orderId");

-- CreateIndex
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");

-- CreateIndex
CREATE INDEX "ShipmentTracking_shipmentId_idx" ON "ShipmentTracking"("shipmentId");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentTracking" ADD CONSTRAINT "ShipmentTracking_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
