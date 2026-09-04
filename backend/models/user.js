const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    settings: {
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium",
      },

      questionCount: {
        type: Number,
        enum: [5, 10, 15, 20],
        default: 10,
      },

      studyReminders: {
        type: Boolean,
        default: true,
      },

      recommendations: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;