"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Brain,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

import AppShell from "../components/layout/AppShell";
import { apiRequest } from "../../src/lib/api";

export default function LearningPage() {
  const router = useRouter();

  const [progress, setProgress] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");



  useEffect(() => {
    loadLearningProgress();
  }, []);

  async function loadLearningProgress() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        "/api/learning-progress"
      );

      setProgress(data.learningProgress);
    } catch (error) {
      console.error(
        "Learning progress error:",
        error
      );



      if (
        error.message
          ?.toLowerCase()
          .includes("no learning progress")
      ) {
        setProgress(null);
      } else {
        setError(
          error.message ||
          "Unable to load learning progress."
        );
      }
    } finally {
      setLoading(false);
    }
  }



  async function generateRecommendations() {
    try {
      setGenerating(true);
      setError("");

      const data = await apiRequest(
        "/api/learning/recommendations"
      );

      setRecommendation(data.recommendation);

      if (data.learningProgress) {
        setProgress((previous) => ({
          ...previous,
          ...data.learningProgress,
        }));
      } else {
        await loadLearningProgress();
      }
    } catch (error) {
      console.error(
        "Recommendation error:",
        error
      );

      setError(
        error.message ||
        "Unable to generate recommendations."
      );
    } finally {
      setGenerating(false);
    }
  }



  function startLearning(topic, subject) {
    const params = new URLSearchParams({
      topic,
      subject,
    });

    router.push(
      `/teacher?${params.toString()}`
    );
  }



  function startQuiz(topic, subject) {
    const params = new URLSearchParams({
      topic,
      subject,
    });

    router.push(
      `/quizzes?${params.toString()}`
    );
  }



  if (loading) {
    return (
      <AppShell>
        <main className="flex min-h-screen items-center justify-center bg-[#07111f]">

          <div className="text-center">

            <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">

              <Brain
                size={25}
                className="text-indigo-400"
              />

              <div className="absolute inset-0 animate-ping rounded-2xl border border-indigo-400/20" />

            </div>

            <p className="text-sm text-slate-400">
              Loading your learning journey...
            </p>

          </div>

        </main>
      </AppShell>
    );
  }



  const currentTopic =
    progress?.currentTopic || "";

  const subject =
    progress?.subject || "Machine Learning";

  const status =
    progress?.learningStatus ||
    "not_started";

  const completedTopics =
    progress?.completedTopics || [];



  const recommendedTopics =
    recommendation?.recommendedTopics ||
    progress?.recommendedTopics ||
    [];

  const analysis =
    recommendation?.analysis || null;



  return (
    <AppShell>

      <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">



        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -left-52 -top-52 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />

          <div className="absolute right-[-250px] top-[400px] h-[550px] w-[550px] rounded-full bg-blue-600/10 blur-[140px]" />

        </div>


        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">



          <section className="mb-8">

            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

              <div>

                <div className="mb-3 flex items-center gap-2 text-indigo-400">

                  <Sparkles size={16} />

                  <span className="text-sm font-medium">
                    Personalized Learning
                  </span>

                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Your Learning Path
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">

                  Follow a personalized learning journey
                  generated from your actual assessment and
                  quiz performance.

                </p>

              </div>


              <button
                onClick={generateRecommendations}
                disabled={generating}
                className="flex w-fit items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {generating ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Analyzing performance...
                  </>
                ) : (
                  <>
                    <RefreshCw size={17} />
                    Refresh AI Recommendations
                  </>
                )}

              </button>

            </div>

          </section>




          {error && (

            <section className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">

              <div className="flex items-start gap-3">

                <AlertTriangle
                  size={19}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <div>

                  <p className="text-sm font-medium text-red-300">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-300/70">
                    {error}
                  </p>

                </div>

              </div>

            </section>

          )}




          {!progress && (

            <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0d1b2e] p-8 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">

                <Brain
                  size={30}
                  className="text-indigo-400"
                />

              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Build your personalized path
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">

                Your performance data is ready.
                Let the AI analyze your strengths and
                identify what you should learn next.

              </p>

              <button
                onClick={generateRecommendations}
                disabled={generating}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold transition hover:bg-indigo-400 disabled:opacity-50"
              >

                {generating ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Building learning path...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Generate Learning Path
                  </>
                )}

              </button>

            </section>

          )}


          {progress && (
            <>



              <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0d1b2e] p-6 shadow-2xl shadow-black/10 sm:p-8">

                <div className="relative">

                  <div className="absolute -right-20 -top-24 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />


                  <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

                    <div className="max-w-2xl">

                      <div className="flex items-center gap-2">

                        <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">

                          <BookOpen size={19} />

                        </div>

                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Current Learning Topic
                        </span>

                      </div>


                      <h2 className="mt-5 text-2xl font-bold sm:text-3xl">

                        {currentTopic ||
                          "Choose your next topic"}

                      </h2>


                      <p className="mt-2 text-sm text-slate-400">

                        {subject}

                      </p>


                      <div className="mt-5 flex flex-wrap items-center gap-3">

                        <StatusBadge status={status} />

                        <div className="flex items-center gap-2 text-xs text-slate-500">

                          <Brain size={14} />

                          AI-guided learning

                        </div>

                      </div>

                    </div>


                    {currentTopic && (

                      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">

                        <button
                          onClick={() =>
                            startLearning(
                              currentTopic,
                              subject
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-400"
                        >

                          Continue Learning

                          <ArrowRight size={17} />

                        </button>


                        <button
                          onClick={() =>
                            startQuiz(
                              currentTopic,
                              subject
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                        >

                          <Target size={17} />

                          Practice Quiz

                        </button>

                      </div>

                    )}

                  </div>

                </div>

              </section>




              {analysis && (

                <section className="mb-8 rounded-3xl border border-indigo-400/10 bg-indigo-500/[0.05] p-6">

                  <div className="flex items-start gap-4">

                    <div className="shrink-0 rounded-xl bg-indigo-500/10 p-3 text-indigo-400">

                      <Brain size={20} />

                    </div>


                    <div>

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
                        AI Performance Analysis
                      </p>

                      <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
                        {analysis}
                      </p>

                    </div>

                  </div>

                </section>

              )}




              <section className="mb-8">

                <div className="mb-5 flex items-end justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2">

                      <Sparkles
                        size={18}
                        className="text-indigo-400"
                      />

                      <h2 className="text-xl font-semibold">
                        Recommended Topics
                      </h2>

                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Topics selected according to your current
                      performance.
                    </p>

                  </div>


                  <span className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-500 sm:block">

                    {recommendedTopics.length} recommended

                  </span>

                </div>


                {recommendedTopics.length === 0 ? (

                  <div className="rounded-3xl border border-white/10 bg-[#0d1b2e] p-10 text-center">

                    <Brain
                      size={34}
                      className="mx-auto text-slate-600"
                    />

                    <p className="mt-4 font-medium text-slate-300">
                      No recommendations available
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Refresh your AI recommendations after
                      completing an assessment.
                    </p>

                  </div>

                ) : (

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {recommendedTopics.map(
                      (item, index) => (

                        <RecommendationCard
                          key={`${item.topic}-${index}`}
                          item={item}
                          index={index}
                          defaultSubject={subject}
                          startLearning={
                            startLearning
                          }
                          startQuiz={startQuiz}
                        />

                      )
                    )}

                  </div>

                )}

              </section>




              <section className="grid gap-6 lg:grid-cols-3">



                <div className="rounded-3xl border border-white/10 bg-[#0d1b2e] p-6 lg:col-span-2">

                  <div className="mb-5 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-400">

                        <CheckCircle2 size={19} />

                      </div>


                      <div>

                        <h2 className="font-semibold">
                          Completed Topics
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Your learning achievements
                        </p>

                      </div>

                    </div>


                    <span className="text-sm font-semibold text-emerald-400">

                      {completedTopics.length}

                    </span>

                  </div>


                  {completedTopics.length === 0 ? (

                    <div className="rounded-2xl border border-white/5 bg-[#091626] p-8 text-center">

                      <Clock3
                        size={29}
                        className="mx-auto text-slate-600"
                      />

                      <p className="mt-3 text-sm text-slate-400">
                        Your completed topics will appear here.
                      </p>

                    </div>

                  ) : (

                    <div className="space-y-3">

                      {completedTopics.map(
                        (item, index) => (

                          <div
                            key={`${item.topic}-${index}`}
                            className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#091626] p-4"
                          >

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">

                                <CheckCircle2
                                  size={17}
                                />

                              </div>


                              <div>

                                <p className="text-sm font-medium">
                                  {item.topic}
                                </p>

                                <p className="mt-1 text-xs text-slate-600">

                                  {item.completedAt
                                    ? new Date(
                                      item.completedAt
                                    ).toLocaleDateString()
                                    : "Completed"}

                                </p>

                              </div>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>




                <div className="rounded-3xl border border-white/10 bg-[#0d1b2e] p-6">

                  <div className="mb-5">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
                      Adaptive Cycle
                    </p>

                    <h2 className="mt-2 font-semibold">
                      How you improve
                    </h2>

                  </div>


                  <LearningStep
                    number="01"
                    title="Learn"
                    text="Study with your AI Teacher."
                  />

                  <LearningStep
                    number="02"
                    title="Practice"
                    text="Test yourself with fresh questions."
                  />

                  <LearningStep
                    number="03"
                    title="Analyze"
                    text="Your performance profile updates."
                  />

                  <LearningStep
                    number="04"
                    title="Adapt"
                    text="AI recommends what comes next."
                    last
                  />

                </div>

              </section>

            </>
          )}

        </div>

      </main>

    </AppShell>
  );
}




function RecommendationCard({
  item,
  index,
  defaultSubject,
  startLearning,
  startQuiz,
}) {



  let priority = item.priority;

  if (priority === 3) {
    priority = "high";
  } else if (priority === 2) {
    priority = "medium";
  } else if (priority === 1) {
    priority = "low";
  }

  priority =
    String(priority || "medium").toLowerCase();


  const priorityStyles = {

    high:
      "border-red-400/20 bg-red-400/10 text-red-300",

    medium:
      "border-amber-400/20 bg-amber-400/10 text-amber-300",

    low:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",

  };


  const topicSubject =
    item.subject || defaultSubject;


  return (

    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1b2e] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-[#10213a]">

      <div className="absolute -right-14 -top-14 h-28 w-28 rounded-full bg-indigo-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />


      <div className="relative">

        <div className="flex items-start justify-between gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10 text-indigo-400">

            <Brain size={20} />

          </div>


          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-medium capitalize ${priorityStyles[priority] ||
              priorityStyles.medium
              }`}
          >

            {priority} priority

          </span>

        </div>


        <div className="mt-5">

          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">

            Recommendation {index + 1}

          </p>


          <h3 className="mt-2 text-lg font-semibold text-white">

            {item.topic}

          </h3>


          <p className="mt-1 text-xs text-indigo-300/70">

            {topicSubject}

          </p>

        </div>


        <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-400">

          {item.reason ||
            "Recommended according to your current learning performance."}

        </p>


        <div className="mt-5 flex gap-2">

          <button
            onClick={() =>
              startLearning(
                item.topic,
                topicSubject
              )
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-3 py-2.5 text-xs font-semibold transition hover:bg-indigo-400"
          >

            Start Learning

            <ChevronRight size={15} />

          </button>


          <button
            onClick={() =>
              startQuiz(
                item.topic,
                topicSubject
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            title="Take quiz"
          >

            <Target size={16} />

          </button>

        </div>

      </div>

    </article>

  );
}




function StatusBadge({ status }) {

  const labels = {

    not_started: "Not Started",

    in_progress: "In Progress",

    completed: "Completed",

  };


  const styles = {

    not_started:
      "border-slate-400/20 bg-slate-400/10 text-slate-300",

    in_progress:
      "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",

    completed:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",

  };


  return (

    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[status] ||
        styles.not_started
        }`}
    >

      {labels[status] || status}

    </span>

  );
}




function LearningStep({
  number,
  title,
  text,
  last = false,
}) {

  return (

    <div className="relative flex gap-3">

      <div className="flex flex-col items-center">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-400/20 bg-indigo-500/10 text-[10px] font-semibold text-indigo-300">

          {number}

        </div>


        {!last && (

          <div className="my-2 h-8 w-px bg-white/10" />

        )}

      </div>


      <div className="pb-5">

        <p className="text-sm font-medium text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {text}
        </p>

      </div>

    </div>

  );
}