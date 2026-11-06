
"use client";
import AcademicStaffDashboard from "@/components/dashboard/AcademicStaffDashboard";
import {
  BookOpen,
  ClipboardList,
  NotebookPen,
  ArrowUpRight,
  
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    title: "AI Academic Assistant",
    description: "Ask questions and get intelligent academic guidance.",
    icon: null,
    href: "/assistant",
    color: "violet",
  },
  {
    title: "Explore Learning",
    description: "Discover academic resources and learning materials.",
    icon: BookOpen,
    href: "/learning",
    color: "cyan",
  },
  {
    title: "Take a Quiz",
    description: "Test your knowledge and improve your understanding.",
    icon: ClipboardList,
    href: "/quizzes",
    color: "blue",
  },
  {
    title: "My Notes",
    description: "Organize and revisit your academic notes.",
    icon: NotebookPen,
    href: "/notes",
    color: "pink",
  },
];

function NexoraMark({
  className,
  textClassName,
}: {
  className: string;
  textClassName: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20 ${className}`}
    >
      <span className={`font-black leading-none text-white ${textClassName}`}>
        N
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const dashboardRole = "academic_staff" as "student" | "academic_staff";

  if (dashboardRole === "academic_staff") {
    return <AcademicStaffDashboard />;
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">

      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.12] via-[#11162A] to-cyan-500/[0.06] p-7 sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-300">
            
          Your Intelligent Academic Workspace
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome back,
            <span className="block bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              Academic Staff!
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Your academic journey, knowledge, and AI-powered learning
            experience come together in one intelligent workspace.
          </p>

          <Link
            href="/assistant"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/30"
          >
            
            Start with AI Assistant
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* AI Assistant Spotlight */}
      <section className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 transition hover:border-violet-500/25 sm:p-8">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-400/[0.05] blur-3xl transition group-hover:bg-violet-500/[0.08]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <NexoraMark className="h-12 w-12" textClassName="text-xl" />

            <div>
              <h3 className="text-lg font-semibold text-white">
                Your AI Academic Assistant
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Get answers from academic knowledge, explore concepts,
                and receive intelligent study guidance.
              </p>
            </div>
          </div>

          <Link
            href="/assistant"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
          >
            Open Assistant
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Quick Access
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Jump straight into your academic activities.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-500/25 hover:bg-[#171D35]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-violet-300 transition group-hover:bg-violet-500/15">
                    {Icon ? (
                      <Icon size={22} />
                    ) : (
                      <NexoraMark
                        className="h-11 w-11"
                        textClassName="text-lg"
                      />
                    )}
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="text-slate-600 transition group-hover:text-violet-300"
                  />
                </div>

                <h4 className="font-semibold text-white">
                  {action.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Academic Overview Placeholder */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
          <div className="flex items-center gap-3">
            <GraduationCap size={20} className="text-cyan-300" />
            <h3 className="font-semibold text-white">
              Academic Overview
            </h3>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Your academic information and upcoming activities
            will appear here when connected to the platform.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
          <div className="flex items-center gap-3">
            
            <h3 className="font-semibold text-white">
              Recent Activity
            </h3>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Your recent AI conversations, quizzes, and learning
            activities will appear here.
          </p>
        </div>
      </section>

    </div>
  );
}
