"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

import { apiRequest } from "../../src/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (error) {
      setError(
        error.message ||
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordLength = formData.password.length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">

      

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/[0.035] blur-3xl" />

        
        <div className="absolute bottom-[-250px] left-[-180px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.02] blur-3xl" />
      </div>

      

      <div className="relative z-10 min-h-screen lg:grid lg:grid-cols-[0.95fr_1.05fr]">

        

        <section className="relative hidden overflow-hidden border-r border-white/[0.06] bg-[#081522]/90 lg:flex lg:flex-col lg:justify-between">

          
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(148, 163, 184, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />

          
          <div className="pointer-events-none absolute right-[-150px] top-[-130px] h-[420px] w-[420px] rounded-full border border-blue-400/[0.05]" />

          <div className="pointer-events-none absolute right-[-95px] top-[-75px] h-[310px] w-[310px] rounded-full border border-blue-400/[0.04]" />

          <div className="pointer-events-none absolute bottom-[-180px] left-[-180px] h-[480px] w-[480px] rounded-full border border-white/[0.04]" />

          
          <div className="relative z-10 p-10 xl:p-14">

            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                <Sparkles
                  size={19}
                  className="text-blue-400"
                />
              </div>

              <span className="text-[15px] font-semibold tracking-tight text-white">
                Adaptive Study Partner
              </span>
            </Link>

          </div>

          
          <div className="relative z-10 px-10 pb-14 xl:px-14">

            <div className="max-w-lg">

              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Start with your goals
              </p>

              <h2 className="text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-5xl">
                Build a study routine
                <span className="block text-slate-400">
                  that adapts as you improve.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
                Your assessments become more than scores. They
                help shape what you should practice, what you
                understand, and where to go next.
              </p>

              <div className="mt-9 space-y-3">

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025]">
                    <Check
                      size={15}
                      className="text-blue-400"
                    />
                  </div>

                  <span>
                    Practice at your own difficulty level
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025]">
                    <Check
                      size={15}
                      className="text-blue-400"
                    />
                  </div>

                  <span>
                    Get recommendations based on performance
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025]">
                    <Check
                      size={15}
                      className="text-blue-400"
                    />
                  </div>

                  <span>
                    Keep your learning path organized
                  </span>
                </div>

              </div>
            </div>
          </div>

          
          <div className="relative z-10 px-10 pb-8 xl:px-14">
            <p className="text-xs text-slate-600">
              Personalized learning • AI-assisted guidance
            </p>
          </div>

        </section>

        

        <section className="flex min-h-screen items-start justify-center px-5 py-7 sm:px-8 sm:py-10 lg:items-center">

          <div className="w-full max-w-[430px]">

            

            <div className="mb-9 lg:hidden">

              
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                  <Sparkles
                    size={18}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Adaptive Study Partner
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-500">
                    AI-powered learning workspace
                  </p>
                </div>
              </Link>

              
              <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#081522]/90 p-5">

                
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.025]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(148, 163, 184, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: "28px 28px",
                  }}
                />

                <div className="relative z-10">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                    Build your study space
                  </p>

                  <h2 className="mt-3 text-[22px] font-semibold leading-snug tracking-tight text-white">
                    Start with a learning path that adapts to you.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Create your account to track progress, practice
                    at your level, and receive focused topic
                    recommendations.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2">

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                      <p className="text-xs font-medium text-slate-300">
                        Adaptive practice
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                      <p className="text-xs font-medium text-slate-300">
                        AI recommendations
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            

            <div className="mb-7 lg:mb-8">

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
                Get started
              </p>

              <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[34px]">
                Create your account
              </h1>

              <p className="mt-2.5 text-sm leading-6 text-slate-400">
                Set up your account and start building a smarter
                study routine.
              </p>
            </div>

            

            <div className="rounded-2xl border border-white/[0.07] bg-[#081522]/80 p-5 shadow-2xl shadow-black/10 sm:p-6 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">

              <form onSubmit={handleSubmit}>

                
                {error && (
                  <div
                    role="alert"
                    className="mb-6 flex gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3.5"
                  >
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />

                    <p className="text-sm leading-5 text-red-300">
                      {error}
                    </p>
                  </div>
                )}

                <div className="space-y-5">

                  
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2.5 block text-sm font-medium text-slate-200"
                    >
                      Full name
                    </label>

                    <div className="relative">

                      <User
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                        className="h-12 w-full rounded-xl border border-white/[0.09] bg-[#0b1826] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:bg-[#0c1b2b] focus:ring-4 focus:ring-blue-500/[0.07]"
                      />
                    </div>
                  </div>

                  
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2.5 block text-sm font-medium text-slate-200"
                    >
                      Email address
                    </label>

                    <div className="relative">

                      <Mail
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="h-12 w-full rounded-xl border border-white/[0.09] bg-[#0b1826] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:bg-[#0c1b2b] focus:ring-4 focus:ring-blue-500/[0.07]"
                      />
                    </div>
                  </div>

                  
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2.5 block text-sm font-medium text-slate-200"
                    >
                      Password
                    </label>

                    <div className="relative">

                      <LockKeyhole
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        minLength={6}
                        required
                        className="h-12 w-full rounded-xl border border-white/[0.09] bg-[#0b1826] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:bg-[#0c1b2b] focus:ring-4 focus:ring-blue-500/[0.07]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-300"
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>

                    
                    <div className="mt-2.5 flex items-center justify-between">

                      <p className="text-xs text-slate-600">
                        Use at least 6 characters.
                      </p>

                      {passwordLength >= 6 && (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <Check size={13} />
                          Ready
                        </span>
                      )}

                    </div>
                  </div>

                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Creating account
                      </>
                    ) : (
                      <>
                        Create account

                        <ArrowRight
                          size={16}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>

                </div>
              </form>
            </div>

            
            <div className="mt-8 border-t border-white/[0.06] pt-7 text-center">

              <p className="text-sm text-slate-500">
                Already have an account?{" "}

                <Link
                  href="/login"
                  className="font-medium text-blue-400 transition hover:text-blue-300"
                >
                  Sign in
                </Link>
              </p>

            </div>

            <p className="mt-8 text-center text-[11px] leading-5 text-slate-600">
              Create an account to keep your learning progress
              connected to your personalized study experience.
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}