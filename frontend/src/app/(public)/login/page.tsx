
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ROLE_META } from "@/lib/user-role";
import { AuthApiError } from "@/lib/auth-api";

export default function LoginPage() {
  const { login, role, loading, restoreError } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // If a session is already active, bounce to dashboard
  useEffect(() => {
    if (!loading && role !== null) {
      router.replace(ROLE_META[role].defaultPath);
    }
  }, [loading, role, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      const authenticatedUser = await login(email.trim(), password);
      router.push(ROLE_META[authenticatedUser.role].defaultPath);
    } catch (caughtError) {
      setError(
        caughtError instanceof AuthApiError
          ? caughtError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  if (loading || role !== null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080B18]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-xl font-black text-white">N</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080B18] px-4 py-12 text-white">

      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080B18_80%)]" />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-[480px]">

        {/* Branding */}
        <div className="mb-9 flex flex-col items-center">
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
        <div className="rounded-3xl border border-white/[0.08] bg-[#11162A]/80 p-7 shadow-[0_0_80px_rgba(139,92,246,0.08)] backdrop-blur-2xl sm:p-10">

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200">
              <ShieldCheck size={14} />
              Secure database-backed academic access
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome <span className="glow-text">back.</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Sign in with your account to continue your academic journey with NEXORA.
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">

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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080B18]/70 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-violet-300 transition-colors hover:text-violet-200"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
            </div>

            {(error || restoreError) && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200"
              >
                {error || restoreError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:from-violet-500 hover:to-violet-400 hover:shadow-violet-500/30 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoggingIn ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Signup */}
          <div className="mt-7 text-center text-sm text-slate-400">
            New to NEXORA?{" "}
            <Link
              href="/signup"
              className="font-medium text-violet-300 transition-colors hover:text-violet-200"
            >
              Create an account
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
