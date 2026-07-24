import http from "http";

import app from "./app.js";
import { initSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 5001;

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start Server
server.listen(PORT, () => {
  console.log(`
=====================================
🚀 PopFresh Backend Running
🌍 http://localhost:${PORT}
=====================================
`);
});


// import app from "./app.js";

// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//     console.log(`
// =====================================
// 🚀 PopFresh Backend Running
// 🌍 http://localhost:${PORT}
// =====================================
// `);
// });