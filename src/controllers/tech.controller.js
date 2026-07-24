// tech.controller.js

import techService from "../services/tech.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getOverview = async (req, res, next) => {
  try {
    const [overview, logs, failedEvents] = await Promise.all([
      techService.getOverview(),
      techService.getLogs(),
      techService.getFailedEvents(),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        "Tech dashboard fetched successfully.",
        {
          overview,
          logs,
          failedEvents,
        }
      )
    );
  } catch (error) {
    next(error);
  }
};

const getLogs = async (req, res, next) => {
  try {
    const logs = await techService.getLogs();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Logs fetched successfully.",
        logs
      )
    );
  } catch (error) {
    next(error);
  }
};

const getFailedEvents = async (req, res, next) => {
  try {
    const failedEvents = await techService.getFailedEvents();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Failed events fetched successfully.",
            failedEvents
        )
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getOverview,
  getLogs,
  getFailedEvents,
};

// // tech.controller.js

// import techService from "../services/tech.service.js";
// import {ApiResponse} from "../utils/ApiResponse.js";

// const getOverview = async (req, res, next) => {
//   try {
//     const overview = techService.getOverview();

//     return res.status(200).json(
//       new ApiResponse(
//         200,
//         "Tech overview fetched successfully.",
//         overview
//       )
//     );
//   } catch (error) {
//     next(error);
//   }
// };

// const getLogs = async (req, res, next) => {
//   try {
//     const logs = techService.getLogs();

//     return res.status(200).json(
//       new ApiResponse(
//         200,
//         "Logs fetched successfully.",
//         logs
//       )
//     );
//   } catch (error) {
//     next(error);
//   }
// };

// const getFailedEvents = async (req, res, next) => {
//   try {
//     const failedEvents = techService.getFailedEvents();

//     return res.status(200).json(
//       new ApiResponse(
//         200,
//         "Failed events fetched successfully.",
//         failedEvents
//       )
//     );
//   } catch (error) {
//     next(error);
//   }
// };

// export default {
//   getOverview,
//   getLogs,
//   getFailedEvents,
// };