
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  Clock,
  Users,
  Pencil,
  Trash2,
  Eye,
  Upload,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  deleteManagedQuiz,
  saveManagedQuiz,
  useManagedQuizzes,
  type ManagedQuiz,
} from "@/lib/quiz-storage";
import { useDemoAuth } from "@/lib/demo-auth-context";

type Quiz = {
  id: string;
  title: string;
  subject: string;
  questions: number;
  duration: number;
  attempts: number;
  status: "Published" | "Draft";
};

const initialQuizzes: Quiz[] = [
  {
    id: "quiz-01",
    title: "Introduction to Machine Learning",
    subject: "Artificial Intelligence",
    questions: 8,
    duration: 20,
    attempts: 124,
    status: "Published",
  },
  {
    id: "quiz-02",
    title: "Database Fundamentals",
    subject: "Database Systems",
    questions: 10,
    duration: 25,
    attempts: 86,
    status: "Published",
  },
  {
    id: "quiz-03",
    title: "Data Structures and Algorithms",
    subject: "Computer Science",
    questions: 15,
    duration: 30,
    attempts: 0,
    status: "Draft",
  },
];

export default function QuizManagementPage() {
  const router = useRouter();
  const { role } = useDemoAuth();
  const savedQuizzes = useManagedQuizzes();

  // Role guard: only academic_staff may access this page
  useEffect(() => {
    if (role !== null && role !== "academic_staff") {
      router.replace("/dashboard");
    }
  }, [role, router]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [hiddenSampleIds, setHiddenSampleIds] = useState<string[]>([]);

  const quizzes = useMemo(() => {
    const savedById = new Map(savedQuizzes.map((quiz) => [quiz.id, quiz]));
    const sampleIds = new Set(initialQuizzes.map((quiz) => quiz.id));
    const samples = initialQuizzes
      .filter((quiz) => !hiddenSampleIds.includes(quiz.id))
      .map((quiz) => {
        const saved = savedById.get(quiz.id);
        return saved
          ? {
              ...quiz,
              ...(saved.questions.length > 0
                ? {
                    title: saved.title,
                    subject: saved.subject,
                    questions: saved.questions.length,
                    duration: saved.duration,
                    attempts: saved.attempts ?? quiz.attempts,
                  }
                : {}),
              status: saved.status,
            }
          : quiz;
      });
    const managed = savedQuizzes
      .filter((quiz) => !sampleIds.has(quiz.id))
      .map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        questions: quiz.questions.length,
        duration: quiz.duration,
        attempts: quiz.attempts ?? 0,
        status: quiz.status,
      }));
    return [...samples, ...managed];
  }, [savedQuizzes, hiddenSampleIds]);

  // Search and filter
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || quiz.status === filter;

    return matchesSearch && matchesFilter;
  });

  // Statistics
  const publishedCount = quizzes.filter(
    (quiz) => quiz.status === "Published"
  ).length;

  const draftCount = quizzes.filter(
    (quiz) => quiz.status === "Draft"
  ).length;

  const totalAttempts = quizzes.reduce(
    (total, quiz) => total + quiz.attempts,
    0
  );

  // Delete quiz from dashboard and localStorage
  const deleteQuiz = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmed) return;

    try {
      if (initialQuizzes.some((quiz) => quiz.id === id)) {
        setHiddenSampleIds((current) => [...current, id]);
      }
      deleteManagedQuiz(id);
    } catch (error) {
      console.error("Failed to delete saved quiz:", error);
      window.alert("Unable to delete quiz. Please try again.");
    }
  };

  const toggleQuizStatus = (quiz: Quiz) => {
    const newStatus: Quiz["status"] =
      quiz.status === "Published" ? "Draft" : "Published";

    try {
      const current = savedQuizzes.find((item) => item.id === quiz.id);
      const updatedQuiz: ManagedQuiz = current
        ? { ...current, status: newStatus }
        : {
            id: quiz.id,
            title: quiz.title,
            description: "",
            subject: quiz.subject,
            difficulty: "Intermediate",
            duration: quiz.duration,
            questions: [],
            questionCount: 0,
            attempts: quiz.attempts,
            status: newStatus,
          };
      saveManagedQuiz(updatedQuiz);
    } catch (error) {
      console.error("Failed to update quiz status:", error);
      window.alert("Unable to update quiz status. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#080B18] px-4 py-8 text-[#F8FAFC] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-violet-400">
              ACADEMIC STAFF WORKSPACE
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Quiz Management
            </h1>

            <p className="mt-2 text-sm text-[#94A3B8]">
              Create, organize, and manage your academic assessments.
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/quiz-management/create")
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <Plus className="h-4 w-4" />
            Create New Quiz
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Quizzes"
            value={quizzes.length}
            icon={<FileText className="h-5 w-5" />}
          />

          <StatCard
            title="Published"
            value={publishedCount}
            icon={<Upload className="h-5 w-5" />}
          />

          <StatCard
            title="Drafts"
            value={draftCount}
            icon={<Clock className="h-5 w-5" />}
          />

          <StatCard
            title="Total Attempts"
            value={totalAttempts}
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        {/* Quiz Table */}
        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11162A]">

          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Your Assessments
              </h2>

              <p className="mt-1 text-sm text-[#94A3B8]">
                Manage all your quizzes in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search quizzes..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-violet-500 sm:w-56"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#080B18] px-4 py-2.5 text-sm text-[#CBD5E1] outline-none focus:border-violet-500"
              >
                <option value="All">All Quizzes</option>
                <option value="Published">Published</option>
                <option value="Draft">Drafts</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-white/[0.02] text-xs uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="px-6 py-4 font-medium">Quiz</th>
                  <th className="px-6 py-4 font-medium">Questions</th>
                  <th className="px-6 py-4 font-medium">Duration</th>
                  <th className="px-6 py-4 font-medium">Attempts</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.05]">
                {filteredQuizzes.map((quiz) => (
                      <tr
                        key={quiz.id}
                        className="transition hover:bg-white/[0.025]"
                      >
                        <td className="px-6 py-5">
                          <div className="font-medium text-white">
                            {quiz.title}
                          </div>

                          <div className="mt-1 text-xs text-[#94A3B8]">
                            {quiz.subject}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-[#CBD5E1]">
                          {quiz.questions}
                        </td>

                        <td className="px-6 py-5 text-sm text-[#CBD5E1]">
                          {quiz.duration} min
                        </td>

                        <td className="px-6 py-5 text-sm text-[#CBD5E1]">
                          {quiz.attempts}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                              quiz.status === "Published"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {quiz.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              title="View quiz"
                              onClick={() =>
                                router.push(`/quizzes/${quiz.id}`)
                              }
                              className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-white/[0.06] hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              title="Edit quiz"
                              onClick={() =>
                                router.push(
                                  `/quiz-management/${quiz.id}/edit`
                                )
                              }
                              className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-violet-500/10 hover:text-violet-400"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              title={
                                quiz.status === "Published"
                                  ? "Unpublish quiz"
                                  : "Publish quiz"
                              }
                              onClick={() => toggleQuizStatus(quiz)}
                              className={`rounded-lg p-2 transition ${
                                quiz.status === "Published"
                                  ? "text-emerald-400 hover:bg-amber-500/10 hover:text-amber-400"
                                  : "text-[#94A3B8] hover:bg-emerald-500/10 hover:text-emerald-400"
                              }`}
                            >
                              {quiz.status === "Published" ? (
                                <RotateCcw className="h-4 w-4" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
                            </button>

                            <button
                              title="Delete quiz"
                              onClick={() => deleteQuiz(quiz.id)}
                              className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                {filteredQuizzes.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center text-sm text-[#64748B]"
                    >
                      No quizzes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#94A3B8]">{title}</p>

        <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}
