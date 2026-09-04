"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Home,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AssessmentPage() {
  const router = useRouter();

  const [subject, setSubject] = useState("Machine Learning");
  const [topic, setTopic] = useState("PCA");
  const [difficulty, setDifficulty] = useState("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // GENERATE ASSESSMENT
  // ==========================================

  const generateAssessment = async () => {
    try {
      setLoading(true);
      setError("");
      setAssessment(null);
      setResult(null);
      setAnswers({});
      setCurrentQuestion(0);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in");
      }

      const response = await fetch(
        `${API_URL}/api/assessment/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subject,
            topic,
            difficulty,
            questionCount: Number(numberOfQuestions),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate assessment"
        );
      }

      setAssessment(data.assessment);
    } catch (error) {
      console.error("Assessment generation error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SELECT ANSWER
  // ==========================================

  const selectAnswer = (answer) => {
    if (submitting) return;

    const question = assessment.questions[currentQuestion];

    setAnswers((previous) => ({
      ...previous,
      [question._id]: answer,
    }));
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const nextQuestion = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  // ==========================================
  // SUBMIT ASSESSMENT
  // ==========================================

  const submitAssessment = async () => {
    try {
      setSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in");
      }

      const formattedQuestions = assessment.questions.map((question) => ({
        questionId: question._id,
      }));

      const formattedAnswers = assessment.questions.map(
        (question) => answers[question._id] || ""
      );

      const unanswered = formattedAnswers.find((answer) => !answer);

      if (unanswered) {
        throw new Error(
          "Please answer all questions before submitting."
        );
      }

      const response = await fetch(`${API_URL}/api/assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: assessment.subject,
          topic: assessment.topic,
          difficulty: assessment.difficulty,
          questions: formattedQuestions,
          answers: formattedAnswers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit assessment"
        );
      }

      setResult(data);
    } catch (error) {
      console.error("Assessment submission error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // RESET
  // ==========================================

  const takeAnotherAssessment = () => {
    setAssessment(null);
    setResult(null);
    setAnswers({});
    setCurrentQuestion(0);
    setError("");
  };

  // ==========================================
  // RESULT SCREEN
  // ==========================================

  if (result) {
    const score = Number(result.result.percentage || 0);

    const performance =
      score >= 75
        ? {
          label: "Strong performance",
          description:
            "You have a solid understanding of this topic. Continue building depth through targeted practice.",
        }
        : score >= 50
          ? {
            label: "Developing understanding",
            description:
              "You have a foundation in this topic. Focused learning and another assessment can strengthen it.",
          }
          : {
            label: "Needs more practice",
            description:
              "This topic needs more attention. Start a focused learning session before attempting another assessment.",
          };

    return (
      <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
        <BackgroundGrid />

        <div className="relative z-10 mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          {/* Top navigation */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>

            <div className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 sm:flex">
              <ClipboardCheck size={14} />
              Assessment Result
            </div>
          </div>

          {/* Result header */}
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a1728] shadow-2xl shadow-black/20">
            <div className="border-b border-white/10 px-5 py-8 sm:px-8 sm:py-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                    <CheckCircle2 size={15} />
                    Assessment completed
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    Your results are ready.
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                    Your performance has been recorded and your learning
                    profile has been updated.
                  </p>
                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                  <Trophy size={28} />
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
              {/* Score */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#081422] p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Overall score
                </p>

                <div className="mt-6 flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-blue-500/20 bg-[#0b1d31]">
                  <div className="text-center">
                    <p className="text-5xl font-bold tracking-tight">
                      {score}%
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Performance
                    </p>
                  </div>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
                  <Gauge size={15} className="text-blue-400" />
                  {performance.label}
                </div>
              </div>

              {/* Details */}
              <div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <ResultMetric
                    label="Questions"
                    value={result.result.totalQuestions}
                  />

                  <ResultMetric
                    label="Correct"
                    value={result.result.correctAnswers}
                    accent
                  />

                  <ResultMetric
                    label="Difficulty"
                    value={result.result.difficulty}
                    capitalize
                    className="col-span-2 sm:col-span-1"
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-blue-400/10 bg-blue-500/[0.05] p-5">
                  <div className="flex items-start gap-3">
                    <Target
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-400"
                    />

                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        {result.result.topic}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {result.result.subject}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {performance.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next steps */}
                <div className="mt-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    What would you like to do next?
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <ActionButton
                      primary
                      icon={<BookOpen size={18} />}
                      title="Start Learning"
                      description="Study this topic with your AI teacher"
                      onClick={() =>
                        router.push(
                          `/teacher?subject=${encodeURIComponent(
                            result.result.subject
                          )}&topic=${encodeURIComponent(
                            result.result.topic
                          )}`
                        )
                      }
                    />

                    <ActionButton
                      icon={<BarChart3 size={18} />}
                      title="View Dashboard"
                      description="Review your overall performance"
                      onClick={() => router.push("/dashboard")}
                    />

                    <ActionButton
                      icon={<RotateCcw size={18} />}
                      title="Take Another Assessment"
                      description="Measure your progress again"
                      onClick={takeAnotherAssessment}
                    />

                    <ActionButton
                      icon={<Brain size={18} />}
                      title="Open Learning Path"
                      description="Continue your recommended topics"
                      onClick={() => router.push("/learning")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
            <Zap size={13} />
            Your performance will continue to shape your adaptive study plan.
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ASSESSMENT QUESTIONS
  // ==========================================

  if (assessment) {
    const question = assessment.questions[currentQuestion];
    const selectedAnswer = answers[question._id];
    const isLastQuestion =
      currentQuestion === assessment.questions.length - 1;

    const progress =
      ((currentQuestion + 1) / assessment.questions.length) * 100;

    const answeredCount = Object.keys(answers).length;

    return (
      <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
        <BackgroundGrid />

        <div className="relative z-10 mx-auto min-h-screen w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          {/* Header */}
          <header className="mb-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                  <ClipboardCheck size={14} />
                  Knowledge Assessment
                </div>

                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  {assessment.topic}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span>{assessment.subject}</span>
                  <span className="text-slate-700">•</span>
                  <span className="capitalize">
                    {assessment.difficulty}
                  </span>
                  <span className="text-slate-700">•</span>
                  <span>{assessment.questions.length} questions</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0a1728] px-4 py-3 sm:min-w-[145px] sm:justify-center">
                <span className="text-xs uppercase tracking-wider text-slate-500 sm:hidden">
                  Question
                </span>

                <span className="text-sm font-semibold text-white">
                  {currentQuestion + 1}
                  <span className="mx-1 text-slate-600">/</span>
                  <span className="text-slate-400">
                    {assessment.questions.length}
                  </span>
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Assessment progress
                </span>
                <span className="font-medium text-slate-400">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </header>

          {/* Main */}
          <div className="grid gap-5 lg:grid-cols-[1fr_230px]">
            <section className="rounded-3xl border border-white/10 bg-[#0a1728] shadow-2xl shadow-black/10">
              <div className="border-b border-white/[0.07] px-5 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-300 ring-1 ring-blue-400/10">
                    {currentQuestion + 1}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Question
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      Select the best answer
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-7 sm:px-8 sm:py-9">
                <h2 className="max-w-3xl text-xl font-semibold leading-8 tracking-tight text-white sm:text-2xl sm:leading-9">
                  {question.questionText}
                </h2>

                <div className="mt-8 space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;

                    return (
                      <button
                        key={index}
                        onClick={() => selectAnswer(option)}
                        disabled={submitting}
                        className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${isSelected
                          ? "border-blue-400/50 bg-blue-500/[0.08]"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                          }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition ${isSelected
                            ? "border-blue-400/40 bg-blue-500 text-white"
                            : "border-white/10 bg-white/[0.03] text-slate-500 group-hover:text-slate-300"
                            }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>

                        <span
                          className={`pt-1 text-sm leading-6 sm:text-base ${isSelected
                            ? "font-medium text-white"
                            : "text-slate-300"
                            }`}
                        >
                          {option}
                        </span>

                        {isSelected && (
                          <CheckCircle2
                            size={19}
                            className="ml-auto mt-1 shrink-0 text-blue-400"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <ErrorMessage message={error} />
                )}

                {/* Navigation */}
                <div className="mt-9 flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0 || submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </button>

                  {!isLastQuestion ? (
                    <button
                      onClick={nextQuestion}
                      disabled={!selectedAnswer || submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continue
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={submitAssessment}
                      disabled={!selectedAnswer || submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Finish Assessment
                          <Check size={17} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Question navigator */}
            <aside className="rounded-2xl border border-white/10 bg-[#0a1728] p-5 lg:h-fit">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Questions
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {answeredCount} answered
                  </p>
                </div>

                <div className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-400">
                  {answeredCount}/{assessment.questions.length}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2 lg:grid-cols-4">
                {assessment.questions.map((item, index) => {
                  const answered = Boolean(
                    answers[item._id]
                  );
                  const active = index === currentQuestion;

                  return (
                    <button
                      key={item._id}
                      onClick={() => setCurrentQuestion(index)}
                      className={`flex h-10 items-center justify-center rounded-lg text-xs font-semibold transition ${active
                        ? "bg-blue-500 text-white"
                        : answered
                          ? "border border-blue-400/20 bg-blue-500/10 text-blue-300"
                          : "border border-white/[0.07] bg-white/[0.02] text-slate-500 hover:bg-white/[0.05]"
                        }`}
                    >
                      {answered && !active ? (
                        <Check size={14} />
                      ) : (
                        index + 1
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 hidden border-t border-white/[0.07] pt-5 lg:block">
                <div className="space-y-2 text-xs text-slate-500">
                  <Legend
                    className="bg-blue-500"
                    text="Current question"
                  />
                  <Legend
                    className="border border-blue-400/20 bg-blue-500/10"
                    text="Answered"
                  />
                  <Legend
                    className="border border-white/[0.07] bg-white/[0.02]"
                    text="Not answered"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // SETUP SCREEN
  // ==========================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <BackgroundGrid />

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>

          <div className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 sm:flex">
            <ClipboardCheck size={14} />
            Assessment Center
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.8fr]">
          {/* Intro */}
          <section className="pt-3 lg:pt-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
              <ClipboardCheck size={23} />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
              Performance Assessment
            </p>

            <h1 className="mt-3 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
              Measure what you actually know.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Evaluate your understanding of a topic and use the result
              to guide what you should learn next.
            </p>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              <InfoItem
                icon={<Target size={16} />}
                title="Focused"
                text="One topic at a time"
              />
              <InfoItem
                icon={<Brain size={16} />}
                title="Adaptive"
                text="Built around your level"
              />
              <InfoItem
                icon={<BarChart3 size={16} />}
                title="Tracked"
                text="Added to your profile"
              />
            </div>
          </section>

          {/* Form */}
          <section className="rounded-3xl border border-white/10 bg-[#0a1728] p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="border-b border-white/[0.07] pb-5">
              <p className="text-sm font-semibold text-white">
                Configure assessment
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Choose the topic and difficulty you want to evaluate.
              </p>
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="mt-6 space-y-5">
              <Field
                label="Subject"
                value={subject}
                onChange={setSubject}
                placeholder="e.g. Machine Learning"
              />

              <Field
                label="Topic"
                value={topic}
                onChange={setTopic}
                placeholder="e.g. PCA"
              />

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Difficulty
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {["easy", "medium", "hard"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`rounded-xl border px-3 py-3 text-sm font-medium capitalize transition ${difficulty === level
                        ? "border-blue-400/40 bg-blue-500/10 text-blue-300"
                        : "border-white/[0.08] bg-white/[0.02] text-slate-500 hover:text-slate-300"
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Number of questions
                </label>

                <select
                  value={numberOfQuestions}
                  onChange={(e) =>
                    setNumberOfQuestions(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#081522] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/10"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-start gap-3">
                  <Zap
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-400"
                  />
                  <p className="text-xs leading-5 text-slate-500">
                    Your result will update your topic performance and
                    help determine what you should focus on next.
                  </p>
                </div>
              </div>

              <button
                onClick={generateAssessment}
                disabled={
                  loading ||
                  !subject.trim() ||
                  !topic.trim()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Preparing assessment...
                  </>
                ) : (
                  <>
                    Begin Assessment
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ================================================= */
/* COMPONENTS */
/* ================================================= */

function BackgroundGrid() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="pointer-events-none fixed -top-40 left-1/2 h-80 w-[32rem] -translate-x-1/2 rounded-full bg-blue-500/[0.05] blur-3xl" />
    </>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.08] bg-[#081522] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/10"
      />
    </div>
  );
}

function ResultMetric({
  label,
  value,
  accent = false,
  capitalize = false,
  className = "",
}) {
  return (
    <div
      className={`rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 ${className}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${accent ? "text-blue-300" : "text-white"
          } ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function ActionButton({
  primary = false,
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition ${primary
        ? "border-blue-400/30 bg-blue-500/[0.08] hover:border-blue-400/50 hover:bg-blue-500/[0.12]"
        : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
        }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${primary
          ? "bg-blue-500 text-white"
          : "bg-white/[0.05] text-slate-400 group-hover:text-white"
          }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <ArrowRight
        size={15}
        className="ml-auto mt-1 shrink-0 text-slate-600 transition group-hover:text-slate-300"
      />
    </button>
  );
}

function InfoItem({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="text-blue-400">{icon}</div>
      <p className="mt-3 text-sm font-medium text-slate-200">
        {title}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-600">{text}</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.06] p-4">
      <XCircle
        size={17}
        className="mt-0.5 shrink-0 text-red-400"
      />
      <p className="text-sm leading-5 text-red-300">{message}</p>
    </div>
  );
}

function Legend({ className, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-sm ${className}`} />
      {text}
    </div>
  );
}