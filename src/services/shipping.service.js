import prisma from "../lib/prisma.js";

/**
 * Fetch shipping dashboard data.
 *
 * @param {Object} options
 * @param {Number} options.page
 * @param {Number} options.limit
 * @param {String} options.search
 * @param {String} options.status
 */

export const getShippingDashboard = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
}) => {

    const skip = (page - 1) * limit;

    // =====================================================
    // Search & Filters
    // =====================================================

    const where = {};

    if (status) {
        where.status = status;
    }

    if (search) {

        where.OR = [

            {
                awbCode: {
                    contains: search,
                    mode: "insensitive",
                },
            },

            {
                shiprocketOrderId: {
                    contains: search,
                    mode: "insensitive",
                },
            },

            {
                order: {

                    OR: [

                        {
                            receipt: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },

                        {
                            shippingName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },

                        {
                            shippingPhone: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },

                    ],

                },

            },

        ];

    }

    // =====================================================
    // Shipment Statistics
    // =====================================================

    const [

        total,

        awbAssigned,

        pickupScheduled,

        inTransit,

        outForDelivery,

        delivered,

        cancelled,

    ] = await Promise.all([

        prisma.shipment.count(),

        prisma.shipment.count({
            where: {
                status: "AWB_ASSIGNED",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "PICKUP_SCHEDULED",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "IN_TRANSIT",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "OUT_FOR_DELIVERY",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "DELIVERED",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "CANCELLED",
            },
        }),

    ]);

    // =====================================================
    // Shipment List
    // =====================================================

    const shipments = await prisma.shipment.findMany({

        where,

        skip,

        take: limit,

        orderBy: {
            createdAt: "desc",
        },

        include: {

            order: {

                select: {

                    id: true,

                    receipt: true,

                    shippingName: true,

                    shippingPhone: true,

                    total: true,

                    status: true,

                    createdAt: true,

                },

            },

        },

    });

    // =====================================================
    // Pagination
    // =====================================================

    const totalShipments =
        await prisma.shipment.count({
            where,
        });

    return {

        stats: {

            total,

            awbAssigned,

            pickupScheduled,

            inTransit,

            outForDelivery,

            delivered,

            cancelled,

        },

        shipments,

        pagination: {

            page,

            limit,

            total: totalShipments,

            totalPages: Math.ceil(
                totalShipments / limit
            ),

        },

    };

};