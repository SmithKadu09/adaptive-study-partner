const Assessment = require("../models/assessment");
const Question = require("../models/questions");
const Performance = require("../models/performance");
const { generate } = require("../services/llm/llmService");

const generateAssessment = async (req, res) => {
  try {
    const { subject, topic, difficulty, questionCount = 5 } = req.body;

    if (!subject || !topic || !difficulty) {
      return res.status(400).json({
        message: "Subject, topic and difficulty are required",
      });
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        message: "Invalid difficulty level",
      });
    }

    const count = Number(questionCount);

    if (!Number.isInteger(count) || count < 1 || count > 20) {
      return res.status(400).json({
        message: "Question count must be between 1 and 20",
      });
    }

    let questions = await Question.find({
      subject,
      topic,
      difficulty,
    }).limit(count);

    if (questions.length < count) {
      const prompt = `
Generate ${count - questions.length} multiple choice questions.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Return ONLY valid JSON in this format:

{
  "questions": [
    {
      "questionText": "Question here",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Correct option",
      "explanation": "Short explanation"
    }
  ]
}
`;

      const response = await generate(prompt);

      let generatedData;

      try {
        generatedData =
          typeof response === "string"
            ? JSON.parse(response)
            : response;
      } catch (error) {
        return res.status(500).json({
          message: "Failed to parse generated assessment questions",
        });
      }

      const generatedQuestions = generatedData?.questions || [];

      const newQuestions = [];

      for (const item of generatedQuestions) {
        if (
          !item.questionText ||
          !Array.isArray(item.options) ||
          item.options.length !== 4 ||
          !item.correctAnswer
        ) {
          continue;
        }

        const question = await Question.create({
          subject,
          topic,
          difficulty,
          questionText: item.questionText,
          options: item.options,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation || "",
          source: "llm",
        });

        newQuestions.push(question);
      }

      questions = [...questions, ...newQuestions];
    }

    if (questions.length === 0) {
      return res.status(404).json({
        message: "No questions available for this assessment",
      });
    }

    res.status(200).json({
      message: "Assessment generated successfully",
      assessment: {
        subject,
        topic,
        difficulty,
        totalQuestions: questions.length,
        questions: questions.map((question) => ({
          _id: question._id,
          questionText: question.questionText,
          options: question.options,
        })),
      },
    });
  } catch (error) {
    console.error("Generate assessment error:", error);

    res.status(500).json({
      message: "Server error while generating assessment",
    });
  }
};

const submitAssessment = async (req, res) => {
  try {
    const {
      subject,
      topic,
      difficulty,
      questions,
      answers,
    } = req.body;

    if (!subject || !topic || !difficulty) {
      return res.status(400).json({
        message: "Subject, topic and difficulty are required",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: "Questions are required",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers must be an array",
      });
    }

    const questionIds = questions.map((item) =>
      typeof item === "string" ? item : item.questionId || item._id
    );

    const questionDocuments = await Question.find({
      _id: { $in: questionIds },
      subject,
      topic,
      difficulty,
    });

    if (questionDocuments.length !== questionIds.length) {
      return res.status(400).json({
        message: "Some assessment questions are invalid",
      });
    }

    let correctAnswers = 0;
    let totalScore = 0;

    const evaluatedQuestions = questionIds.map((questionId, index) => {
      const question = questionDocuments.find(
        (item) => item._id.toString() === questionId.toString()
      );

      const selectedAnswer = answers[index] || "";

      const isCorrect =
        selectedAnswer.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase();

      const score = isCorrect ? 1 : 0;

      if (isCorrect) {
        correctAnswers += 1;
        totalScore += score;
      }

      return {
        question: question._id,
        selectedAnswer,
        isCorrect,
        score,
      };
    });

    const totalQuestions = questionIds.length;

    const percentage =
      totalQuestions > 0
        ? (correctAnswers / totalQuestions) * 100
        : 0;

    const assessment = await Assessment.create({
      student: req.user._id,
      subject,
      topic,
      difficulty,
      questions: evaluatedQuestions,
      totalQuestions,
      correctAnswers,
      totalScore,
      completed: true,
    });

    let performance = await Performance.findOne({
      student: req.user._id,
    });

    if (!performance) {
      performance = await Performance.create({
        student: req.user._id,
        totalAssessments: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        totalScore: 0,
        topics: [],
      });
    }

    performance.totalAssessments =
      (performance.totalAssessments || 0) + 1;

    performance.totalQuestions =
      (performance.totalQuestions || 0) + totalQuestions;

    performance.correctAnswers =
      (performance.correctAnswers || 0) + correctAnswers;

    performance.totalScore =
      (performance.totalScore || 0) + totalScore;

    if (!Array.isArray(performance.topics)) {
      performance.topics = [];
    }

    let topicPerformance = performance.topics.find(
      (item) =>
        item.subject === subject &&
        item.topic === topic
    );

    let level = "weak";

    if (percentage >= 75) {
      level = "strong";
    } else if (percentage >= 50) {
      level = "average";
    }

    if (!topicPerformance) {
      performance.topics.push({
        subject,
        topic,
        attempts: 1,
        correctAnswers,
        totalQuestions,
        score: percentage,
        level,
      });
    } else {
      topicPerformance.attempts =
        (topicPerformance.attempts || 0) + 1;

      topicPerformance.correctAnswers =
        (topicPerformance.correctAnswers || 0) + correctAnswers;

      topicPerformance.totalQuestions =
        (topicPerformance.totalQuestions || 0) + totalQuestions;

      topicPerformance.score =
        topicPerformance.totalQuestions > 0
          ? (topicPerformance.correctAnswers /
            topicPerformance.totalQuestions) *
          100
          : 0;

      if (topicPerformance.score >= 75) {
        topicPerformance.level = "strong";
      } else if (topicPerformance.score >= 50) {
        topicPerformance.level = "average";
      } else {
        topicPerformance.level = "weak";
      }
    }

    await performance.save();

    res.status(201).json({
      message: "Assessment submitted successfully",
      result: {
        assessmentId: assessment._id,
        subject,
        topic,
        difficulty,
        totalQuestions,
        correctAnswers,
        totalScore,
        percentage: Math.round(percentage),
      },
    });
  } catch (error) {
    console.error("Submit assessment error:", error);

    res.status(500).json({
      message: "Server error while submitting assessment",
    });
  }
};

module.exports = {
  generateAssessment,
  submitAssessment,
};