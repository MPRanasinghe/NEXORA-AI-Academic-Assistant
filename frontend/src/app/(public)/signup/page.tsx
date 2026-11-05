
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  LockKeyhole,
  UserRound,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "student",
    password: "",
    confirmPassword: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Backend registration will be connected later.
    alert("Signup interface is ready. Backend registration is coming soon.");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080B18] px-4 py-12 text-white">

      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080B18_80%)]" />
      </div>

      {/* Signup card */}
      <div className="relative z-10 w-full max-w-[480px]">

        {/* Branding */}
        <div className="mb-8 flex flex-col items-center">
          <Link
            href="/"
            className="glow-text text-4xl font-bold tracking-[0.18em] transition-opacity hover:opacity-80 sm:text-5xl"
          >
            NEXORA
          </Link>

          <p className="mt-3 text-sm tracking-wide text-slate-400">
            Intelligent Academic Assistant
          </p>
        </div>

        {/* Form surface */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#11162A]/80 p-7 shadow-[0_0_80px_rgba(139,92,246,0.08)] backdrop-blur-2xl sm:p-9">

          {/* Heading */}
          <div className="mb-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-200">
              <GraduationCap size={14} />
              Your academic journey starts here
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Create your <span className="glow-text">account.</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Join NEXORA and experience a smarter academic workspace.
            </p>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData({ ...formData, fullName: event.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080B18]/70 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@university.edu"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080B18]/70 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Account role
              </label>

              <div className="relative">
                <GraduationCap
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={(event) =>
                    setFormData({ ...formData, role: event.target.value })
                  }
                  className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#080B18]/70 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition-all focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                >
                  <option value="student">Student</option>
                  <option value="academic_staff">Academic Staff</option>
                  <option value="administrator">Administrator</option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Administrator accounts will require authorized approval.
              </p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({ ...formData, password: event.target.value })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080B18]/70 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use at least 8 characters.
              </p>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirm password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      confirmPassword: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080B18]/70 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-2.5 pt-2 text-xs leading-5 text-slate-400">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 shrink-0 accent-violet-500"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-violet-300 hover:text-violet-200"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-violet-300 hover:text-violet-200"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:from-violet-500 hover:to-violet-400 hover:shadow-violet-500/30 active:scale-[0.98]"
            >
              Create account
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </form>

          {/* Login */}
          <div className="mt-7 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-violet-300 transition-colors hover:text-violet-200"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-600">
          <ShieldCheck size={14} />
          Your academic workspace, securely connected.
        </div>

        <p className="mt-4 text-center text-xs text-slate-700">
          © 2026 NEXORA. All rights reserved.
        </p>
      </div>
    </main>
  );
}
