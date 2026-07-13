 import { getIO } from "./socket.js";

export const emitOrderUpdated = (order) => {
   
  getIO().emit("order:updated", order);
};

export const emitOrderCreated = (order) => {
  getIO().emit("order:created", order);
};

export const emitNotification = (notification) => {
  getIO().emit("notification:new", notification);
};

export const emitDashboardUpdate = () => {
  getIO().emit("dashboard:update");
};

export const emitCustomerCreated = (customer) => {
  getIO().emit("customer:created", customer);
};


export const emitProductCreated = (product) => {
  getIO().emit("product:created", product);
};

export const emitProductUpdated = (product) => {
  getIO().emit("product:updated", product);
};

export const emitProductDeleted = (productId) => {
  getIO().emit("product:deleted", productId);
};

export const emitPaymentUpdated = (payment) => {
  getIO().emit("payment:updated", payment);
};