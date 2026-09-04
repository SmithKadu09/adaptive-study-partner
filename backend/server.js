const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const questionRoutes = require("./routes/questionRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const llmRoutes = require("./routes/llmRoutes");
const learningRoutes = require("./routes/learningRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const quizRoutes = require("./routes/quizRoutes");
const learningProgressRoutes = require("./routes/learningProgressRoutes");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();


// ==============================
// Middleware
// ==============================

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        credentials: true,
    })
);

app.use(express.json());


// ==============================
// Routes
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/llm", llmRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/learning-progress", learningProgressRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/settings", settingsRoutes);


// ==============================
// Health check
// ==============================

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Adaptive Study Partner API is running",
    });
});


// ==============================
// Start Server
// ==============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();