"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  ShieldCheck,
  Pencil,
  LockKeyhole,
  LogOut,
  ChevronRight,
  Settings,
  Sparkles,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AppShell from "../components/layout/AppShell";
import { apiRequest } from "../../src/lib/api";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to load stored user:", error);
        }
      }

      try {
        const data = await apiRequest("/api/auth/me");

        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        console.error("Failed to fetch authenticated user:", error);
      }
    };

    loadUser();
  }, []);

  
  const openProfileModal = () => {
    setProfileError("");
    setProfileSuccess("");

    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
    });

    setProfileModalOpen(true);
  };

  
  const openPasswordModal = () => {
    setPasswordError("");
    setPasswordSuccess("");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setPasswordModalOpen(true);
  };

  
  const closeProfileModal = () => {
    if (profileLoading) return;

    setProfileModalOpen(false);
    setProfileError("");
    setProfileSuccess("");
  };

  
  const closePasswordModal = () => {
    if (passwordLoading) return;

    setPasswordModalOpen(false);
    setPasswordError("");
    setPasswordSuccess("");
  };

  
  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setProfileError("");
    setProfileSuccess("");

    const name = profileForm.name.trim();
    const email = profileForm.email.trim();

    if (!name || !email) {
      setProfileError("Name and email are required.");
      return;
    }

    setProfileLoading(true);

    try {
      const data = await apiRequest("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name,
          email,
        }),
      });

      if (data?.user) {
        setUser(data.user);

        
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setProfileSuccess("Profile updated successfully.");

      setTimeout(() => {
        setProfileModalOpen(false);
        setProfileSuccess("");
      }, 1200);
    } catch (error) {
      setProfileError(error.message || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      await apiRequest("/api/auth/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setPasswordSuccess("Password changed successfully.");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setPasswordModalOpen(false);
        setPasswordSuccess("");
      }, 1200);
    } catch (error) {
      setPasswordError(
        error.message || "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const displayName = user?.name || "Student";
  const email = user?.email || "Not available";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <AppShell>
      <div className="relative space-y-6 pb-8">
        
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.7) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-blue-400">
              <User size={14} />
              Account
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Profile
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Manage your personal information and account preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/settings")}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            <Settings size={16} />
            Settings
          </button>
        </div>

        
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#091522]">
          <div
            className="relative border-b border-slate-800 px-5 py-6 sm:px-7 sm:py-7"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.035) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              
              <div className="relative shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-2xl font-semibold text-blue-400">
                  {initial}
                </div>

                <div
                  className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-4 border-[#091522] bg-emerald-500"
                  title="Active account"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              </div>

              
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-semibold text-white sm:text-2xl">
                    {displayName}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>

                <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-slate-400">
                  <Mail size={15} className="shrink-0" />
                  <span className="truncate">{email}</span>
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300">
                    <GraduationCap size={14} />
                    Student Account
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-400">
                    <ShieldCheck size={14} />
                    Account secured
                  </span>
                </div>
              </div>

              
              <button
                type="button"
                onClick={openProfileModal}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
              >
                <Pencil size={15} />
                Edit Profile
              </button>
            </div>
          </div>

          
          <div className="grid divide-y divide-slate-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-3 px-5 py-4 sm:px-7">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                <GraduationCap size={17} />
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Account Type
                </p>

                <p className="mt-0.5 text-sm font-medium text-slate-200">
                  Student
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 sm:px-7">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Account Status
                </p>

                <p className="mt-0.5 text-sm font-medium text-emerald-400">
                  Active
                </p>
              </div>
            </div>
          </div>
        </section>

        
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-blue-400">
                  <User size={17} />

                  <span className="text-xs font-medium uppercase tracking-wider">
                    Personal Details
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-white">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your basic account information.
                </p>
              </div>

              <div className="hidden rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-500 sm:block">
                Account
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                  <User size={17} />
                </div>

                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Full Name
                </p>

                <p className="mt-1.5 break-words text-sm font-medium text-slate-100">
                  {displayName}
                </p>
              </div>

              
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                  <Mail size={17} />
                </div>

                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Email Address
                </p>

                <p className="mt-1.5 break-all text-sm font-medium text-slate-100">
                  {email}
                </p>
              </div>

              
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                  <GraduationCap size={17} />
                </div>

                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Account Type
                </p>

                <p className="mt-1.5 text-sm font-medium text-slate-100">
                  Student
                </p>
              </div>

              
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                  <ShieldCheck size={17} />
                </div>

                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Security
                </p>

                <p className="mt-1.5 text-sm font-medium text-emerald-400">
                  Account secured
                </p>
              </div>
            </div>
          </section>

          
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2 text-blue-400">
                <Sparkles size={17} />

                <span className="text-xs font-medium uppercase tracking-wider">
                  Study Setup
                </span>
              </div>

              <h2 className="text-lg font-semibold text-white">
                Learning Preferences
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-400">
                Configure how your study sessions work.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/settings")}
              className="group w-full rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-left transition hover:border-slate-700 hover:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Settings size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">
                    Study Settings
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Manage difficulty, quiz size and learning preferences.
                  </p>
                </div>

                <ChevronRight
                  size={17}
                  className="shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
                />
              </div>
            </button>

            <div className="mt-4 rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
              <div className="flex gap-3">
                <Sparkles
                  size={16}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <p className="text-xs leading-5 text-slate-400">
                  Your study preferences can be adjusted anytime from the
                  Settings page.
                </p>
              </div>
            </div>
          </section>
        </div>

        
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <LockKeyhole size={17} />

              <span className="text-xs font-medium uppercase tracking-wider">
                Account Management
              </span>
            </div>

            <h2 className="text-lg font-semibold text-white">
              Account & Security
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Manage access to your account.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            
            <button
              type="button"
              onClick={openPasswordModal}
              className="group flex w-full items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-left transition hover:border-slate-700 hover:bg-slate-900"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                <LockKeyhole size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">
                  Change Password
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Update your account password.
                </p>
              </div>

              <ChevronRight
                size={17}
                className="shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
              />
            </button>

            
            <button
              type="button"
              onClick={openProfileModal}
              className="group flex w-full items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-left transition hover:border-slate-700 hover:bg-slate-900"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                <Pencil size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">
                  Edit Profile
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Update your personal account information.
                </p>
              </div>

              <ChevronRight
                size={17}
                className="shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
              />
            </button>
          </div>

          
          <div className="mt-5 border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-4 rounded-xl border border-red-900/30 bg-red-950/[0.08] p-4 text-left transition hover:border-red-900/50 hover:bg-red-950/[0.14]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-950/40 text-red-400">
                <LogOut size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-red-400">
                  Log Out
                </p>

                <p className="mt-1 text-xs text-red-400/50">
                  Sign out of your account on this device.
                </p>
              </div>

              <ChevronRight
                size={17}
                className="shrink-0 text-red-900/70 transition group-hover:translate-x-0.5 group-hover:text-red-400"
              />
            </button>
          </div>
        </section>

        
        <div className="flex flex-col items-center justify-center gap-1 pb-2 text-center text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck size={13} />
            <span>Your account information is securely stored.</span>
          </div>

          <span>Adaptive Study Partner</span>
        </div>
      </div>

      
      
      

      {profileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#091522] shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
                  Account
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  Edit Profile
                </h2>
              </div>

              <button
                type="button"
                onClick={closeProfileModal}
                disabled={profileLoading}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-5 p-5">
                
                {profileError && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-900/40 bg-red-950/20 p-3.5">
                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <p className="text-sm leading-5 text-red-300">
                      {profileError}
                    </p>
                  </div>
                )}

                
                {profileSuccess && (
                  <div className="flex items-start gap-3 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3.5">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <p className="text-sm leading-5 text-emerald-300">
                      {profileSuccess}
                    </p>
                  </div>
                )}

                
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      disabled={profileLoading}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      disabled={profileLoading}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              
              <div className="flex flex-col-reverse gap-2 border-t border-slate-800 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeProfileModal}
                  disabled={profileLoading}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {profileLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}

                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      
      

      {passwordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#091522] shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
                  Security
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  Change Password
                </h2>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={passwordLoading}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-5 p-5">
                
                {passwordError && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-900/40 bg-red-950/20 p-3.5">
                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <p className="text-sm leading-5 text-red-300">
                      {passwordError}
                    </p>
                  </div>
                )}

                
                {passwordSuccess && (
                  <div className="flex items-start gap-3 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3.5">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <p className="text-sm leading-5 text-emerald-300">
                      {passwordSuccess}
                    </p>
                  </div>
                )}

                
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                    Current Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      disabled={passwordLoading}
                      placeholder="Enter current password"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                    New Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      disabled={passwordLoading}
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                    >
                      {showNewPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-600">
                    Use at least 6 characters.
                  </p>
                </div>

                
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={passwordLoading}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              
              <div className="flex flex-col-reverse gap-2 border-t border-slate-800 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={passwordLoading}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {passwordLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}

                  {passwordLoading
                    ? "Updating..."
                    : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}