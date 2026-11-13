"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  UserRound,
} from "lucide-react";
import StudentRouteGuard from "@/components/layout/StudentRouteGuard";
import { COURSE_SUPPLEMENTARY_INFO } from "@/lib/course-content";
import { useStudentAcademicRecord } from "@/lib/academic-storage";
import { useStudentEnrollments } from "@/lib/student-enrollments";

export default function CourseDetailsPage() {
  const params = useParams<{ courseId: string }>();
  const { record } = useStudentAcademicRecord();
  const enrollments = useStudentEnrollments(record.studentId);
  const courseEntry = record.terms
    .flatMap((term) => term.courses.map((course) => ({ course, term })))
    .find(
      ({ course, term }) =>
        course.id === params.courseId &&
        enrollments.some(
          (enrollment) =>
            enrollment.courseId === course.id && enrollment.termId === term.id,
        ),
    );

  if (!courseEntry) {
    return (
      <StudentRouteGuard>
        <div className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
            <BookOpen size={25} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">
            Course not found
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This course could not be found in your academic records.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <ArrowLeft size={16} />
            Return to My Courses
          </Link>
        </div>
      </StudentRouteGuard>
    );
  }

  const { course, term } = courseEntry;
  const supplementary = COURSE_SUPPLEMENTARY_INFO[course.id];

  return (
    <StudentRouteGuard>
      <div className="mx-auto w-full max-w-6xl space-y-7 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to My Courses
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#171D35] via-[#11162A] to-[#0C1020] p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                {course.courseCode}
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-slate-300">
                {course.category}
              </span>
              {term.isCurrent && (
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  Current term
                </span>
              )}
            </div>

            <h2 className="mt-5 max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {course.courseTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              {supplementary?.description ??
                "A course in the academic record. Supplementary course information has not been added yet."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/courses/${course.id}/materials`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:from-violet-500 hover:to-violet-400"
              >
                <BookOpenCheck size={17} />
                Course Materials
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DetailItem
            icon={<UserRound size={18} />}
            label="Lecturer / instructor"
            value={course.instructor ?? "Not listed in academic record"}
            color="violet"
          />
          <DetailItem
            icon={<GraduationCap size={18} />}
            label="Credits"
            value={`${course.credits} credits`}
            color="cyan"
          />
          <DetailItem
            icon={<CalendarDays size={18} />}
            label="Academic term"
            value={term.label}
            color="blue"
          />
          <DetailItem
            icon={<BookOpen size={18} />}
            label="Category"
            value={course.category}
            color="emerald"
          />
        </section>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                <CheckCircle2 size={19} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Learning objectives</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Illustrative demo content
                </p>
              </div>
            </div>
            {supplementary ? (
              <ul className="mt-5 space-y-3">
                {supplementary.learningObjectives.map((objective) => (
                  <li
                    key={objective}
                    className="flex gap-3 text-sm leading-6 text-slate-300"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-1 shrink-0 text-cyan-300"
                    />
                    {objective}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-slate-400">
                Learning objectives are not available for this course yet.
              </p>
            )}
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5">
              <div className="flex items-center gap-3">
                <ClipboardList size={18} className="text-violet-300" />
                <h3 className="font-semibold text-white">Prerequisites</h3>
              </div>
              {supplementary?.prerequisites?.length ? (
                <ul className="mt-4 space-y-2">
                  {supplementary.prerequisites.map((prerequisite) => (
                    <li
                      key={prerequisite}
                      className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-xs text-slate-300"
                    >
                      {prerequisite}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  No prerequisite information is listed.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white">
                Academic result
              </h3>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">Recorded grade</p>
                  <p className="mt-1 text-2xl font-semibold text-violet-200">
                    {course.grade}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Grade points</p>
                  <p className="mt-1 font-mono text-lg text-white">
                    {course.gradePoints.toFixed(2)}
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <p className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3 text-xs leading-5 text-amber-100/70">
          Course descriptions, objectives, and prerequisite examples are
          illustrative demo content, not official institutional information.
          Grades shown here are academic results and do not establish enrollment.
        </p>
      </div>
    </StudentRouteGuard>
  );
}

function DetailItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "violet" | "cyan" | "blue" | "emerald";
}) {
  const colors = {
    violet: "bg-violet-500/10 text-violet-300",
    cyan: "bg-cyan-500/10 text-cyan-300",
    blue: "bg-blue-500/10 text-blue-300",
    emerald: "bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-slate-500">{label}</p>
          <p className="mt-1 truncate text-sm font-medium text-slate-200">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
