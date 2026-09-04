"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  MessageCircle,
  Brain,
  BarChart3,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Assessments",
    href: "/assessments",
    icon: ClipboardCheck,
  },
  {
    name: "Learning",
    href: "/learning",
    icon: BookOpen,
  },
  {
    name: "AI Teacher",
    href: "/teacher",
    icon: MessageCircle,
  },
  {
    name: "Quizzes",
    href: "/quizzes",
    icon: Brain,
  },
  {
    name: "Progress",
    href: "/progress",
    icon: BarChart3,
  },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();

  return (
    <>
      
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col
          border-r border-white/10 bg-[#0b1020]
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
              <Brain size={22} className="text-white" />
            </div>

            <div>
              <h1 className="text-sm font-bold text-white">
                Adaptive
              </h1>
              <p className="text-xs text-slate-400">
                Study Partner
              </p>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Workspace
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-3
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-indigo-500/15 text-indigo-300 shadow-sm"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={19}
                  className={
                    active
                      ? "text-indigo-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }
                />

                <span>{item.name}</span>

                {active && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-400" />
                )}
              </Link>
            );
          })}

          <div className="my-6 border-t border-white/10" />

          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Account
          </p>

          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <User size={19} className="text-slate-500" />
            Profile
          </Link>

          <Link
            href="/settings"
            onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <Settings size={19} className="text-slate-500" />
            Settings
          </Link>
        </nav>

        
        <div className="border-t border-white/10 p-4">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}