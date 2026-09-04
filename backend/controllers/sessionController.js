const LearningSession = require("../models/learningSession");

const getMySessions = async (req, res) => {
  try {
    const sessions = await LearningSession.find({
      student: req.user._id,
    })
      .sort({ lastMessageAt: -1 })
      .select("_id topic subject startedAt lastMessageAt messages");

    res.status(200).json({
      sessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);

    res.status(500).json({
      message: "Server error while fetching learning sessions",
    });
  }
};

const getSessionById = async (req, res) => {
  try {
    const session = await LearningSession.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        message: "Learning session not found",
      });
    }

    res.status(200).json({
      session,
    });
  } catch (error) {
    console.error("Get session error:", error);

    res.status(500).json({
      message: "Server error while fetching learning session",
    });
  }
};

module.exports = {
  getMySessions,
  getSessionById,
};