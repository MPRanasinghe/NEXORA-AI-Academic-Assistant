"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import StudentRouteGuard from "@/components/layout/StudentRouteGuard";
import { useDemoAuth } from "@/lib/demo-auth-context";
import { useStudentAcademicRecord } from "@/lib/academic-storage";
import {
  DEFAULT_STUDENT_PREFERENCES,
  saveStudentPreferences,
  useStudentPreferences,
  type StudentPreferences,
} from "@/lib/student-preferences";

export default function StudentSettingsPage() {
  const { record } = useStudentAcademicRecord();
  const preferences = useStudentPreferences(record.studentId);
  const { logout } = useDemoAuth();
  const [saveError, setSaveError] = useState("");

  const updatePreference = (
    key: keyof StudentPreferences,
    checked: boolean,
  ) => {
    const updated = { ...preferences, [key]: checked };
    try {
      saveStudentPreferences(record.studentId, updated);
      setSaveError("");
    } catch (error) {
      console.error("Failed to save student preferences:", error);
      setSaveError(
        "Preferences could not be saved in this browser. Check storage availability and try again.",
      );
    }
  };

  return (
    <StudentRouteGuard>
      <main className="mx-auto w-full max-w-5xl space-y-7 px-4 py-6 text-slate-100 sm:px-6 sm:py-8 lg:px-10">
        <header>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
            <Settings size={14} />
            Student workspace
          </div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Settings</h1>
          <p className="mt-2 text-sm text-slate-400">
            Demo profile details and local learning preferences.
          </p>
        </header>

        <p className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3 text-xs leading-5 text-amber-100/70">
          This is a frontend demo account. Profile identity and preferences are
          not verified by a university service; do not enter sensitive data.
        </p>

        {saveError && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {saveError}
          </p>
        )}

        <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
              <ShieldCheck size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-white">Student profile</h2>
              <p className="mt-1 text-xs text-slate-500">
                Read-only sample profile from the academic demo data.
              </p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <ProfileField label="Name" value={record.studentName} />
                <ProfileField label="Student ID" value={record.studentId} />
                <ProfileField label="Program" value={record.program} />
                <ProfileField label="Faculty" value={record.faculty} />
                <ProfileField label="Intake year" value={record.intakeYear} />
                <ProfileField label="Current level" value={record.currentLevel} />
              </dl>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
              <Sparkles size={19} />
            </div>
            <div>
              <h2 className="font-semibold text-white">Learning preferences</h2>
              <p className="mt-1 text-xs text-slate-500">
                Saved per student profile in this browser only.
              </p>
            </div>
          </div>
          <div className="mt-5 divide-y divide-white/[0.06]">
            <PreferenceToggle
              label="Quiz reminders"
              description="Show reminders for published quizzes."
              checked={preferences.quizReminders}
              onChange={(checked) => updatePreference("quizReminders", checked)}
            />
            <PreferenceToggle
              label="Course material updates"
              description="Show updates when course materials are available."
              checked={preferences.courseMaterialUpdates}
              onChange={(checked) =>
                updatePreference("courseMaterialUpdates", checked)
              }
            />
            <PreferenceToggle
              label="Assistant citations"
              description="Prefer source references in assistant responses when available."
              checked={preferences.assistantCitations}
              onChange={(checked) =>
                updatePreference("assistantCitations", checked)
              }
            />
          </div>
          <button
            type="button"
            onClick={() => {
              try {
                saveStudentPreferences(
                  record.studentId,
                  DEFAULT_STUDENT_PREFERENCES,
                );
                setSaveError("");
              } catch (error) {
                console.error("Failed to reset student preferences:", error);
                setSaveError("Preferences could not be reset. Please try again.");
              }
            }}
            className="mt-5 text-xs font-medium text-violet-300 transition hover:text-violet-200"
          >
            Restore defaults
          </button>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/forgot-password"
            className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 transition hover:border-violet-500/20"
          >
            <BookOpen size={20} className="text-violet-300" />
            <span>
              <span className="block text-sm font-medium text-white">
                Account support
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Demo password reset information
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-4 rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-5 text-left transition hover:bg-red-500/[0.08]"
          >
            <LogOut size={20} className="text-red-300" />
            <span>
              <span className="block text-sm font-medium text-white">
                Sign out
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                End this local demo session
              </span>
            </span>
          </button>
        </div>
      </main>
    </StudentRouteGuard>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-slate-500">{label}</dt>
      <dd className="mt-1 truncate text-sm text-slate-200">{value}</dd>
    </div>
  );
}

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-4">
      <span>
        <span className="block text-sm font-medium text-slate-200">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>
      <span className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="relative h-6 w-11 appearance-none rounded-full bg-slate-700 align-middle transition after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition after:content-[''] checked:bg-violet-600 checked:after:translate-x-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
        />
      </span>
    </label>
  );
}
