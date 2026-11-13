"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Trophy,
  XCircle,
} from "lucide-react";
import { useStudentAcademicRecord } from "@/lib/academic-storage";
import { useQuizAttempts } from "@/lib/quiz-attempt-storage";

export default function QuizReviewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const { record } = useStudentAcademicRecord();
  const attempts = useQuizAttempts(record.studentId);
  const requestedAttemptId = searchParams.get("attemptId");

  const result = useMemo(() => {
    const submitted = attempts
      .filter(
        (attempt) => attempt.quizId === id && attempt.status === "submitted",
      )
      .sort((a, b) => (b.submittedAt ?? 0) - (a.submittedAt ?? 0));
    if (requestedAttemptId) {
      return submitted.find((attempt) => attempt.id === requestedAttemptId) ?? null;
    }
    return submitted[0] ?? null;
  }, [attempts, id, requestedAttemptId]);

  if (!result) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center text-[#94A3B8]">
        <BookOpen className="mb-4 h-10 w-10 text-violet-400" />
        <h2 className="text-xl font-semibold text-white">No quiz results found</h2>
        <p className="mt-2">
          Complete a quiz before reviewing this attempt.
        </p>
        <button
          type="button"
          onClick={() => router.push("/quizzes")}
          className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-white transition hover:bg-violet-500"
        >
          Back to Quiz Center
        </button>
      </div>
    );
  }

  const unansweredCount = result.questions.filter(
    (question) => result.answers[question.id] === undefined,
  ).length;
  const incorrectCount = Math.max(
    0,
    result.questions.length - (result.correctCount ?? 0) - unansweredCount,
  );

  return (
    <main className="mx-auto min-h-full w-full max-w-5xl space-y-8 px-4 py-8 text-[#F8FAFC] sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/quizzes")}
          className="flex items-center gap-2 text-sm text-[#94A3B8] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Quiz Center
        </button>
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300">
          ANSWER REVIEW
        </span>
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[#94A3B8]">Completed Quiz</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              {result.quizTitle}
            </h1>
            <p className="mt-3 text-sm text-[#94A3B8]">
              Review your answers and learn from your mistakes.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Attempt submitted{" "}
              {result.submittedAt
                ? new Date(result.submittedAt).toLocaleString()
                : "in demo mode"}
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-violet-500/20 bg-violet-500/10 p-5">
            <Trophy className="h-8 w-8 text-violet-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {result.scorePercentage ?? 0}%
              </p>
              <p className="text-xs text-[#94A3B8]">
                {result.correctCount ?? 0} / {result.questions.length} correct
              </p>
              <p className="mt-1 text-[11px] text-[#64748B]">
                {incorrectCount} incorrect · {unansweredCount} unanswered
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        {result.questions.map((question, index) => {
          const selectedAnswer = result.answers[question.id];
          const isAnswered = selectedAnswer !== undefined;
          const isCorrect =
            isAnswered && selectedAnswer === question.correctAnswer;

          return (
            <section
              key={question.id}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11162A]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <span className="text-sm font-medium text-[#94A3B8]">
                  Question {index + 1}
                </span>
                <span
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                    isCorrect
                      ? "bg-emerald-500/10 text-emerald-400"
                      : isAnswered
                        ? "bg-red-500/10 text-red-400"
                        : "bg-white/[0.05] text-[#94A3B8]"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isAnswered ? (
                    <XCircle className="h-4 w-4" />
                  ) : null}
                  {isCorrect ? "Correct" : isAnswered ? "Incorrect" : "Unanswered"}
                </span>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <h2 className="text-base font-semibold leading-relaxed sm:text-lg">
                  {question.question}
                </h2>
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswer === optionIndex;
                    const isAnswer = question.correctAnswer === optionIndex;
                    const optionStyle = isAnswer
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : isSelected
                        ? "border-red-500/40 bg-red-500/10 text-red-300"
                        : "border-white/[0.08] bg-[#171D35] text-[#CBD5E1]";
                    return (
                      <div
                        key={optionIndex}
                        className={`flex items-start gap-3 rounded-xl border p-4 ${optionStyle}`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-xs font-semibold">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="flex-1 text-sm leading-relaxed">
                          {option}
                        </span>
                        {isAnswer && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                        )}
                        {!isAnswer && isSelected && (
                          <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-400">
                    Correct answer:{" "}
                    {String.fromCharCode(65 + question.correctAnswer)}
                  </span>
                  {isAnswered ? (
                    <span
                      className={`rounded-lg px-3 py-2 ${
                        isCorrect
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      Your answer: {String.fromCharCode(65 + selectedAnswer)}
                    </span>
                  ) : (
                    <span className="rounded-lg bg-white/[0.05] px-3 py-2 text-[#94A3B8]">
                      Not answered
                    </span>
                  )}
                </div>
                {question.explanation && (
                  <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.04] p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Explanation
                    </p>
                    <p className="text-sm leading-relaxed text-[#CBD5E1]">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-between gap-4 border-t border-white/[0.06] pt-6">
        <button
          type="button"
          onClick={() => router.push("/quizzes")}
          className="flex items-center gap-2 rounded-xl border border-white/[0.1] px-5 py-3 text-sm text-[#CBD5E1] transition hover:bg-white/[0.05]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quiz Center
        </button>
        <Link
          href="/quizzes"
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
        >
          Finish Review
        </Link>
      </div>
    </main>
  );
}
