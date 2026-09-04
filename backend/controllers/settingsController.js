const User = require("../models/user");

const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("settings");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      settings: user.settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      message: "Server error while fetching settings",
    });
  }
};


const updateSettings = async (req, res) => {
  try {
    const {
      difficulty,
      questionCount,
      studyReminders,
      recommendations,
    } = req.body;

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        message: "Invalid difficulty level",
      });
    }

    const numericQuestionCount = Number(questionCount);

    if (![5, 10, 15, 20].includes(numericQuestionCount)) {
      return res.status(400).json({
        message: "Invalid question count",
      });
    }

    if (
      typeof studyReminders !== "boolean" ||
      typeof recommendations !== "boolean"
    ) {
      return res.status(400).json({
        message: "Invalid notification settings",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.settings = {
      difficulty,
      questionCount: numericQuestionCount,
      studyReminders,
      recommendations,
    };

    await user.save();

    res.status(200).json({
      message: "Settings updated successfully",
      settings: user.settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    res.status(500).json({
      message: "Server error while updating settings",
    });
  }
};


module.exports = {
  getSettings,
  updateSettings,
};