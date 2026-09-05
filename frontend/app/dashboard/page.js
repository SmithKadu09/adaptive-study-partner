"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  Target,
  TrendingUp,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import AppShell from "../components/layout/AppShell";
import { apiRequest } from "../../src/lib/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [learning, setLearning] = useState(null);

  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [learningError, setLearningError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setDashboardError("");
      setLearningError("");


      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse stored user:", error);
        }
      }

      const [meResult, dashboardResult, learningResult] =
        await Promise.allSettled([
          apiRequest("/api/auth/me"),
          apiRequest("/api/dashboard"),
          apiRequest("/api/learning-progress"),
        ]);

      console.log("DASHBOARD PERFORMANCE:", dashboardResult);

      /*
       * ----------------------------------------------------
       * USER
       * ----------------------------------------------------
       */

      if (meResult.status === "fulfilled" && meResult.value?.user) {
        setUser(meResult.value.user);

        localStorage.setItem(
          "user",
          JSON.stringify(meResult.value.user)
        );
      }

      /*
       * ----------------------------------------------------
       * DASHBOARD
       * ----------------------------------------------------
       */

      if (dashboardResult.status === "fulfilled") {
        setDashboard(dashboardResult.value);
      } else {
        console.error(
          "Dashboard API error:",
          dashboardResult.reason
        );

        setDashboardError(
          dashboardResult.reason?.message ||
          "Unable to load dashboard data."
        );
      }

      /*
       * ----------------------------------------------------
       * LEARNING PROGRESS
       * ----------------------------------------------------
       */

      if (learningResult.status === "fulfilled") {
        const learningResponse = learningResult.value;

        setLearning(
          learningResponse?.learningProgress ||
          learningResponse?.progress ||
          learningResponse?.data ||
          learningResponse ||
          null
        );
      } else {
        console.error(
          "Learning progress API error:",
          learningResult.reason
        );

        setLearningError(
          learningResult.reason?.message ||
          "Unable to load learning progress."
        );
      }
    } catch (error) {
      console.error("Dashboard loading error:", error);

      setDashboardError(
        error?.message || "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }


  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /*
  
  * ---
  * NORMALIZE DASHBOARD DATA
  * ---
  
  */

  const totalAssessments = Number(
    dashboard?.totalAssessments ?? 0
  );

  const totalQuestions = Number(
    dashboard?.totalQuestions ?? 0
  );

  const correctAnswers = Number(
    dashboard?.correctAnswers ?? 0
  );

  const totalScore = Number(
    dashboard?.totalScore ?? 0
  );

  const averageScore = Number(
    dashboard?.averageScore ??
    (totalQuestions > 0
      ? (correctAnswers / totalQuestions) * 100
      : 0)
  );

  const displayScore = Math.round(
    Math.min(100, Math.max(0, averageScore || 0))
  );

  const strongTopics = Array.isArray(dashboard?.strongTopics)
    ? dashboard.strongTopics
    : [];

  const averageTopics = Array.isArray(dashboard?.averageTopics)
    ? dashboard.averageTopics
    : [];

  const weakTopics = Array.isArray(dashboard?.weakTopics)
    ? dashboard.weakTopics
    : [];

  const allTopics = Array.isArray(dashboard?.topics)
    ? dashboard.topics
    : [];

  const recommendedTopics = Array.isArray(
    learning?.recommendedTopics
  )
    ? learning.recommendedTopics
    : [];

  const completedTopics = Array.isArray(
    learning?.completedTopics
  )
    ? learning.completedTopics.length
    : Number(learning?.completedTopicsCount ?? 0);

  const currentTopic =
    learning?.currentTopic ||
    recommendedTopics[0]?.topic ||
    weakTopics[0]?.topic ||
    "No learning target yet";

  const learningStatus =
    learning?.learningStatus ||
    "not_started";

  const firstName =
    user?.name?.split(" ")[0] ||
    user?.name ||
    "Student";

  /*
  
  * ---
  * PERFORMANCE LABEL
  * ---
  
  */

  const performanceLabel = useMemo(() => {
    if (displayScore >= 80) return "Strong performance";
    if (displayScore >= 60) return "Good progress";
    if (displayScore >= 40) return "Needs improvement";
    return "Getting started";
  }, [displayScore]);

  const performanceMessage = useMemo(() => {
    if (displayScore >= 80) {
      return "Your performance is strong. Keep challenging yourself with more advanced topics.";
    }


    if (displayScore >= 60) {
      return "You're making steady progress. Focus on weaker areas to improve further.";
    }

    if (displayScore >= 40) {
      return "You have a foundation to build on. Consistent practice can strengthen your weaker topics.";
    }

    if (totalAssessments === 0) {
      return "Complete your first assessment to build your personalized learning profile.";
    }

    return "Keep practicing. Your adaptive learning profile will become more useful as you complete more assessments.";


  }, [displayScore, totalAssessments]);

  /*
  
  
  * TOPIC DATA
  * ---
  
  */


  const topicData = useMemo(() => {
    if (allTopics.length > 0) {
      return allTopics.slice(0, 6);
    }

    return [
      ...weakTopics,
      ...averageTopics,
      ...strongTopics,
    ].slice(0, 6);


  }, [
    allTopics,
    weakTopics,
    averageTopics,
    strongTopics,
  ]);

  const getTopicScore = (topic) => {
    const score = Number(topic?.score ?? 0);


    return Math.round(
      Math.min(100, Math.max(0, score))
    );


  };

  const getTopicLevel = (topic) => {
    const level = topic?.level || topic?.status;


    if (level === "strong") return "Strong";
    if (level === "average") return "Average";
    if (level === "weak") return "Needs work";

    const score = getTopicScore(topic);

    if (score >= 75) return "Strong";
    if (score >= 50) return "Average";

    return "Needs work";


  };

  const getTopicLevelClasses = (topic) => {
    const level = getTopicLevel(topic);




    if (level === "Strong") {
      return "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
    }

    if (level === "Average") {
      return "border-amber-500/20 bg-amber-500/5 text-amber-400";
    }

    return "border-rose-500/20 bg-rose-500/5 text-rose-400";


  };

  /*
  
  * ---
  * RENDER
  * ---
  
  */

  return (<AppShell> <div className="space-y-6 pb-8">


    {/* ------------------------------------------------
        HEADER
    ------------------------------------------------ */}

    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/10 bg-blue-500/10 text-blue-400">
            <Sparkles size={20} />
          </div>

          <div>
            <p className="text-sm font-medium text-blue-400">
              Adaptive learning dashboard
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Welcome back, {firstName}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {loading
                ? "Preparing your personalized learning overview..."
                : performanceMessage}
            </p>
          </div>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>
    </section>

    {/* ------------------------------------------------
        ERROR
    ------------------------------------------------ */}

    {dashboardError && (
      <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
        <AlertCircle
          size={17}
          className="mt-0.5 shrink-0 text-rose-400"
        />

        <div>
          <p className="text-sm font-medium text-rose-300">
            Dashboard data unavailable
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {dashboardError}
          </p>
        </div>
      </div>
    )}

    {/* ------------------------------------------------
        STATISTICS
    ------------------------------------------------ */}

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {/* Average score */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Target size={19} />
          </div>

          <span className="text-xs text-slate-500">
            Overall
          </span>
        </div>

        <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
          {loading ? "—" : `${displayScore}%`}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Average performance
        </p>
      </div>

      {/* Assessments */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={19} />
          </div>

          <span className="text-xs text-slate-500">
            Completed
          </span>
        </div>

        <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
          {loading ? "—" : totalAssessments}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Assessments taken
        </p>
      </div>

      {/* Questions */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <BookOpen size={19} />
          </div>

          <span className="text-xs text-slate-500">
            Practice
          </span>
        </div>

        <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
          {loading ? "—" : totalQuestions}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Questions attempted
        </p>
      </div>

      {/* Topics */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Brain size={19} />
          </div>

          <span className="text-xs text-slate-500">
            Learning
          </span>
        </div>

        <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
          {loading ? "—" : completedTopics}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Topics completed
        </p>
      </div>
    </section>

    {/* ------------------------------------------------
        PERFORMANCE + CURRENT FOCUS
    ------------------------------------------------ */}

    <section className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">

      {/* Performance */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3
                size={18}
                className="text-blue-400"
              />

              <h2 className="text-lg font-semibold text-white">
                Performance overview
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Your current learning performance
            </p>
          </div>

          <span className="w-fit rounded-full border border-slate-800 bg-slate-950/50 px-3 py-1 text-xs text-slate-400">
            {performanceLabel}
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center">

          {/* Score */}

          <div className="relative mx-auto flex h-40 w-40 shrink-0 items-center justify-center sm:mx-0">

            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-800"
              />

              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-blue-500 transition-all duration-700"
                strokeDasharray={`${displayScore * 3.14} 314`}
              />
            </svg>

            <div className="relative text-center">
              <p className="text-3xl font-semibold text-white">
                {loading ? "—" : displayScore}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                out of 100
              </p>
            </div>
          </div>

          {/* Details */}

          <div className="min-w-0 flex-1 space-y-6">

            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Correct answers
                </span>

                <span className="font-medium text-slate-300">
                  {loading
                    ? "—"
                    : `${correctAnswers}/${totalQuestions}`}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-700"
                  style={{
                    width: `${totalQuestions > 0
                      ? Math.min(
                        100,
                        (correctAnswers /
                          totalQuestions) *
                        100
                      )
                      : 0
                      }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Total score
                </span>

                <span className="font-medium text-slate-300">
                  {loading ? "—" : totalScore}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, totalScore || 0)
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp
                  size={15}
                  className="text-blue-400"
                />

                <span className="text-xs font-medium text-slate-300">
                  Performance insight
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {performanceMessage}
              </p>
            </div>
          </div>
        </div>

        {!loading &&
          totalAssessments === 0 &&
          !dashboardError && (
            <div className="mt-7 rounded-xl border border-dashed border-slate-800 bg-slate-950/30 px-5 py-6 text-center">
              <Target
                size={22}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm font-medium text-slate-400">
                Your performance profile is ready to build
              </p>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-600">
                Complete your first assessment and your
                scores will appear here automatically.
              </p>

              <a
                href="/assessment"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
              >
                Start assessment
                <ArrowRight size={14} />
              </a>
            </div>
          )}
      </div>

      {/* Current focus */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <TrendingUp size={18} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Current focus
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your next learning target
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-5">

          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Current topic
            </p>

            <span className="rounded-full border border-blue-500/20 bg-blue-500/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-blue-400">
              Adaptive
            </span>
          </div>

          <p className="mt-3 text-xl font-semibold leading-7 text-white">
            {loading ? "Loading..." : currentTopic}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {recommendedTopics[0]?.reason ||
              "Your next learning target will be selected from your performance data."}
          </p>
        </div>

        <a
          href="/learning"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-800/60"
        >
          Open learning path
          <ArrowRight size={16} />
        </a>
      </div>
    </section>

    {/* ------------------------------------------------
        TOPIC PERFORMANCE
    ------------------------------------------------ */}

    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Target
              size={18}
              className="text-blue-400"
            />

            <h2 className="text-lg font-semibold text-white">
              Topic performance
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            See where your knowledge is strongest and where more practice is needed.
          </p>
        </div>

        {topicData.length > 0 && (
          <span className="text-xs text-slate-600">
            {allTopics.length} tracked topics
          </span>
        )}
      </div>

      <div className="mt-6">

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse"
              >
                <div className="mb-2 flex justify-between">
                  <div className="h-3 w-32 rounded bg-slate-800" />
                  <div className="h-3 w-10 rounded bg-slate-800" />
                </div>

                <div className="h-2 rounded-full bg-slate-800" />
              </div>
            ))}
          </div>
        ) : topicData.length > 0 ? (
          <div className="space-y-5">
            {topicData.map((topic, index) => {
              const score = getTopicScore(topic);
              const level = getTopicLevel(topic);

              return (
                <div
                  key={`${topic.subject || "subject"}-${topic.topic || index}-${index}`}
                >
                  <div className="mb-2.5 flex items-center justify-between gap-4">

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-200">
                        {topic.topic || "Untitled topic"}
                      </p>

                      {topic.subject && (
                        <p className="mt-0.5 text-[11px] text-slate-600">
                          {topic.subject}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] font-medium ${getTopicLevelClasses(
                          topic
                        )}`}
                      >
                        {level}
                      </span>

                      <span className="w-10 text-right text-xs font-medium text-slate-300">
                        {score}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-700"
                      style={{
                        width: `${score}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/30 px-5 py-8 text-center">
            <BarChart3
              size={24}
              className="mx-auto text-slate-600"
            />

            <p className="mt-3 text-sm font-medium text-slate-400">
              No topic data yet
            </p>

            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-600">
              Complete an assessment to start tracking your
              performance across individual topics.
            </p>
          </div>
        )}
      </div>
    </section>

    {/* ------------------------------------------------
        AI RECOMMENDATIONS + LEARNING STATUS
    ------------------------------------------------ */}

    <section className="grid gap-6 lg:grid-cols-2">

      {/* Recommendations */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Brain
                size={18}
                className="text-blue-400"
              />

              <h2 className="text-lg font-semibold text-white">
                AI recommendations
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Topics selected from your learning progress
            </p>
          </div>

          <a
            href="/learning"
            className="hidden items-center gap-1 text-xs font-medium text-blue-400 transition hover:text-blue-300 sm:flex"
          >
            View all
            <ArrowRight size={14} />
          </a>
        </div>

        <div className="mt-6 space-y-3">

          {recommendedTopics.length > 0 ? (
            recommendedTopics
              .slice(0, 4)
              .map((topic, index) => (
                <div
                  key={`${topic.topic}-${index}`}
                  className="group rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700 hover:bg-slate-950/70"
                >
                  <div className="flex items-start gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <BookOpen size={15} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium text-white">
                          {topic.topic}
                        </p>

                        {topic.priority && (
                          <span className="shrink-0 text-[10px] uppercase tracking-wide text-slate-600">
                            P{topic.priority}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {topic.reason ||
                          "Recommended based on your learning performance."}
                      </p>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/30 px-5 py-8 text-center">
              <Brain
                size={24}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm font-medium text-slate-400">
                No recommendations yet
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Complete an assessment to allow the adaptive
                learning system to identify your next topics.
              </p>

              <a
                href="/assessment"
                className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                Take an assessment
                <ArrowRight size={14} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Learning status */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
            <Clock3 size={18} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Learning status
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your current adaptive learning state
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <span className="text-sm text-slate-400">
              Learning status
            </span>

            <span className="rounded-full border border-blue-500/20 bg-blue-500/5 px-2.5 py-1 text-xs font-medium capitalize text-blue-400">
              {learningStatus.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <span className="text-sm text-slate-400">
              Completed topics
            </span>

            <span className="text-sm font-semibold text-white">
              {completedTopics}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <span className="text-sm text-slate-400">
              Recommended topics
            </span>

            <span className="text-sm font-semibold text-white">
              {recommendedTopics.length}
            </span>
          </div>
        </div>

        {learningError && (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-xs leading-5 text-slate-500">
            Learning progress is not available yet. It
            will appear after your adaptive learning profile
            is created.
          </div>
        )}
      </div>
    </section>

    {/* ------------------------------------------------
        QUICK ACTIONS
    ------------------------------------------------ */}

    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Continue learning
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Choose your next activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        <a
          href="/assessments"
          className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-blue-500/20 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Target size={18} />
            </div>

            <ArrowRight
              size={17}
              className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
            />
          </div>

          <h3 className="mt-5 text-sm font-semibold text-white">
            Take an assessment
          </h3>

          <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
            Test your knowledge and update your adaptive
            learning profile.
          </p>
        </a>

        <a
          href="/quizzes"
          className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-violet-500/20 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <BookOpen size={18} />
            </div>

            <ArrowRight
              size={17}
              className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-violet-400"
            />
          </div>

          <h3 className="mt-5 text-sm font-semibold text-white">
            Practice with quizzes
          </h3>

          <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
            Generate targeted questions and strengthen your
            understanding.
          </p>
        </a>
      </div>
    </section>
  </div>
  </AppShell>


  );
}
