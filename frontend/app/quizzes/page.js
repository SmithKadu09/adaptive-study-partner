"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Home,
  Loader2,
  RotateCcw,
  Trophy,
  Zap,
} from "lucide-react";
import AppShell from "../components/layout/AppShell";
import { apiRequest } from "@/lib/api";

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const querySubject = searchParams.get("subject");
    const queryTopic = searchParams.get("topic");

    if (querySubject) {
      setSubject(querySubject);
    }

    if (queryTopic) {
      setTopic(queryTopic);
    }
  }, [searchParams]);

  const current = questions[currentQuestion];

  const answeredCount = Object.keys(answers).length;

  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) / questions.length) * 100
      : 0;

  function handleAnswer(questionId, answer) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  }

  async function generateQuiz() {
    if (!subject.trim() || !topic.trim()) {
      setError("Please enter both subject and topic.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      setAnswers({});
      setCurrentQuestion(0);

      // Store the API response in data
      const data = await apiRequest("/api/quiz/generate", {
        method: "POST",
        body: JSON.stringify({
          subject,
          topic,
          numberOfQuestions,
        }),
      });

      setQuizId(data.quizId);
      setQuestions(data.questions || []);
      setQuizStarted(true);
    } catch (error) {
      console.error("Generate quiz error:", error);
      setError(error.message || "Unable to generate quiz.");
    } finally {
      setLoading(false);
    }
  }

  async function submitQuiz() {
    if (!quizId || questions.length === 0) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formattedAnswers = questions.map((question) => ({
        questionId: question._id,
        selectedAnswer: answers[question._id] || "",
      }));

      // IMPORTANT:
      // Submit answers to /submit, NOT /generate
      const data = await apiRequest("/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify({
          quizId,
          answers: formattedAnswers,
        }),
      });

      setResult(data);
      setQuizStarted(false);
    } catch (error) {
      console.error("Submit quiz error:", error);
      setError(error.message || "Unable to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  }

  function restartQuiz() {
    setResult(null);
    setQuizStarted(false);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setQuizId(null);
    setError("");
  }

  function goToQuestion(index) {
    setCurrentQuestion(index);
  }

  /*
   * =========================================================
   * RESULT SCREEN
   * =========================================================
   */

  if (result) {
    const score = Number(result.score) || 0;
    const correctAnswers = Number(result.correctAnswers) || 0;
    const totalQuestions =
      Number(result.totalQuestions) || questions.length;

    return (
      <AppShell>
        <div className="min-h-screen bg-[#07111f] text-white">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to dashboard
            </button>

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
                Quiz completed
              </p>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Your performance
              </h1>

              <p className="mt-2 text-slate-400">
                {subject} · {topic}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {/* Score */}
              <div className="rounded-2xl border border-white/10 bg-[#0c1828] p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Trophy size={22} />
                </div>

                <p className="text-sm text-slate-400">
                  Score
                </p>

                <p className="mt-1 text-4xl font-semibold">
                  {score}%
                </p>
              </div>

              {/* Correct answers */}
              <div className="rounded-2xl border border-white/10 bg-[#0c1828] p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={22} />
                </div>

                <p className="text-sm text-slate-400">
                  Correct answers
                </p>

                <p className="mt-1 text-4xl font-semibold">
                  {correctAnswers}

                  <span className="ml-1 text-lg font-normal text-slate-500">
                    / {totalQuestions}
                  </span>
                </p>
              </div>

              {/* Topic */}
              <div className="rounded-2xl border border-white/10 bg-[#0c1828] p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <BarChart3 size={22} />
                </div>

                <p className="text-sm text-slate-400">
                  Topic
                </p>

                <p className="mt-1 line-clamp-2 text-xl font-semibold">
                  {topic}
                </p>
              </div>
            </div>

            {/* Next actions */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0c1828] p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    What would you like to do next?
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Your result has been added to your performance data.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={restartQuiz}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                  >
                    <RotateCcw size={16} />
                    Try again
                  </button>

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500"
                  >
                    <Home size={16} />
                    Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  /*
   * =========================================================
   * ACTIVE QUIZ SCREEN
   * =========================================================
   */

  if (quizStarted && current) {
    const selectedAnswer = answers[current._id];

    return (
      <AppShell>
        <div className="min-h-screen bg-[#07111f] text-white">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  setQuizStarted(false);
                  setError("");
                }}
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
              >
                <ArrowLeft size={17} />
                Exit quiz
              </button>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Question
                </p>

                <p className="text-sm font-medium text-slate-200">
                  {currentQuestion + 1} / {questions.length}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
              <main>
                {/* Question card */}
                <div className="rounded-2xl border border-white/10 bg-[#0c1828] p-5 sm:p-8">
                  <div className="mb-7 flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <CircleHelp size={21} />
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-medium text-blue-400">
                        {subject}
                      </p>

                      <h1 className="text-xl font-semibold leading-relaxed sm:text-2xl">
                        {current.question}
                      </h1>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {current.options.map((option, index) => {
                      const isSelected = selectedAnswer === option;

                      return (
                        <button
                          key={`${current._id}-${index}`}
                          onClick={() =>
                            handleAnswer(current._id, option)
                          }
                          className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                            isSelected
                              ? "border-blue-500/60 bg-blue-500/10 text-white"
                              : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-medium ${
                              isSelected
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-white/10 bg-white/5 text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>

                          <span className="text-sm leading-relaxed sm:text-base">
                            {option}
                          </span>

                          {isSelected && (
                            <Check
                              size={18}
                              className="ml-auto shrink-0 text-blue-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={17} />
                    Previous
                  </button>

                  {currentQuestion === questions.length - 1 ? (
                    <button
                      onClick={submitQuiz}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit quiz
                          <CheckCircle2 size={17} />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500"
                    >
                      Next
                      <ChevronRight size={17} />
                    </button>
                  )}
                </div>
              </main>

              {/* Question navigator */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0c1828] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-200">
                      Questions
                    </p>

                    <p className="text-xs text-slate-500">
                      {answeredCount}/{questions.length}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {questions.map((question, index) => {
                      const answered = Boolean(
                        answers[question._id]
                      );

                      const active = index === currentQuestion;

                      return (
                        <button
                          key={question._id}
                          onClick={() => goToQuestion(index)}
                          className={`flex h-9 items-center justify-center rounded-lg border text-xs font-medium transition ${
                            active
                              ? "border-blue-500 bg-blue-500 text-white"
                              : answered
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : "border-white/10 bg-white/[0.02] text-slate-500 hover:bg-white/5"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Answered
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-slate-600" />
                      Unanswered
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  /*
   * =========================================================
   * QUIZ CONFIGURATION SCREEN
   * =========================================================
   */

  return (
    <AppShell>
      <div className="min-h-screen bg-[#07111f] text-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </button>

          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Brain size={24} />
            </div>

            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
              Adaptive assessment
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Test your understanding
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Generate a focused AI-powered quiz based on the topic you
              want to practice.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Configuration */}
            <div className="rounded-2xl border border-white/10 bg-[#0c1828] p-6 sm:p-8">
              <div className="mb-7">
                <h2 className="text-lg font-semibold">
                  Quiz configuration
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose what you want to practice.
                </p>
              </div>

              <div className="space-y-5">
                {/* Subject */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Subject
                  </label>

                  <input
                    value={subject}
                    onChange={(event) =>
                      setSubject(event.target.value)
                    }
                    placeholder="e.g. Machine Learning"
                    className="w-full rounded-xl border border-white/10 bg-[#081321] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
                  />
                </div>

                {/* Topic */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Topic
                  </label>

                  <input
                    value={topic}
                    onChange={(event) =>
                      setTopic(event.target.value)
                    }
                    placeholder="e.g. Overfitting"
                    className="w-full rounded-xl border border-white/10 bg-[#081321] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
                  />
                </div>

                {/* Number of questions */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Number of questions
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[5, 8, 10].map((count) => (
                      <button
                        key={count}
                        onClick={() =>
                          setNumberOfQuestions(count)
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                          numberOfQuestions === count
                            ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                            : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/5"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-slate-600">
                    Maximum 10 questions per quiz.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* Generate */}
                <button
                  onClick={generateQuiz}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Generating quiz...
                    </>
                  ) : (
                    <>
                      Generate quiz
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Information cards */}
            <div className="space-y-4">
              {/* Adaptive practice */}
              <div className="rounded-2xl border border-white/10 bg-[#0c1828] p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Zap size={20} />
                </div>

                <h3 className="font-semibold">
                  Adaptive practice
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Your quiz performance is used to update your
                  topic-level performance and future learning
                  recommendations.
                </p>
              </div>

              {/* Focused questions */}
              <div className="rounded-2xl border border-white/10 bg-[#0c1828] p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <BookOpen size={20} />
                </div>

                <h3 className="font-semibold">
                  Focused questions
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Questions are generated specifically around the
                  subject and topic you select.
                </p>
              </div>

              {/* Track improvement */}
              <div className="rounded-2xl border border-white/10 bg-[#0c1828] p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <BarChart3 size={20} />
                </div>

                <h3 className="font-semibold">
                  Track improvement
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Every completed quiz contributes to your adaptive
                  performance profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}