import { search } from "../services/search.service.js";

const searchController = {
  // ==============================================
  // Global Search
  // ==============================================

  async search(req, res, next) {
    try {
      const { q } = req.query;

      const results = await search(q || "");

      return res.status(200).json({
        success: true,
        message: "Search results fetched successfully.",
        data: results,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default searchController;