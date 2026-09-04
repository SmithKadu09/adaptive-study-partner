"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Target,
  Loader2,
  AlertCircle,
} from "lucide-react";

import AppShell from "../components/layout/AppShell";
import { apiRequest } from "../../src/lib/api";

export default function ProgressPage() {
  const router = useRouter();

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/api/learning-progress");

        setProgress(data.learningProgress);
      } catch (error) {
        console.error("Progress error:", error);
        setError(error.message || "Unable to load learning progress");
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  function startLearning(topic, subject) {
    const params = new URLSearchParams({
      topic,
      subject,
    });

    router.push(`/teacher?${params.toString()}`);
  }

  function getPriorityLabel(priority) {
    if (priority === 1) return "High";
    if (priority === 2) return "Medium";
    return "Low";
  }

  function getPriorityClass(priority) {
    if (priority === 1) {
      return "bg-red-500/10 text-red-300 border-red-400/20";
    }

    if (priority === 2) {
      return "bg-yellow-500/10 text-yellow-300 border-yellow-400/20";
    }

    return "bg-blue-500/10 text-blue-300 border-blue-400/20";
  }

  function getStatusLabel(status) {
    if (status === "in_progress") return "In Progress";
    if (status === "completed") return "Completed";
    return "Not Started";
  }

  function getStatusIcon(status) {
    if (status === "completed") {
      return <CheckCircle2 size={17} />;
    }

    if (status === "in_progress") {
      return <PlayCircle size={17} />;
    }

    return <Clock3 size={17} />;
  }

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="animate-spin" size={30} />
            <p>Loading your learning progress...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="max-w-md w-full rounded-2xl border border-red-400/20 bg-red-500/5 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-300">
              <AlertCircle size={24} />
            </div>

            <h2 className="text-lg font-semibold text-white">
              Unable to load progress
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!progress) {
    return (
      <AppShell>
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-300">
              <BookOpen size={30} />
            </div>

            <h2 className="text-2xl font-semibold text-white">
              No learning progress yet
            </h2>

            <p className="mt-2 text-slate-400">
              Complete an assessment and get your first learning
              recommendation to start building your learning path.
            </p>

            <button
              onClick={() => router.push("/learning")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Go to Learning
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const recommendations = progress.recommendedTopics || [];
  const completedTopics = progress.completedTopics || [];

  return (
    <AppShell>
      <main className="px-5 py-6 md:px-8 lg:px-10">

        
        <section className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Sparkles size={16} />
            <span>Your learning journey</span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Learning Progress
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
            Track where you are, what you should learn next, and the topics
            you have already completed.
          </p>
        </section>

        
        <section className="grid gap-4 md:grid-cols-3">

          
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Current Subject</p>

                <h2 className="mt-2 text-xl font-semibold text-white">
                  {progress.subject || "Not specified"}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                <BookOpen size={22} />
              </div>
            </div>
          </div>

          
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Learning Status</p>

                <div className="mt-2 flex items-center gap-2 text-xl font-semibold text-white">
                  {getStatusIcon(progress.learningStatus)}
                  {getStatusLabel(progress.learningStatus)}
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                <Target size={22} />
              </div>
            </div>
          </div>

          
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Completed Topics
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  {completedTopics.length}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

        </section>

        
        <section className="mt-6">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6">

            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-300">
                <PlayCircle size={17} />
                Continue Learning
              </div>

              <h2 className="mt-3 text-2xl font-bold text-white">
                {progress.currentTopic || "No active topic"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Continue with your current topic and learn interactively
                with your AI Teacher.
              </p>

              {progress.currentTopic && (
                <button
                  onClick={() =>
                    startLearning(
                      progress.currentTopic,
                      progress.subject
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Continue Learning
                  <ArrowRight size={17} />
                </button>
              )}
            </div>
          </div>
        </section>

        
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">
              Recommended Topics
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Topics selected by your adaptive learning system.
            </p>
          </div>

          {recommendations.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-slate-400">
              No recommendations available right now.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {recommendations.map((item, index) => (
                <div
                  key={`${item.topic}-${index}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-200 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">
                          {item.topic}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                            item.priority
                          )}`}
                        >
                          {getPriorityLabel(item.priority)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {progress.subject}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-300">
                      <BookOpen size={19} />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {item.reason || "Recommended for your learning path."}
                  </p>

                  <button
                    onClick={() =>
                      startLearning(
                        item.topic,
                        progress.subject
                      )
                    }
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-blue-300"
                  >
                    Start Learning
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        
        <section className="mt-8 pb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">
              Completed Topics
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Topics you have already completed in your learning path.
            </p>
          </div>

          {completedTopics.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <CheckCircle2
                size={28}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                No completed topics yet.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Your completed topics will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {completedTopics.map((item, index) => (
                <div
                  key={`${item.topic}-${index}`}
                  className={`flex items-center justify-between gap-4 p-5 ${
                    index !== completedTopics.length - 1
                      ? "border-b border-white/10"
                      : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                      <CheckCircle2 size={19} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-white">
                        {item.topic}
                      </h3>

                      {item.completedAt && (
                        <p className="mt-1 text-xs text-slate-500">
                          Completed{" "}
                          {new Date(item.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-medium text-emerald-300">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </AppShell>
  );
}