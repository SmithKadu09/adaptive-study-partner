const Performance = require("../models/performance");

const getDashboard = async (req, res) => {
  try {
    const performance = await Performance.findOne({
      student: req.user._id,
    });

    if (!performance) {
      return res.status(404).json({
        message: "No performance data found",
      });
    }

    const topics = performance.topics || [];

    // Calculate totals directly from topic performance.
    // This also fixes older records where global totals were not updated properly.
    const calculatedTotalQuestions = topics.reduce(
      (sum, topic) => sum + (Number(topic.totalQuestions) || 0),
      0
    );

    const calculatedCorrectAnswers = topics.reduce(
      (sum, topic) => sum + (Number(topic.correctAnswers) || 0),
      0
    );

    const averageScore =
      calculatedTotalQuestions > 0
        ? (calculatedCorrectAnswers / calculatedTotalQuestions) * 100
        : 0;

    const strongTopics = topics
      .filter((topic) => topic.level === "strong")
      .map((topic) => ({
        topic: topic.topic,
        subject: topic.subject,
        score: Math.round(Number(topic.score) || 0),
      }));

    const averageTopics = topics
      .filter((topic) => topic.level === "average")
      .map((topic) => ({
        topic: topic.topic,
        subject: topic.subject,
        score: Math.round(Number(topic.score) || 0),
      }));

    const weakTopics = topics
      .filter((topic) => topic.level === "weak")
      .map((topic) => ({
        topic: topic.topic,
        subject: topic.subject,
        score: Math.round(Number(topic.score) || 0),
      }));

    return res.status(200).json({
      totalAssessments: performance.totalAssessments || 0,

      totalQuestions: calculatedTotalQuestions,

      correctAnswers: calculatedCorrectAnswers,

      totalScore: calculatedCorrectAnswers,

      averageScore: Math.round(averageScore),

      strongTopics,
      averageTopics,
      weakTopics,

      topics,
    });
  } catch (error) {
    console.error("Get dashboard error:", error);

    return res.status(500).json({
      message: "Server error while fetching dashboard data",
    });
  }
};

module.exports = {
  getDashboard,
};