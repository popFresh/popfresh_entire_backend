import { Server } from "socket.io";
import socketAuth from "../middlewares/socketAuth.middleware.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  // 🔐 Authenticate every socket connection
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("🟢 Client Connected:", socket.id);
    console.log("👤 User:", socket.user);

    socket.on("disconnect", () => {
      console.log("🔴 Client Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};

// import { Server } from "socket.io";

// let io;

// export const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: true,
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`🟢 Client Connected: ${socket.id}`);

//     socket.on("disconnect", () => {
//       console.log(`🔴 Client Disconnected: ${socket.id}`);
//     });
//   });

//   return io;
// };

// export const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.IO has not been initialized.");
//   }

//   return io;
// };