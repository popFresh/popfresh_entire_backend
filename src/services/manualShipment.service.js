import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";


import { emitOrderUpdated,emitDashboardUpdate } from "../socket/events.js";

import orderNotificationService from "./notification/orderNotification.service.js";
// ==========================================
// CREATE MANUAL SHIPMENT
// ==========================================

export const createManualShipment = async (orderId, data) => {
  const {
    partnerName,
    driverName,
    driverPhone,
    trackingNumber,
    notes,
  } = data;

  // ==========================================
  // CHECK ORDER EXISTS
  // ==========================================

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  // ==========================================
  // ORDER MUST BE PACKED
  // ==========================================

  if (order.status !== "PACKED") {
    throw new ApiError(
      400,
      "Manual shipment can only be created for packed orders."
    );
  }

  // ==========================================
  // CHECK IF SHIPMENT ALREADY EXISTS
  // ==========================================

  const existingShipment = await prisma.shipment.findUnique({
    where: {
      orderId,
    },
  });

  if (existingShipment) {
    throw new ApiError(
      400,
      "Shipment already exists for this order."
    );
  }

  // ==========================================
  // CREATE MANUAL SHIPMENT
  // ==========================================

const shipment = await prisma.$transaction(async (tx) => {

  // ==========================================
  // CREATE MANUAL SHIPMENT
  // ==========================================

  const shipment = await tx.shipment.create({

    data: {
      orderId,

      provider: "MANUAL",
      status: "CREATED",

      partnerName,
      driverName,
      driverPhone,
      trackingNumber,
      notes,
    },

    include: {
      order: true,
    },
  });



  // ==========================================
  // UPDATE ORDER -> SHIPPED
  // ==========================================

  await tx.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "SHIPPED",
      shippedAt: new Date(),
    },
  });

  // ==========================================
  // ORDER HISTORY
  // ==========================================

  await tx.orderStatusHistory.create({
    data: {
      orderId,
      status: "SHIPPED",
      note: "Manual shipment created.",
    },
  });

  return shipment;

});
const updatedOrder = await prisma.order.findUnique({
  where: {
    id: orderId,
  },
  include: {
    customer: true,
    payment: true,
    shipment: {
      include: {
        trackingHistory: {
          orderBy: {
            eventTime: "asc",
          },
        },
      },
    },
    statusHistory: {
      orderBy: {
        createdAt: "asc",
      },
    },
    orderItems: {
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    },
  },
});

emitOrderUpdated(updatedOrder);
emitDashboardUpdate();

return shipment;

};

// ==========================================
// MARK MANUAL SHIPMENT OUT FOR DELIVERY
// ==========================================

export const markManualShipmentOutForDelivery = async (
  orderId,
  data
) => {

  // ==========================================
  // CHECK ORDER & SHIPMENT
  // ==========================================

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },

    include: {
      shipment: true,
      customer : true
    },
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  const shipment = order.shipment;

  if (!shipment) {
    throw new ApiError(
      404,
      "Shipment not found."
    );
  }

  // ==========================================
  // VALIDATIONS
  // ==========================================

  if (shipment.provider !== "MANUAL") {
    throw new ApiError(
      400,
      "This is not a manual shipment."
    );
  }

  if (shipment.status !== "CREATED") {
    throw new ApiError(
      400,
      "Shipment is not eligible for Out For Delivery."
    );
  }



 if (order.status !== "SHIPPED") {
  throw new ApiError(
    400,
    "Only shipped orders can be marked Out For Delivery."
  );
}


  // ==========================================
  // TRANSACTION
  // ==========================================

 const updatedShipment = await prisma.$transaction(async (tx) => {

  // ==========================================
  // UPDATE ORDER
  // ==========================================

  await tx.order.update({

    where: {
      id: orderId,
    },

    data: {
      status: "OUT_FOR_DELIVERY",
      outForDeliveryAt: new Date(),
    },

  });

  // ==========================================
  // UPDATE SHIPMENT
  // ==========================================

  const shipment = await tx.shipment.update({

    where: {
      orderId,
    },

    data: {
      status: "OUT_FOR_DELIVERY",
    },

    include: {
      order: true,
    },

  });

  // ==========================================
  // ORDER HISTORY
  // ==========================================

  await tx.orderStatusHistory.create({

    data: {

      orderId,

      status: "OUT_FOR_DELIVERY",

      note:
        data?.notes ||
        "Manual shipment marked as Out For Delivery.",

    },

  });

  return shipment;

});

  try {

  await orderNotificationService.sendOutForDelivery({
    order: updatedShipment.order,
    customer: order.customer,
  });

} catch (error) {

  console.error(
    "Out For Delivery notification failed:",
    error.response?.data || error.message
  );

}



const updatedOrder = await prisma.order.findUnique({
  where: {
    id: orderId,
  },
  include: {
    customer: true,
    payment: true,
    shipment: {
      include: {
        trackingHistory: {
          orderBy: {
            eventTime: "asc",
          },
        },
      },
    },
    statusHistory: {
      orderBy: {
        createdAt: "asc",
      },
    },
    orderItems: {
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    },
  },
});

emitOrderUpdated(updatedOrder);
emitDashboardUpdate();




return updatedShipment;

};




// ==========================================
// MARK MANUAL SHIPMENT DELIVERED
// ==========================================


export const markManualShipmentDelivered = async (
  orderId,
  data
) => {

  const order = await prisma.order.findUnique({

    where: {
      id: orderId,
    },

    include: {
      customer: true,
      shipment: true,
    },

  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  const shipment = order.shipment;

  if (!shipment) {
    throw new ApiError(
      404,
      "Shipment not found."
    );
  }

  if (shipment.provider !== "MANUAL") {
    throw new ApiError(
      400,
      "This is not a manual shipment."
    );
  }

  if (shipment.status !== "OUT_FOR_DELIVERY") {
    throw new ApiError(
      400,
      "Shipment is not Out For Delivery."
    );
  }

  if (order.status !== "OUT_FOR_DELIVERY") {
    throw new ApiError(
      400,
      "Order is not Out For Delivery."
    );
  }

  const updatedShipment = await prisma.$transaction(
    async (tx) => {

      await tx.order.update({

        where: {
          id: orderId,
        },
        data: {
          status: "DELIVERED",
          deliveredAt: new Date(),
        },
      });

      const shipment = await tx.shipment.update({
        where: {
          orderId,
        },
        data: {
          status: "DELIVERED",
        },
        include: {
          order: true,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: "DELIVERED",
          note:
            data?.notes ||
            "Manual shipment marked as Delivered.",
        },
      });

      return shipment;
    }

  );

  try {

    await orderNotificationService.sendOrderDelivered({
      order: updatedShipment.order,
      customer: order.customer,

    });

  } catch (error) {

    console.error(
      "Order delivered notification failed:",
      error.response?.data || error.message
    );

  }


  const updatedOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      customer: true,
      payment: true,
      shipment: {
        include: {
          trackingHistory: {
            orderBy: {
              eventTime: "asc",
            },
          },
        },
      },
      statusHistory: {
        orderBy: {
          createdAt: "asc",
        },
      },
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  emitOrderUpdated(updatedOrder);
  emitDashboardUpdate();

  return updatedShipment;

};



