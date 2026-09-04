const Performance = require("../models/performance");
const LearningProgress = require("../models/learningProgress");
const { generate } = require("../services/llm/llmService");

const getLearningRecommendations = async (req, res) => {
  try {
    const performance = await Performance.findOne({
      student: req.user._id,
    });

    if (!performance) {
      return res.status(404).json({
        message: "No performance data found",
      });
    }

    const weakTopics = (performance.topics || [])
      .filter((topic) => topic.level === "weak")
      .map((topic) => ({
        subject: topic.subject,
        topic: topic.topic,
        score: topic.score,
      }));

    const averageTopics = (performance.topics || [])
      .filter((topic) => topic.level === "average")
      .map((topic) => ({
        subject: topic.subject,
        topic: topic.topic,
        score: topic.score,
      }));

    if (weakTopics.length === 0 && averageTopics.length === 0) {
      return res.status(200).json({
        message: "No new recommendations available",
        learningProgress: null,
        recommendations: [],
      });
    }

    const performanceSummary = {
      weakTopics,
      averageTopics,
      strongTopics: (performance.topics || [])
        .filter((topic) => topic.level === "strong")
        .map((topic) => ({
          subject: topic.subject,
          topic: topic.topic,
          score: topic.score,
        })),
    };

    const prompt = `
You are an adaptive learning assistant.

Analyze the student's performance and recommend topics they should study next.

Student performance:
${JSON.stringify(performanceSummary, null, 2)}

Return ONLY valid JSON in this exact format:

{
  "subject": "main subject",
  "recommendedTopics": [
    {
      "topic": "topic name",
      "reason": "short reason",
      "priority": 1
    }
  ],
  "currentTopic": "most important topic to study"
}

Rules:
- Prioritize weak topics.
- Use average topics when additional practice is useful.
- Do not recommend topics marked as strong unless they are required as prerequisites.
- Give between 2 and 5 recommendations.
- Priority 1 means highest priority.
`;

    const response = await generate(prompt);

    let recommendationData;

    try {
      recommendationData =
        typeof response === "string"
          ? JSON.parse(response)
          : response;
    } catch (error) {
      console.error("Recommendation parsing error:", error);

      return res.status(500).json({
        message: "Failed to parse learning recommendations",
      });
    }

    if (
      !recommendationData ||
      !Array.isArray(recommendationData.recommendedTopics)
    ) {
      return res.status(500).json({
        message: "Invalid recommendation response",
      });
    }

    let learningProgress = await LearningProgress.findOne({
      student: req.user._id,
      subject: recommendationData.subject,
    });

    if (!learningProgress) {
      learningProgress = new LearningProgress({
        student: req.user._id,
        subject: recommendationData.subject || "General",
        recommendedTopics: recommendationData.recommendedTopics.map(
          (item) => ({
            topic: item.topic,
            reason: item.reason || "",
            priority: Number(item.priority) || 1,
          })
        ),
        currentTopic: recommendationData.currentTopic || "",
        completedTopics: [],
        learningStatus: "not_started",
      });
    } else {
      learningProgress.recommendedTopics =
        recommendationData.recommendedTopics.map((item) => ({
          topic: item.topic,
          reason: item.reason || "",
          priority: Number(item.priority) || 1,
        }));

      learningProgress.currentTopic =
        recommendationData.currentTopic || "";

      if (
        learningProgress.learningStatus === "completed"
      ) {
        learningProgress.learningStatus = "in_progress";
      }
    }

    await learningProgress.save();

    res.status(200).json({
      message: "Learning recommendations generated successfully",
      learningProgress,
      recommendations: learningProgress.recommendedTopics,
    });
  } catch (error) {
    console.error("Get learning recommendations error:", error);

    res.status(500).json({
      message: "Server error while generating learning recommendations",
    });
  }
};

module.exports = {
  getLearningRecommendations,
};