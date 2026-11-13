
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  BookOpen,
  CheckCircle2,
  Play,
  Filter,
  GraduationCap,
  CircleHelp,
} from "lucide-react";
import { getStudentVisibleQuizzes } from "@/lib/quiz-catalog";
import {
  useDeletedQuizIds,
  useManagedQuizzes,
} from "@/lib/quiz-storage";
import { useStudentAcademicRecord } from "@/lib/academic-storage";
import { useQuizAttempts } from "@/lib/quiz-attempt-storage";

type Difficulty = "All Levels" | "Beginner" | "Intermediate" | "Advanced";

export default function QuizzesPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("All Levels");
  const managedQuizzes = useManagedQuizzes();
  const deletedQuizIds = useDeletedQuizIds();
  const { record } = useStudentAcademicRecord();
  const attempts = useQuizAttempts(record.studentId);

  const availableQuizzes = useMemo(() => {
    return getStudentVisibleQuizzes(managedQuizzes, deletedQuizIds);
  }, [deletedQuizIds, managedQuizzes]);

  const filteredQuizzes = useMemo(() => {
    return availableQuizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(search.toLowerCase()) ||
        quiz.subject.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "All Levels" || quiz.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [availableQuizzes, search, difficulty]);
  const submittedAttempts = attempts.filter(
    (attempt) => attempt.status === "submitted",
  );
  const averageScore = submittedAttempts.length
    ? Math.round(
        submittedAttempts.reduce(
          (total, attempt) => total + (attempt.scorePercentage ?? 0),
          0,
        ) / submittedAttempts.length,
      )
    : null;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-7 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      {/* Header */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-violet-300 sm:text-sm">
          <GraduationCap size={17} className="text-violet-400" />
          Academic Learning
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-3xl">
          Quiz Center
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-[15px]">
          Challenge yourself, measure your progress, and strengthen your knowledge.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          icon={<BookOpen size={20} />}
          label="Available Quizzes"
          value={String(availableQuizzes.length).padStart(2, "0")}
          color="violet"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Completed"
          value={String(submittedAttempts.length)}
          color="cyan"
        />
        <StatCard
          icon={<CircleHelp size={20} />}
          label="Average Score"
          value={averageScore === null ? "—" : `${averageScore}%`}
          color="emerald"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quizzes or subjects..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#11162A] py-3.5 pl-11 pr-4 text-sm text-[#F8FAFC] shadow-sm shadow-black/10 outline-none transition placeholder:text-slate-500 hover:border-white/[0.12] focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#11162A] px-3 shadow-sm shadow-black/10 transition hover:border-white/[0.12] focus-within:border-violet-400/40 sm:min-w-[180px]">
          <Filter size={16} className="shrink-0 text-slate-400" />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            aria-label="Filter quizzes by difficulty"
            className="w-full cursor-pointer bg-transparent py-3.5 text-sm text-slate-300 outline-none"
          >
            <option className="bg-[#11162A]" value="All Levels">All Levels</option>
            <option className="bg-[#11162A]" value="Beginner">Beginner</option>
            <option className="bg-[#11162A]" value="Intermediate">Intermediate</option>
            <option className="bg-[#11162A]" value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11162A] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/25 hover:bg-[#141A30] hover:shadow-xl hover:shadow-violet-950/20 sm:p-6"
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-violet-500/[0.04] blur-3xl transition duration-500 group-hover:bg-violet-500/[0.09]" />
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.14] to-cyan-400/[0.05] text-violet-300 transition duration-300 group-hover:border-violet-400/20 group-hover:text-violet-200">
                <BookOpen size={22} />
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${
                  quiz.difficulty === "Beginner"
                    ? "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300"
                    : quiz.difficulty === "Intermediate"
                    ? "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-300"
                    : "border-amber-400/15 bg-amber-400/[0.07] text-amber-300"
                }`}
              >
                {quiz.difficulty}
              </span>
            </div>

            <div className="relative mt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                {quiz.subject}
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-[#F8FAFC]">
                {quiz.title}
              </h2>
              <p className="mt-2 min-h-[40px] text-[13px] leading-6 text-slate-400">
                {quiz.description}
              </p>
            </div>

            <div className="relative mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400 sm:text-xs">
              <span className="flex items-center gap-1.5">
                <CircleHelp size={14} className="text-violet-300/80" />
                {quiz.questions.length} Questions
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-cyan-300/80" />
                {quiz.duration} Minutes
              </span>
              <span>
                {attempts.filter((attempt) => attempt.quizId === quiz.id).length}{" "}
                {attempts.filter((attempt) => attempt.quizId === quiz.id).length === 1
                  ? "attempt"
                  : "attempts"}
              </span>
            </div>

            <div className="relative mt-5 border-t border-white/[0.07] pt-4">
              <Link
                href={`/quizzes/${quiz.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/15 bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-950/25 transition duration-200 hover:-translate-y-px hover:border-violet-300/25 hover:from-violet-500 hover:to-violet-400 hover:shadow-lg hover:shadow-violet-900/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"
              >
                View Quiz
                <Play size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] px-5 py-14 text-center shadow-lg shadow-black/10 sm:py-16">
          <Search className="mx-auto text-slate-500" size={30} />
          <p className="mt-4 font-medium text-white">No quizzes found</p>
          <p className="mt-2 text-sm text-slate-400">
            Try another search term or difficulty level.
          </p>
        </div>
      )}

      <section className="space-y-3 border-t border-white/[0.05] pt-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent quiz attempts</h2>
          <p className="mt-1 text-xs text-slate-500">
            Practice results are separate from official grades and transcripts.
          </p>
        </div>
        {submittedAttempts.length > 0 ? (
          <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-[#11162A]">
            {[...submittedAttempts]
              .sort((a, b) => (b.submittedAt ?? 0) - (a.submittedAt ?? 0))
              .map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {attempt.quizTitle}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {attempt.submittedAt
                        ? new Date(attempt.submittedAt).toLocaleString()
                        : "Submitted"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-violet-300">
                      {attempt.scorePercentage ?? 0}%
                    </span>
                    <Link
                      href={`/quizzes/${attempt.quizId}/review?attemptId=${encodeURIComponent(attempt.id)}`}
                      className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-white/[0.12] px-4 py-6 text-center text-sm text-slate-500">
            Completed attempts will appear here.
          </p>
        )}
      </section>

      <p className="text-center text-[11px] text-slate-500">
        Demonstration quiz content and locally stored practice results.
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    violet: "bg-violet-500/10 text-violet-300",
    cyan: "bg-cyan-500/10 text-cyan-300",
    emerald: "bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11162A] p-4 shadow-md shadow-black/10 transition duration-300 hover:border-white/[0.12] hover:shadow-lg sm:p-5">
      <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-violet-500/[0.04] blur-2xl" />
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ring-white/[0.04] ${colors[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-400 sm:text-sm">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:mt-4">{value}</p>
    </div>
  );
}
