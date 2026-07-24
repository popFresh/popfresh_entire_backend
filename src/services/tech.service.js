import os from "os";
import prisma from "../lib/prisma.js";

const addLog = async ({
  level,
  category,
  title,
  message,
  metadata = {},
}) => {
  try {
    return await prisma.techLog.create({
      data: {
        level,
        category,
        title,
        message,
        metadata,
      },
    });
  } catch (err) {
    // Logging should never crash the application
    console.error("❌ Failed to save tech log:", err.message);
    return null;
  }
};

const info = async ({
  category,
  title,
  message,
  metadata,
}) => {
  console.log(`[INFO] ${title}`, message);

  return await addLog({
    level: "INFO",
    category,
    title,
    message,
    metadata,
  });
};

const warn = async ({
  category,
  title,
  message,
  metadata,
}) => {
  console.warn(`[WARN] ${title}`, message);

  return await addLog({
    level: "WARN",
    category,
    title,
    message,
    metadata,
  });
};

const error = async ({
  category,
  title,
  message,
  metadata,
}) => {
  console.error(`[ERROR] ${title}`, message);

  return await addLog({
    level: "ERROR",
    category,
    title,
    message,
    metadata,
  });
};

const getLogs = async () => {
  return await prisma.techLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 200,
  });
};

const getFailedEvents = async () => {
  return await prisma.techLog.findMany({
    where: {
      level: {
        in: ["ERROR", "WARN", "CRITICAL"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
};

const getOverview = async () => {
  const [
    totalLogs,
    errors,
    warnings,
    infos,
    critical,
    lastError,
  ] = await Promise.all([
    prisma.techLog.count(),

    prisma.techLog.count({
      where: {
        level: "ERROR",
      },
    }),

    prisma.techLog.count({
      where: {
        level: "WARN",
      },
    }),

    prisma.techLog.count({
      where: {
        level: "INFO",
      },
    }),

    prisma.techLog.count({
      where: {
        level: "CRITICAL",
      },
    }),

    prisma.techLog.findFirst({
      where: {
        level: {
          in: ["ERROR", "CRITICAL"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    uptime: Math.floor(process.uptime()),

    environment: process.env.NODE_ENV,

    nodeVersion: process.version,

    memory: {
      used: Math.round(
        process.memoryUsage().heapUsed / 1024 / 1024
      ),
      total: Math.round(
        process.memoryUsage().heapTotal / 1024 / 1024
      ),
    },

    system: {
      platform: os.platform(),
      arch: os.arch(),
    },

    stats: {
      totalLogs,
      errors,
      warnings,
      infos,
      critical,
    },

    lastError,
  };
};

export default {
  info,
  warn,
  error,
  getLogs,
  getFailedEvents,
  getOverview,
};

// import os from "os";

// const MAX_LOGS = 200;

// const logs = [];

// const addLog = ({
//   level,
//   category,
//   title,
//   message,
//   metadata = {},
// }) => {
//   const log = {
//     id: crypto.randomUUID(),
//     timestamp: new Date(),
//     level,
//     category,
//     title,
//     message,
//     metadata,
//   };

//   logs.unshift(log);

//   if (logs.length > MAX_LOGS) {
//     logs.pop();
//   }

//   return log;
// };

// const info = ({
//   category,
//   title,
//   message,
//   metadata,
// }) => {
//   console.log(`[INFO] ${title}`, message);

//   return addLog({
//     level: "INFO",
//     category,
//     title,
//     message,
//     metadata,
//   });
// };

// const warn = ({
//   category,
//   title,
//   message,
//   metadata,
// }) => {
//   console.warn(`[WARN] ${title}`, message);

//   return addLog({
//     level: "WARN",
//     category,
//     title,
//     message,
//     metadata,
//   });
// };

// const error = ({
//   category,
//   title,
//   message,
//   metadata,
// }) => {
//   console.error(`[ERROR] ${title}`, message);

//   return addLog({
//     level: "ERROR",
//     category,
//     title,
//     message,
//     metadata,
//   });
// };

// const getLogs = () => logs;

// const getFailedEvents = () =>
//   logs.filter(
//     (log) =>
//       log.level === "ERROR" ||
//       log.level === "WARN"
//   );

// const getOverview = () => ({
//   uptime: Math.floor(process.uptime()),
//   environment: process.env.NODE_ENV,
//   nodeVersion: process.version,

//   memory: {
//     used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
//     total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
//   },

//   system: {
//     platform: os.platform(),
//     arch: os.arch(),
//   },

//   stats: {
//     totalLogs: logs.length,
//     errors: logs.filter((l) => l.level === "ERROR").length,
//     warnings: logs.filter((l) => l.level === "WARN").length,
//     infos: logs.filter((l) => l.level === "INFO").length,
//   },

//   lastError:
//     logs.find((log) => log.level === "ERROR") || null,
// });

// export default {
//   info,
//   warn,
//   error,

//   getLogs,
//   getFailedEvents,
//   getOverview,
// };