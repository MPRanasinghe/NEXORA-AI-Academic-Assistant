
"use client";

import Link from "next/link";
import {
  BookOpen,
  Users,
  ClipboardList,
  ChartNoAxesCombined,
  ArrowUpRight,
  Plus,
  GraduationCap,
  FileUp,
  Activity,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

const overviewCards = [
  {
    label: "Assigned Courses",
    value: "08",
    description: "Demo data",
    icon: BookOpen,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    label: "Total Students",
    value: "246",
    description: "Demo data",
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    label: "Active Quizzes",
    value: "12",
    description: "Demo data",
    icon: ClipboardList,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Average Performance",
    value: "78%",
    description: "Demo data",
    icon: ChartNoAxesCombined,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const performanceData = [
  { week: "W1", score: 64 },
  { week: "W2", score: 71 },
  { week: "W3", score: 68 },
  { week: "W4", score: 76 },
  { week: "W5", score: 73 },
  { week: "W6", score: 82 },
  { week: "W7", score: 78 },
  { week: "W8", score: 86 },
];

const courses = [
  {
    name: "Introduction to Computing",
    code: "ICT101",
    students: 84,
    progress: 78,
    color: "bg-violet-500",
  },
  {
    name: "Database Systems",
    code: "ICT204",
    students: 62,
    progress: 65,
    color: "bg-cyan-400",
  },
  {
    name: "Software Engineering",
    code: "ICT305",
    students: 56,
    progress: 91,
    color: "bg-blue-400",
  },
];

const recentActivities = [
  {
    title: "Quiz created",
    detail: "Introduction to Computing",
    time: "Recently",
    icon: ClipboardList,
    color: "text-violet-400",
  },
  {
    title: "Course resource uploaded",
    detail: "Database Systems",
    time: "Recently",
    icon: FileUp,
    color: "text-cyan-400",
  },
  {
    title: "Student performance reviewed",
    detail: "Software Engineering",
    time: "Recently",
    icon: Activity,
    color: "text-emerald-400",
  },
];

function PerformanceChart() {
  const width = 600;
  const height = 220;
  const paddingX = 35;
  const paddingY = 25;

  const points = performanceData.map((item, index) => {
    const x =
      paddingX +
      (index * (width - paddingX * 2)) /
        (performanceData.length - 1);

    const y =
      height -
      paddingY -
      ((item.score - 40) / 60) *
        (height - paddingY * 2);

    return { x, y, ...item };
  });

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="mt-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-white">86%</p>
          <p className="text-xs text-slate-400">
            Latest average score · Demo data
          </p>
        </div>
        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
          8 weeks
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        role="img"
        aria-label="Illustrative student performance trend"
      >
        <defs>
          <linearGradient id="performanceArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[40, 60, 80, 100].map((value) => {
          const y =
            height -
            paddingY -
            ((value - 40) / 60) *
              (height - paddingY * 2);

          return (
            <g key={value}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(148,163,184,0.12)"
                strokeDasharray="4 5"
              />
              <text
                x={paddingX - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#64748B"
              >
                {value}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#performanceArea)" />

        <path
          d={linePath}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point) => (
          <circle
            key={point.week}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#0D1225"
            stroke="#A78BFA"
            strokeWidth="2"
          />
        ))}

        {points.map((point) => (
          <text
            key={`${point.week}-label`}
            x={point.x}
            y={height}
            textAnchor="middle"
            fontSize="10"
            fill="#64748B"
          >
            {point.week}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function AcademicStaffDashboard() {
  return (
    <div className="space-y-8 p-5 sm:p-8">

      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-500/15 bg-gradient-to-br from-[#171633] via-[#11162A] to-[#0D1225] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            <GraduationCap size={15} />
            Academic Workspace
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, Academic Staff!
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Manage your courses, monitor student progress,
            and organize your academic activities from one workspace.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/quizzes/manage"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
            >
              <Plus size={17} />
              Create Quiz
            </Link>

            <Link
              href="/academic"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
            >
              View Academic Services
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Demo data notice */}
      <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3 text-xs text-amber-300/80">
        Illustrative dashboard data — actual university statistics
        will appear after backend integration.
      </div>

      {/* Overview Cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Academic Overview
          </h2>
          <span className="text-xs text-slate-500">Overview</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="group rounded-2xl border border-white/[0.07] bg-[#11162A] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-500/20"
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-3 ${card.bg}`}>
                    <Icon size={21} className={card.color} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-slate-600 transition group-hover:text-violet-400"
                  />
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  {card.label}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                  {card.value}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Analytics */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.07] bg-[#11162A] p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Student Performance
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Average quiz score trend
              </p>
            </div>
            <div className="rounded-xl bg-violet-500/10 p-2.5">
              <ChartNoAxesCombined size={19} className="text-violet-400" />
            </div>
          </div>

          <PerformanceChart />
        </div>

        {/* Course progress */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#11162A] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Course Overview</h2>
            <BookOpen size={19} className="text-cyan-400" />
          </div>

          <div className="mt-6 space-y-6">
            {courses.map((course) => (
              <div key={course.code}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {course.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {course.code} · {course.students} students
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-300">
                    {course.progress}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${course.color}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/academic"
            className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4 text-sm text-violet-300 transition hover:text-violet-200"
          >
            View courses
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Create Quiz",
              description: "Build assessments for students",
              icon: ClipboardList,
              href: "/quizzes/manage",
              color: "text-violet-400",
              bg: "bg-violet-500/10",
            },
            {
              title: "Manage Courses",
              description: "Organize your academic courses",
              icon: BookOpen,
              href: "/academic",
              color: "text-cyan-400",
              bg: "bg-cyan-500/10",
            },
            {
              title: "Student Insights",
              description: "Review learning performance",
              icon: Users,
              href: "/academic",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              title: "Upload Resources",
              description: "Share academic materials",
              icon: FileUp,
              href: "/academic",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ].map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#11162A] p-4 transition hover:border-violet-500/20 hover:bg-[#171D35]"
              >
                <div className={`rounded-xl p-3 ${action.bg}`}>
                  <Icon size={20} className={action.color} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-200">
                    {action.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {action.description}
                  </p>
                </div>

                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-slate-600 transition group-hover:text-violet-400"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="rounded-2xl border border-white/[0.07] bg-[#11162A] p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">Recent Activity</h2>
            <p className="mt-1 text-xs text-slate-500">
              Your latest academic activities
            </p>
          </div>
          <CalendarDays size={19} className="text-slate-500" />
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.title}
                className={`flex items-center gap-4 ${
                  index !== recentActivities.length - 1
                    ? "border-b border-white/[0.06] pb-4"
                    : ""
                }`}
              >
                <div className="rounded-xl bg-white/[0.04] p-3">
                  <Icon size={18} className={activity.color} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {activity.detail}
                  </p>
                </div>

                <span className="text-xs text-slate-500">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
