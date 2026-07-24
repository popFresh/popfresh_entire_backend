import prisma from "../lib/prisma.js";
import { validateShiprocketWebhook } from "../validators/shiprocketWebhook.validator.js";
import { updateOrderStatusInternal,handleOrderStatusSideEffects } from "./order.service.js";
import {
  emitOrderUpdated,
  emitDashboardUpdate,
} from "../socket/events.js";
// If you later refactor updateOrderStatus into a reusable function,
// import it here instead of duplicating logic.
// import { updateOrderStatusInternal } from "./order.service.js";

import techService from "./tech.service.js";

const SHIPROCKET_STATUS_MAP = {
  "AWB ASSIGNED": {
    shipment: "AWB_ASSIGNED",
    tracking: "AWB_ASSIGNED",
    order: "PACKED",
  },

  "PICKUP SCHEDULED": {
    shipment: "PICKUP_SCHEDULED",
    tracking: "PICKUP_SCHEDULED",
    order: "PACKED",
  },

  "PICKED UP": {
    shipment: "PICKED_UP",
    tracking: "PICKED_UP",
    order: "SHIPPED",
  },

  "IN TRANSIT": {
    shipment: "IN_TRANSIT",
    tracking: "IN_TRANSIT",
    order: "SHIPPED",
  },

  "OUT FOR DELIVERY": {
    shipment: "OUT_FOR_DELIVERY",
    tracking: "OUT_FOR_DELIVERY",
    order: "OUT_FOR_DELIVERY",
  },

  DELIVERED: {
    shipment: "DELIVERED",
    tracking: "DELIVERED",
    order: "DELIVERED",
  },

  RTO: {
    shipment: "RTO",
    tracking: "RTO",
    order: "RETURNED",
  },

  CANCELED: {
  shipment: "CANCELLED",
  tracking: "CANCELLED",
  order: "CANCELLED",
},

CANCELLED: {
  shipment: "CANCELLED",
  tracking: "CANCELLED",
  order: "CANCELLED",
},
};

// const findShipment = async (data) => {
//   return prisma.shipment.findFirst({
//     where: {
//       OR: [
//         data.awb
//           ? {
//               awbCode: String(data.awb),
//             }
//           : undefined,

//         data.shipment_id
//           ? {
//               shiprocketShipmentId: String(data.shipment_id),
//             }
//           : undefined,
//       ].filter(Boolean),
//     },

//     include: {
//   order: {
//     include: {
//       customer: true,
//       payment: true,
//       shipment: {
//         include: {
//           trackingHistory: {
//             orderBy: {
//               eventTime: "asc",
//             },
//           },
//         },
//       },
//       statusHistory: {
//         orderBy: {
//           createdAt: "asc",
//         },
//       },
//       orderItems: {
//         include: {
//           product: {
//             include: {
//               images: true,
//             },
//           },
//         },
//       },
//     },
//   },
// },
//   });
// };


const findShipment = async (data) => {
  const conditions = [];

  if (data.awb && String(data.awb).trim()) {
    conditions.push({
      awbCode: String(data.awb),
    });
  }

  if (data.shipment_id && String(data.shipment_id).trim()) {
    conditions.push({
      shiprocketShipmentId: String(data.shipment_id),
    });
  }

  if (data.sr_order_id && String(data.sr_order_id).trim()) {
    conditions.push({
      shiprocketOrderId: String(data.sr_order_id),
    });
  }

  if (data.order_id && String(data.order_id).trim()) {
    conditions.push({
      order: {
        receipt: String(data.order_id),
      },
    });
  }

  if (!conditions.length) {
    return null;
  }

  return prisma.shipment.findFirst({
    where: {
      OR: conditions,
    },
    include: {
      order: {
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
      },
    },
  });
};

const updateShipment = async (
  tx,
  shipment,
  data,
  statusMapping
) => {
  return tx.shipment.update({
    where: {
      id: shipment.id,
    },

    data: {
      status: statusMapping.shipment,

      trackingUrl:
        data.tracking_url ??
        shipment.trackingUrl,

      courierName:
        data.courier_name ??
        shipment.courierName,
    },
  });
};

const createShipmentTracking = async (
  tx,
  shipment,
  data,
  statusMapping
) => {

  // const eventTime = data.event_time
  //   ? new Date(data.event_time)
  //   : new Date();

  const eventTime = data.current_timestamp
  ? new Date(data.current_timestamp)
  : new Date();

  const existingTracking =
    await tx.shipmentTracking.findFirst({

      where: {
        shipmentId: shipment.id,
        status: statusMapping.tracking,
        eventTime,
      },

    });

  if (existingTracking) {
    return existingTracking;
  }

  return tx.shipmentTracking.create({

    data: {

      shipmentId: shipment.id,

      status: statusMapping.tracking,

      remarks:
        data.current_status ??
        data.shipment_status ??
        data.status,

      eventTime,

    },

  });

};

export const processShiprocketWebhook = async (payload) => {

     try {

    console.log("========== SHIPROCKET WEBHOOK ==========");
console.dir(payload, { depth: null });
console.log("========================================");
  const validation = validateShiprocketWebhook(payload);

  // if (!validation.success) {
  //   console.error("Invalid Shiprocket webhook", validation.errors);
  //   return;
  // }

  if (!validation.success) {
  console.error(
    "Invalid Shiprocket webhook",
    validation.error.flatten()
  );
  return;
}

  const data = validation.data;
const shipment = await findShipment(data);

  if (!shipment) {
    // console.warn(
    //   "Shipment not found for webhook",
    //   data.awb || data.shipment_id
    // );


    console.warn("Shipment not found", {
  awb: data.awb,
  shipmentId: data.shipment_id,
  srOrderId: data.sr_order_id,
  orderId: data.order_id,
});
    return;
  }

  

  const shiprocketStatus =
  data.current_status ||
  data.shipment_status ||
  data.status;

const statusMapping =
  SHIPROCKET_STATUS_MAP[
    shiprocketStatus?.toUpperCase()
  ];

  if (!statusMapping) {
  await techService.warn({
  category: "SHIPROCKET",
  title: "Unhandled Shiprocket Status",
  message: `Unhandled status: ${shiprocketStatus}`,
  metadata: {
    payload,
  },
});
  return;
}

  if (
  shipment.status === statusMapping.shipment &&
  shipment.order.status === statusMapping.order
) {
  console.log(
    `Duplicate webhook ignored for Order ${shipment.order.receipt}`
  );

  return;
}



let updatedOrder = shipment.order;

await prisma.$transaction(async (tx) => {

  // ------------------------------------
  // Save webhook payload
  // ------------------------------------

  const webhookLog =
    await tx.shipmentWebhook.create({
      data: {
        shipmentId: shipment.id,
        payload,
      },
    });

  // ------------------------------------
  // Update Shipment
  // ------------------------------------

  await updateShipment(
    tx,
    shipment,
    data,
    statusMapping
  );

  // ------------------------------------
  // Shipment Tracking
  // ------------------------------------

  await createShipmentTracking(
    tx,
    shipment,
    data,
    statusMapping
  );

  // ------------------------------------
  // Order Status
  // ------------------------------------

  

if (
  shipment.order.status !==
  statusMapping.order
) {
  updatedOrder =
    await updateOrderStatusInternal(
      tx,
      shipment.order,
      {
        status: statusMapping.order,
      }
    );
}

  // ------------------------------------
  // Mark webhook processed
  // ------------------------------------

  await tx.shipmentWebhook.update({
    where: {
      id: webhookLog.id,
    },
    data: {
      processed: true,
    },
  });

});


try {
  await handleOrderStatusSideEffects(updatedOrder);
} catch (error) {
  await techService.error({
    category: "SHIPROCKET",
    title: "Order Side Effects Failed",
    message: error.message,
    metadata: {
      orderId: updatedOrder.id,
      receipt: updatedOrder.receipt,
      stack: error.stack,
    },
  });
}

const latestOrder = await prisma.order.findUnique({
  where: {
    id: updatedOrder.id,
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

emitOrderUpdated(latestOrder);
emitDashboardUpdate();

console.log(
  `Shiprocket webhook processed for Order ${shipment.order.receipt}`
);

     } catch (error) {
  await techService.error({
    category: "SHIPROCKET",
    title: "Shiprocket Webhook Processing Failed",
    message: error.message,
    metadata: {
      payload,
      stack: error.stack,
    },
  });

  throw error;
}
  

};