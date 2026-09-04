const mongoose = require("mongoose");

const topicPerformanceSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    level: {
      type: String,
      enum: ["weak", "average", "strong"],
      default: "weak",
    },

    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const performanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    totalAssessments: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    totalCorrectAnswers: {
      type: Number,
      default: 0,
    },

    topics: {
      type: [topicPerformanceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Performance = mongoose.model("Performance", performanceSchema);

module.exports = Performance;