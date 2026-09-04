const LearningProgress = require("../models/learningProgress");

const getLearningProgress = async (req, res) => {
  try {
    const progress = await LearningProgress.findOne({
      student: req.user._id,
    }).sort({ updatedAt: -1 });

    if (!progress) {
      return res.status(200).json({
        learningProgress: null,
        recommendedTopics: [],
        completedTopics: [],
        currentTopic: "",
        learningStatus: "not_started",
      });
    }

    return res.status(200).json({
      learningProgress: progress,
      recommendedTopics: progress.recommendedTopics || [],
      completedTopics: progress.completedTopics || [],
      currentTopic: progress.currentTopic || "",
      learningStatus: progress.learningStatus || "not_started",
    });
  } catch (error) {
    console.error("Get learning progress error:", error);

    return res.status(500).json({
      message: "Server error while fetching learning progress",
    });
  }
};

module.exports = {
  getLearningProgress,
};