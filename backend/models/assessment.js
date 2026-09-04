const mongoose = require("mongoose");

const assessmentQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "questions",
            required: true,
        },

        selectedAnswer: {
            type: String,
            default: "",
        },

        isCorrect: {
            type: Boolean,
            default: false,
        },

        score: {
            type: Number,
            default: 0,
        },
    },
    {
        _id: false,
    }
);


const assessmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        topic: {
            type: String,
            required: true,
            trim: true,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
        },

        questions: [
            assessmentQuestionSchema,
        ],

        totalQuestions: {
            type: Number,
            required: true,
        },

        correctAnswers: {
            type: Number,
            default: 0,
        },

        totalScore: {
            type: Number,
            default: 0,
        },

        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


const Assessment = mongoose.model(
    "Assessment",
    assessmentSchema
);

module.exports = Assessment;