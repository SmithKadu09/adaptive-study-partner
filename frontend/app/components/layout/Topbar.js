
"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  Sparkles,
  ChevronDown,
  BookOpen,
} from "lucide-react";

export default function Topbar({ setMobileOpen }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }
  }, []);

  const displayName = user?.name || "Student";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#080c18]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      
      <div className="flex min-w-0 items-center gap-3">
        
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="hidden text-xs font-medium tracking-wide text-slate-500 sm:block">
            Adaptive learning
          </p>

          <h2 className="truncate text-sm font-semibold text-white sm:text-base">
            Welcome back, {displayName}
          </h2>
        </div>
      </div>

      
      <div className="flex items-center gap-2 sm:gap-3">
        
        <div className="hidden items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.08] px-3 py-2 sm:flex">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10">
            <Sparkles size={14} className="text-indigo-400" />
          </span>

          <div className="leading-none">
            <p className="text-[11px] font-medium text-indigo-300">
              Learning Assistant
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              AI ready
            </p>
          </div>
        </div>

        
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 sm:hidden">
          <BookOpen size={17} />
        </div>

        
        <button
          type="button"
          aria-label="Open profile"
          className="group flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-white/5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-300">
            {initial}
          </div>

          <div className="hidden text-left lg:block">
            <p className="max-w-32 truncate text-xs font-semibold text-white">
              {displayName}
            </p>

            <p className="text-[11px] text-slate-500">
              Student
            </p>
          </div>

         
        </button>
      </div>
    </header>
  );
}

