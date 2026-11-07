
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
import { useManagedQuizzes } from "@/lib/quiz-storage";

const quizData: Record<
  string,
  {
    title: string;
    subject: string;
    description: string;
    questions: number;
    duration: number;
    difficulty: string;
  }
> = {
  "quiz-01": {
    title: "Introduction to Machine Learning",
    subject: "Artificial Intelligence",
    description:
      "Test your understanding of machine learning fundamentals, algorithms, model training, and evaluation.",
    questions: 20,
    duration: 30,
    difficulty: "Intermediate",
  },
  "quiz-02": {
    title: "Database Management Systems",
    subject: "Computer Science",
    description:
      "Review relational databases, SQL queries, normalization, and transaction management.",
    questions: 15,
    duration: 25,
    difficulty: "Beginner",
  },
  "quiz-03": {
    title: "Data Structures and Algorithms",
    subject: "Computer Science",
    description:
      "Evaluate your knowledge of data structures, algorithm design, and computational complexity.",
    questions: 25,
    duration: 45,
    difficulty: "Advanced",
  },
  "quiz-04": {
    title: "Software Engineering Principles",
    subject: "Software Engineering",
    description:
      "Practice software design principles, development methodologies, and software testing.",
    questions: 20,
    duration: 35,
    difficulty: "Intermediate",
  },
  "quiz-05": {
    title: "Computer Networks",
    subject: "Networking",
    description:
      "Explore network protocols, architectures, and communication fundamentals.",
    questions: 15,
    duration: 20,
    difficulty: "Beginner",
  },
  "quiz-06": {
    title: "Artificial Intelligence Fundamentals",
    subject: "Artificial Intelligence",
    description:
      "Assess your understanding of search algorithms, reasoning, and intelligent systems.",
    questions: 30,
    duration: 50,
    difficulty: "Advanced",
  },
};

export default function QuizInstructionsPage() {
  const params = useParams();
  const id = params.id as string;
  const savedQuiz = useManagedQuizzes().find((item) => item.id === id);

  const managedQuiz =
    savedQuiz && savedQuiz.questions.length > 0
      ? {
          title: savedQuiz.title,
          subject: savedQuiz.subject,
          description: savedQuiz.description,
          questions: savedQuiz.questions.length,
          duration: savedQuiz.duration,
          difficulty: savedQuiz.difficulty,
        }
      : undefined;
  const quiz = managedQuiz ?? quizData[id];
  const isUnavailable =
    savedQuiz !== undefined &&
    (savedQuiz.status !== "Published" ||
      (savedQuiz.questions.length === 0 && !quizData[id]));

  if (!quiz || isUnavailable) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertCircle size={40} className="text-violet-400" />
        <h1 className="mt-5 text-2xl font-semibold text-white">
          Quiz not found
        </h1>
        <p className="mt-2 text-slate-400">
          This quiz is unavailable or has not been published.
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
            <MetaItem icon={<CircleHelp size={18} />} value={`${quiz.questions} Questions`} />
            <MetaItem icon={<Clock size={18} />} value={`${quiz.duration} Minutes`} />
            <MetaItem icon={<BookOpen size={18} />} value="1 Attempt" />
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
              <RuleItem label="Attempts Allowed" value="1 attempt" />
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
            <RuleItem label="Questions" value={`${quiz.questions}`} />
            <RuleItem label="Duration" value={`${quiz.duration} min`} />
          </div>

          <Link
            href={`/quizzes/${id}/attempt`}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500"
          >
            Start Quiz
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

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
