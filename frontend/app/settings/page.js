
"use client";

import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  SlidersHorizontal,
  Bell,
  Brain,
  LogOut,
  Check,
} from "lucide-react";
import AppShell from "../components/layout/AppShell";
import { apiRequest } from "../../src/lib/api";

export default function Settings() {
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState("10");
  const [studyReminders, setStudyReminders] = useState(true);
  const [recommendations, setRecommendations] = useState(true);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/api/settings");

        const settings = data.settings || data;

        setDifficulty(settings.difficulty || "medium");
        setQuestionCount(String(settings.questionCount || 10));
        setStudyReminders(
          settings.studyReminders !== undefined
            ? settings.studyReminders
            : true
        );
        setRecommendations(
          settings.recommendations !== undefined
            ? settings.recommendations
            : true
        );
      } catch (error) {
        console.error("Settings loading error:", error);
        setError(error.message || "Unable to load settings");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function saveSettings() {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      await apiRequest("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          difficulty,
          questionCount: Number(questionCount),
          studyReminders,
          recommendations,
        }),
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Settings save error:", error);
      setError(error.message || "Unable to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <main className="px-5 py-6 md:px-8 lg:px-10">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="text-sm text-slate-400">
              Loading your settings...
            </div>
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="px-5 py-6 md:px-8 lg:px-10">
        {/* Header */}
        <section className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <SettingsIcon size={16} />
            <span>Preferences</span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
            Configure how your adaptive learning experience works.
          </p>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main settings */}
          <section className="space-y-6">
            {/* Learning preferences */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <SlidersHorizontal size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Learning Preferences
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Customize the difficulty and size of your practice
                    sessions.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {/* Difficulty */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Default Difficulty
                  </label>

                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Question count */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Questions Per Session
                  </label>

                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40"
                  >
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="15">15 Questions</option>
                    <option value="20">20 Questions</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <Bell size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Notifications
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Control the learning notifications shown by the platform.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Study reminders */}
                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Study Reminders
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Receive reminders to continue your learning sessions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setStudyReminders((current) => !current)
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      studyReminders
                        ? "bg-blue-500"
                        : "bg-slate-700"
                    }`}
                    aria-label="Toggle study reminders"
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        studyReminders ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Recommendations */}
                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Learning Recommendations
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Allow the adaptive system to generate recommended
                      learning topics.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setRecommendations((current) => !current)
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      recommendations
                        ? "bg-blue-500"
                        : "bg-slate-700"
                    }`}
                    aria-label="Toggle learning recommendations"
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        recommendations ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center justify-end gap-3">
              {saved && (
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <Check size={17} />
                  Settings saved
                </div>
              )}

              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>

          {/* Side information */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                <Brain size={21} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-white">
                Adaptive Learning
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your preferences help shape the practice experience. The
                adaptive system can use your performance and selected
                difficulty to personalize your learning path.
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/10 bg-red-500/[0.03] p-6">
              <h2 className="text-lg font-semibold text-white">
                Account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign out of your current Adaptive Study Partner session.
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}

