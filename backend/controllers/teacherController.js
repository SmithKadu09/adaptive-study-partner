const Performance = require("../models/performance");
const LearningSession = require("../models/learningSession");
const LearningProgress = require("../models/learningProgress");
const { generate } = require("../services/llm/llmService");

const teacherChat = async (req, res) => {
  try {
    const {
      sessionId,
      message,
      topic,
      subject = "",
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    let session;

    // If an existing session ID is provided, load that session
    if (sessionId) {
      session = await LearningSession.findOne({
        _id: sessionId,
        student: req.user._id,
      });

      if (!session) {
        return res.status(404).json({
          message: "Learning session not found",
        });
      }
    } else {
      // Create a new learning session
      session = new LearningSession({
        student: req.user._id,
        topic: topic || "General Learning",
        subject: subject || "",
        messages: [],
      });
    }

    // Get existing conversation messages
    const messages = session.messages || [];

    // Add student's message
    messages.push({
      role: "user",
      content: message.trim(),
    });

    // Build conversation history for the LLM
    const conversationHistory = messages
      .map((item) => {
        const role =
          item.role === "user"
            ? "Student"
            : "Teacher";

        return `${role}: ${item.content}`;
      })
      .join("\n\n");

    const prompt = `
You are an intelligent AI teacher helping a student learn.

Your role:
- Explain concepts clearly and simply.
- Adapt explanations to the student's level.
- Ask useful follow-up questions when appropriate.
- Give examples when they improve understanding.
- Correct misunderstandings politely.
- Do not overwhelm the student with unnecessary information.
- Stay focused on the current learning topic.

Subject:
${session.subject || "General"}

Topic:
${session.topic || "General Learning"}

Conversation:
${conversationHistory}

Now respond to the student's latest message.

Return ONLY the teacher's response.
Do not return JSON.
Do not include labels such as "Teacher:".
Do not include thinking/reasoning.
`;

    // Generate AI teacher response
    const teacherResponse = await generate(prompt);

    // Make sure we have a usable response
    const responseText =
      typeof teacherResponse === "string"
        ? teacherResponse.trim()
        : teacherResponse?.content
          ? String(teacherResponse.content).trim()
          : "";

    if (!responseText) {
      return res.status(500).json({
        message: "AI teacher returned an empty response",
      });
    }

    // Add teacher response to conversation
    messages.push({
      role: "assistant",
      content: responseText,
    });

    // Save updated conversation
    session.messages = messages;
    session.lastMessageAt = new Date();

    await session.save();

    return res.status(200).json({
      message: "Teacher response generated successfully",
      sessionId: session._id,
      response: responseText,
      teacherResponse: responseText,
      messages: session.messages,
    });
  } catch (error) {
    console.error("Teacher chat error:", error);

    return res.status(500).json({
      message: "Server error while generating teacher response",
    });
  }
};
module.exports = {
  teacherChat,
};