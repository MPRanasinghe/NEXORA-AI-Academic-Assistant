
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CircleHelp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { getQuizById } from "@/lib/quiz-catalog";
import {
  isQuizPlayable,
  useDeletedQuizIds,
  useManagedQuizzes,
} from "@/lib/quiz-storage";
import { useStudentAcademicRecord } from "@/lib/academic-storage";
import {
  AttemptLimitError,
  startQuizAttempt,
  useQuizAttempts,
} from "@/lib/quiz-attempt-storage";

export default function QuizInstructionsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [startError, setStartError] = useState("");
  const managedQuizzes = useManagedQuizzes();
  const deletedQuizIds = useDeletedQuizIds();
  const quiz = getQuizById(id, managedQuizzes, deletedQuizIds);
  const { record } = useStudentAcademicRecord();
  const quizAttempts = useQuizAttempts(record.studentId).filter(
    (attempt) => attempt.quizId === id,
  );
  const activeAttempt = quizAttempts.find(
    (attempt) => attempt.status === "in_progress",
  );
  const latestAttempt = [...quizAttempts]
    .filter((attempt) => attempt.status === "submitted")
    .sort((a, b) => (b.submittedAt ?? 0) - (a.submittedAt ?? 0))[0];
  const maxAttempts = quiz?.maxAttempts ?? 1;
  const remainingAttempts = Math.max(0, maxAttempts - quizAttempts.length);
  const isUnavailable = !quiz || !isQuizPlayable(quiz);

  const startAttempt = () => {
    if (!quiz) return;
    setStartError("");
    try {
      const attempt =
        activeAttempt ?? startQuizAttempt(record.studentId, quiz);
      router.push(
        `/quizzes/${id}/attempt?attemptId=${encodeURIComponent(attempt.id)}`,
      );
    } catch (error) {
      if (error instanceof AttemptLimitError) {
        setStartError(error.message);
      } else {
        console.error("Failed to start quiz attempt:", error);
        setStartError("Unable to start this quiz attempt. Please try again.");
      }
    }
  };

  if (isUnavailable || !quiz) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertCircle size={40} className="text-violet-400" />
        <h1 className="mt-5 text-2xl font-semibold text-white">
          Quiz not found
        </h1>
        <p className="mt-2 text-slate-400">
          This quiz is unavailable, unpublished, or does not contain valid questions.
        </p>
        <Link
          href="/quizzes"
          className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
        >
          Return to Quiz Center
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      {/* Back Navigation */}
      <Link
        href="/quizzes"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Quiz Center
      </Link>

      {/* Quiz Header */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#171D35] via-[#11162A] to-[#0C1020] p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-500/[0.06] blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              {quiz.subject}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
              {quiz.difficulty}
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {quiz.title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            {quiz.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-6">
            <MetaItem icon={<CircleHelp size={18} />} value={`${quiz.questions.length} Questions`} />
            <MetaItem icon={<Clock size={18} />} value={`${quiz.duration} Minutes`} />
            <MetaItem
              icon={<BookOpen size={18} />}
              value={`${maxAttempts} ${maxAttempts === 1 ? "Attempt" : "Attempts"}`}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Instructions */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <BookOpen size={20} />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Quiz Instructions
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {[
                "Read each question carefully before selecting your answer.",
                "You can navigate between questions during the quiz.",
                "Your answers will be saved as you progress.",
                "Review your answers before submitting your attempt.",
                "The quiz will automatically submit when the timer expires.",
              ].map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  <p className="text-sm leading-6 text-slate-400">
                    {instruction}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Rules */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Attempt Rules
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <RuleItem label="Time Limit" value={`${quiz.duration} minutes`} />
              <RuleItem
                label="Attempts Allowed"
                value={`${maxAttempts} ${maxAttempts === 1 ? "attempt" : "attempts"}`}
              />
              <RuleItem label="Question Navigation" value="Available" />
              <RuleItem label="Result" value="After submission" />
              <RuleItem label="Scoring" value="Based on correct answers" />
            </div>
          </section>
        </div>

        {/* Start Panel */}
        <aside className="h-fit rounded-2xl border border-violet-500/20 bg-gradient-to-b from-[#171D35] to-[#11162A] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
            <GraduationCap size={24} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            Ready to begin?
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Make sure you are ready before starting. Your timer begins immediately.
          </p>

          <div className="my-6 space-y-3 rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <RuleItem label="Questions" value={`${quiz.questions.length}`} />
            <RuleItem label="Duration" value={`${quiz.duration} min`} />
          </div>

          {activeAttempt ? (
            <button
              type="button"
              onClick={startAttempt}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500"
            >
              Continue Quiz
              <ArrowRight size={16} />
            </button>
          ) : remainingAttempts > 0 ? (
            <button
              type="button"
              onClick={startAttempt}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500"
            >
              Start Quiz
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          ) : latestAttempt ? (
            <Link
              href={`/quizzes/${id}/review?attemptId=${encodeURIComponent(latestAttempt.id)}`}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
            >
              Review Attempt
              <ArrowRight size={16} />
            </Link>
          ) : (
            <p className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3 text-center text-sm text-amber-200">
              No attempts remain for this quiz.
            </p>
          )}

          {startError && (
            <p role="alert" className="mt-3 text-xs leading-5 text-amber-300">
              {startError}
            </p>
          )}

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            By starting, you agree to follow the quiz instructions.
          </p>
        </aside>
      </div>
    </div>
  );
}

function MetaItem({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <span className="text-violet-300">{icon}</span>
      {value}
    </div>
  );
}

function RuleItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-medium text-slate-200">
        {value}
      </span>
    </div>
  );
}
