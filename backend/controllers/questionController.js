const Question = require("../models/questions");

const createQuestion = async (req, res) => {
  try {
    const {
      subject,
      topic,
      difficulty,
      questionText,
      options,
      correctAnswer,
      explanation,
      source,
    } = req.body;

    if (
      !subject ||
      !topic ||
      !difficulty ||
      !questionText ||
      !options ||
      !correctAnswer
    ) {
      return res.status(400).json({
        message: "All required question fields must be provided",
      });
    }

    const question = await Question.create({
      subject,
      topic,
      difficulty,
      questionText,
      options,
      correctAnswer,
      explanation,
      source: source || "manual",
    });

    res.status(201).json({
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    console.error("Create question error:", error);

    res.status(500).json({
      message: "Server error while creating question",
    });
  }
};

const getQuestions = async (req, res) => {
  try {
    const {
      subject,
      topic,
      difficulty,
      limit = 10,
    } = req.query;

    if (!subject || !topic || !difficulty) {
      return res.status(400).json({
        message: "Subject, topic and difficulty are required",
      });
    }

    const questions = await Question.find({
      subject,
      topic,
      difficulty,
    })
      .select("-correctAnswer -explanation")
      .limit(Number(limit));

    if (questions.length === 0) {
      return res.status(404).json({
        message: "No questions found for the selected criteria",
        questions: [],
      });
    }

    res.status(200).json({
      message: "Questions retrieved successfully",
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get questions error:", error);

    res.status(500).json({
      message: "Server error while retrieving questions",
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
};