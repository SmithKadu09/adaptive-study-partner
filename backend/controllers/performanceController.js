const Performance = require("../models/performance");

const getMyPerformance = async (req, res) => {
  try {
    const performance = await Performance.findOne({
      student: req.user._id,
    });

    if (!performance) {
      return res.status(404).json({
        message: "No performance data found",
      });
    }

    res.status(200).json({
      performance,
    });
  } catch (error) {
    console.error("Get performance error:", error);

    res.status(500).json({
      message: "Server error while fetching performance",
    });
  }
};

module.exports = {
  getMyPerformance,
};