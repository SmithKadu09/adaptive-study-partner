const mongoose = require("mongoose");

const learningProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    recommendedTopics: [
      {
        topic: {
          type: String,
          required: true,
        },

        reason: {
          type: String,
          default: "",
        },

        priority: {
          type: Number,
          default: 1,
        },
      },
    ],

    currentTopic: {
      type: String,
      default: "",
    },

    completedTopics: [
      {
        topic: {
          type: String,
          required: true,
        },

        completedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    learningStatus: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },
  },
  {
    timestamps: true,
  }
);

const LearningProgress =
  mongoose.models.LearningProgress ||
  mongoose.model("LearningProgress", learningProgressSchema);

module.exports = LearningProgress;