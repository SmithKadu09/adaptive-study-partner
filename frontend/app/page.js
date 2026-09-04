"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Brain,
  BookOpen,
  BarChart3,
  Sparkles,
  Target,
  CheckCircle2,
  Zap,
  Layers3,
  Bot,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden bg-[#06101d] text-white">

      
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

        <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="absolute right-[-180px] top-[15%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />

        <div className="absolute bottom-[-200px] left-[30%] h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[130px]" />
      </div>

      
      <nav className="relative z-20 border-b border-white/[0.08]">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 md:px-10 lg:px-12">

          
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-lg shadow-black/20">
              <Brain size={21} strokeWidth={2.2} />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold tracking-tight">
                Adaptive Study Partner
              </p>

              <p className="hidden text-[11px] text-slate-500 sm:block">
                Intelligence for better learning
              </p>
            </div>
          </button>

          
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="rounded-lg   px-8=4  py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              Sign in
            </button>

            <button
              onClick={() => router.push("/register")}
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Get started
            </button>
          </div>

        </div>
      </nav>

      
      <section className="relative z-10 px-6 pb-24 pt-20 md:px-10 md:pb-28 md:pt-28 lg:px-12">

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">

            
            <div>

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/[0.06] px-3.5 py-2 text-xs font-medium text-blue-200">
                <Sparkles size={14} />
                Adaptive learning powered by AI
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-[68px]">
                Your learning path
                <span className="block text-slate-500">
                  should adapt to you.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-[15px] leading-7 text-slate-400 md:text-base">
                Adaptive Study Partner analyzes your performance, identifies
                what you need to improve, and continuously builds your next
                learning step.
              </p>

              
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <button
                  onClick={() => router.push("/register")}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-xl shadow-black/20 transition hover:bg-slate-200"
                >
                  Start learning
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  onClick={() => router.push("/login")}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Sign in
                </button>

              </div>

              
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Performance driven
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  AI guided
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Continuously adaptive
                </div>

              </div>

            </div>

            
            <div className="relative">

              <div className="absolute -inset-8 rounded-[40px] bg-blue-500/[0.06] blur-3xl" />

              <div className="relative rounded-[24px] border border-white/[0.10] bg-[#0a1627]/95 p-2 shadow-2xl shadow-black/40">

                
                <div className="flex h-11 items-center justify-between border-b border-white/[0.07] px-4">

                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-white/15" />
                    <div className="h-2 w-2 rounded-full bg-white/15" />
                    <div className="h-2 w-2 rounded-full bg-white/15" />
                  </div>

                  <div className="text-[10px] text-slate-600">
                    adaptive-study-partner
                  </div>

                  <div className="w-8" />

                </div>

                
                <div className="p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[11px] text-slate-500">
                        Learning overview
                      </p>

                      <h3 className="mt-1 text-sm font-semibold">
                        Welcome back
                      </h3>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                      <Brain size={17} className="text-blue-300" />
                    </div>

                  </div>

                  
                  <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">

                    <div className="flex items-end justify-between">

                      <div>
                        <p className="text-[11px] text-slate-500">
                          Overall performance
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                          83%
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                        <BarChart3 size={14} />
                        Improving
                      </div>

                    </div>

                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full w-[83%] rounded-full bg-blue-400" />
                    </div>

                  </div>

                  
                  <div className="mt-3 grid grid-cols-3 gap-3">

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
                      <p className="text-[10px] text-slate-600">
                        Assessments
                      </p>

                      <p className="mt-2 text-lg font-semibold">
                        12
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
                      <p className="text-[10px] text-slate-600">
                        Questions
                      </p>

                      <p className="mt-2 text-lg font-semibold">
                        60
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
                      <p className="text-[10px] text-slate-600">
                        Accuracy
                      </p>

                      <p className="mt-2 text-lg font-semibold">
                        83%
                      </p>
                    </div>

                  </div>

                  
                  <div className="mt-3 rounded-2xl border border-blue-400/[0.12] bg-blue-400/[0.04] p-5">

                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/10">
                        <Sparkles size={15} className="text-blue-300" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold">
                          Recommended next
                        </p>

                        <p className="text-[10px] text-slate-500">
                          Based on your performance
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <div>
                        <p className="text-base font-semibold">
                          Classification Algorithms
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500">
                          Machine Learning
                        </p>
                      </div>

                      <ArrowRight
                        size={17}
                        className="text-slate-500"
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      
      <section className="relative z-10 border-y border-white/[0.07] bg-white/[0.015]">

        <div className="mx-auto grid max-w-7xl divide-y divide-white/[0.07] px-6 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-10 lg:px-12">

          <div className="flex gap-4 px-0 py-7 md:px-8 md:first:pl-0">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-400/[0.08] text-blue-300">
              <BarChart3 size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Understand your performance
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Know exactly where your strengths and gaps are.
              </p>
            </div>

          </div>

          <div className="flex gap-4 px-0 py-7 md:px-8">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-400/[0.08] text-purple-300">
              <Bot size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Learn with an AI Teacher
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Get explanations and guidance around your current topic.
              </p>
            </div>

          </div>

          <div className="flex gap-4 px-0 py-7 md:px-8 md:last:pr-0">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-300">
              <Target size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Keep improving
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your next recommendation changes as your performance changes.
              </p>
            </div>

          </div>

        </div>

      </section>

      
      <section className="relative z-10 px-6 py-24 md:px-10 lg:px-12">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-xs font-semibold tracking-[0.18em] text-blue-300">
              THE ADAPTIVE LOOP
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              The system learns from how you learn.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 md:text-base">
              Every assessment contributes to a continuously evolving learning
              path.
            </p>

          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">

            <StepCard
              number="01"
              icon={<BarChart3 size={20} />}
              title="Assess"
              description="Take assessments and quizzes that reveal your current understanding."
            />

            <StepCard
              number="02"
              icon={<Brain size={20} />}
              title="Analyze"
              description="AI analyzes your performance and identifies what should come next."
            />

            <StepCard
              number="03"
              icon={<Zap size={20} />}
              title="Adapt"
              description="Learn, practice, and let your updated performance reshape the path."
            />

          </div>

        </div>

      </section>

      
      <section className="relative z-10 border-t border-white/[0.07] px-6 py-24 md:px-10 lg:px-12">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-xs font-semibold tracking-[0.18em] text-blue-300">
              BUILT AROUND YOUR PROGRESS
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Everything works together.
            </h2>

          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Feature
              icon={<Brain size={19} />}
              title="AI Teacher"
              text="Understand concepts through interactive explanations."
            />

            <Feature
              icon={<BookOpen size={19} />}
              title="Adaptive Quizzes"
              text="Practice topics selected around your learning needs."
            />

            <Feature
              icon={<BarChart3 size={19} />}
              title="Performance"
              text="Track your knowledge across assessed topics."
            />

            <Feature
              icon={<Layers3 size={19} />}
              title="Learning Path"
              text="Follow recommendations that evolve with you."
            />

          </div>

        </div>

      </section>

      
      <section className="relative z-10 border-t border-white/[0.07] px-6 py-24 text-center md:px-10">

        <div className="mx-auto max-w-3xl">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-900">
            <Brain size={23} />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
            Stop following a fixed learning path.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
            Start with your current knowledge and let your progress determine
            what you learn next.
          </p>

          <button
            onClick={() => router.push("/register")}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Create your account
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

        </div>

      </section>

      
      <footer className="relative z-10 border-t border-white/[0.07] px-6 py-6 md:px-10 lg:px-12">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-slate-600 sm:flex-row">

          <p>
            © {new Date().getFullYear()} Adaptive Study Partner
          </p>

          <p>
            Personalized learning. Powered by AI.
          </p>

        </div>

      </footer>

    </main>
  );
}


function StepCard({ number, icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition hover:border-white/[0.14] hover:bg-white/[0.04]">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] text-slate-300">
          {icon}
        </div>

        <span className="text-xs font-medium text-slate-700">
          {number}
        </span>

      </div>

      <h3 className="mt-7 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}






function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-slate-300">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>

    </div>
  );
}