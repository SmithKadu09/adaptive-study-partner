"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
Send,
BookOpen,
Sparkles,
Loader2,
ArrowLeft,
Brain,
ClipboardCheck,
} from "lucide-react";
import AppShell from "../components/layout/AppShell";
import { apiRequest } from "../../src/lib/api";

export default function TeacherPage() {
const searchParams = useSearchParams();
const router = useRouter();

const topicFromUrl = searchParams.get("topic");
const subjectFromUrl = searchParams.get("subject");

const [topic, setTopic] = useState(
topicFromUrl || "Learning Topic"
);

const [subject, setSubject] = useState(
subjectFromUrl || "Machine Learning"
);

const [message, setMessage] = useState("");
const [messages, setMessages] = useState([]);
const [sessionId, setSessionId] = useState(null);
const [loading, setLoading] = useState(false);
const [initializing, setInitializing] = useState(true);
const [error, setError] = useState("");

// Update topic and subject if URL parameters change
useEffect(() => {
setTopic(topicFromUrl || "Learning Topic");
setSubject(subjectFromUrl || "Machine Learning");
}, [topicFromUrl, subjectFromUrl]);

// Start learning session
useEffect(() => {
if (!topicFromUrl || !subjectFromUrl) {
setInitializing(false);
return;
}


startLearningSession();


}, [topicFromUrl, subjectFromUrl]);

const startLearningSession = async () => {
try {
setInitializing(true);
setError("");


  const data = await apiRequest("/api/teacher/chat", {
    method: "POST",
    body: JSON.stringify({
      topic: topicFromUrl,
      subject: subjectFromUrl,
      message: `Teach me ${topicFromUrl} from the beginning. Explain it clearly and simply.`,
      sessionId: null,
    }),
  });

  setSessionId(data.sessionId);

  setMessages([
    {
      role: "assistant",
      content: data.response,
    },
  ]);
} catch (error) {
  console.error("Teacher initialization error:", error);

  setError(
    error.message || "Unable to start learning session."
  );
} finally {
  setInitializing(false);
}


};

// Send student message
const sendMessage = async () => {
const trimmedMessage = message.trim();


if (!trimmedMessage || loading) {
  return;
}

const userMessage = {
  role: "user",
  content: trimmedMessage,
};

setMessages((previous) => [...previous, userMessage]);
setMessage("");
setLoading(true);
setError("");

try {
  const data = await apiRequest("/api/teacher/chat", {
    method: "POST",
    body: JSON.stringify({
      topic,
      subject,
      message: trimmedMessage,
      sessionId,
    }),
  });

  setSessionId(data.sessionId);

  setMessages((previous) => [
    ...previous,
    {
      role: "assistant",
      content: data.response,
    },
  ]);
} catch (error) {
  console.error("Teacher chat error:", error);

  setError(
    error.message || "Unable to get teacher response."
  );

  // Remove the user's message if request failed
  setMessages((previous) => previous.slice(0, -1));
} finally {
  setLoading(false);
}


};

// Enter sends message
// Shift + Enter creates a new line
const handleKeyDown = (event) => {
if (event.key === "Enter" && !event.shiftKey) {
event.preventDefault();
sendMessage();
}
};

// Start quiz
const startQuiz = () => {
router.push(
`/quizzes?topic=${encodeURIComponent(
        topic
      )}&subject=${encodeURIComponent(subject)}`
);
};

return ( <AppShell> <div className="min-h-screen bg-[#07111f] text-white">


    {/* Header */}
    <div className="border-b border-white/10 bg-[#0b1728]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

        <div className="flex items-center gap-4">

          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Brain
                size={19}
                className="text-cyan-400"
              />

              <span className="text-sm font-medium text-cyan-400">
                AI Teacher
              </span>
            </div>

            <h1 className="mt-1 text-xl font-semibold">
              {topic}
            </h1>

            <p className="text-sm text-slate-400">
              {subject}
            </p>
          </div>

        </div>

        {/* Desktop quiz button */}
        <button
          onClick={startQuiz}
          className="hidden items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:flex"
        >
          <ClipboardCheck size={17} />
          Practice Quiz
        </button>

      </div>
    </div>

    {/* Main Content */}
    <div className="mx-auto flex max-w-5xl flex-col px-4 sm:px-6">

      {/* Adaptive Learning Banner */}
      <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 p-5">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
            <Sparkles
              size={21}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h2 className="font-semibold">
              Adaptive Learning Session
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Your AI teacher will adapt explanations, examples and
              practice according to your performance.
            </p>
          </div>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Conversation */}
      <div className="mt-6 min-h-[55vh] pb-32">

        {initializing ? (

          /* Initial loading */
          <div className="flex min-h-[45vh] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10">
                <Loader2
                  size={25}
                  className="animate-spin text-cyan-400"
                />
              </div>

              <h3 className="mt-4 font-medium">
                Preparing your lesson...
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your AI teacher is analyzing the topic.
              </p>

            </div>

          </div>

        ) : messages.length === 0 ? (

          /* Empty state */
          <div className="flex min-h-[45vh] items-center justify-center">

            <div className="text-center">

              <BookOpen
                size={40}
                className="mx-auto text-slate-600"
              />

              <h3 className="mt-4 text-lg font-semibold">
                Start learning
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Ask your AI teacher anything about {topic}.
              </p>

            </div>

          </div>

        ) : (

          /* Messages */
          <div className="space-y-5">

            {messages.map((item, index) => {
              const isUser = item.role === "user";

              return (
                <div
                  key={index}
                  className={`flex ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[88%] rounded-2xl px-5 py-4 ${
                      isUser
                        ? "rounded-br-md bg-cyan-500 text-slate-950"
                        : "rounded-bl-md border border-white/10 bg-[#101d30] text-slate-200"
                    }`}
                  >

                    {/* Message header */}
                    <div className="mb-2 flex items-center gap-2">

                      {isUser ? (

                        <span className="text-xs font-semibold opacity-70">
                          You
                        </span>

                      ) : (

                        <>
                          <Sparkles
                            size={14}
                            className="text-cyan-400"
                          />

                          <span className="text-xs font-semibold text-cyan-400">
                            AI Teacher
                          </span>
                        </>

                      )}

                    </div>

                    {/* Message content */}
                    <div className="whitespace-pre-wrap text-sm leading-7">
                      {item.content}
                    </div>

                  </div>

                </div>
              );
            })}

            {/* Teacher typing indicator */}
            {loading && (
              <div className="flex justify-start">

                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-[#101d30] px-5 py-4">

                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={14}
                      className="text-cyan-400"
                    />

                    <span className="text-xs font-semibold text-cyan-400">
                      AI Teacher
                    </span>

                  </div>

                  <div className="mt-3 flex gap-1">

                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />

                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                      style={{
                        animationDelay: "150ms",
                      }}
                    />

                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                      style={{
                        animationDelay: "300ms",
                      }}
                    />

                  </div>

                </div>

              </div>
            )}

          </div>

        )}

      </div>

      {/* Mobile Quiz Button */}
      <div className="fixed bottom-[90px] right-5 z-20 sm:hidden">

        <button
          onClick={startQuiz}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20"
        >
          <ClipboardCheck size={17} />
          Quiz
        </button>

      </div>

      {/* Chat Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-[#07111f]/95 p-4 backdrop-blur-xl md:left-64">

        <div className="mx-auto max-w-5xl">

          <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-[#101d30] p-2 shadow-2xl">

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI teacher..."
              rows={1}
              className="max-h-32 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>

          </div>

          <p className="mt-2 text-center text-xs text-slate-500">
            Press Enter to send • Shift + Enter for a new line
          </p>

        </div>

      </div>

    </div>

  </div>
</AppShell>


);
}
