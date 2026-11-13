"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenCheck,
  BookOpen,
  CalendarDays,
  Filter,
  GraduationCap,
  Search,
} from "lucide-react";
import StudentRouteGuard from "@/components/layout/StudentRouteGuard";
import { useStudentAcademicRecord } from "@/lib/academic-storage";
import { useStudentEnrollments } from "@/lib/student-enrollments";

export default function MyCoursesPage() {
  const { record } = useStudentAcademicRecord();
  const enrollments = useStudentEnrollments(record.studentId);
  const [search, setSearch] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("current");
  const currentTerm = record.terms.find((term) => term.isCurrent);

  const courses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enrollments
      .filter((enrollment) => {
        if (selectedTerm === "all") return true;
        if (selectedTerm === "current") {
          return (
            enrollment.status === "Enrolled" &&
            enrollment.termId === currentTerm?.id
          );
        }
        return enrollment.termId === selectedTerm;
      })
      .flatMap((enrollment) => {
        const term = record.terms.find((item) => item.id === enrollment.termId);
        const course = term?.courses.find(
          (item) => item.id === enrollment.courseId,
        );
        return term && course ? [{ course, term, enrollment }] : [];
      })
      .filter(({ course }) => {
        if (!query) return true;
        return (
          course.courseCode.toLowerCase().includes(query) ||
          course.courseTitle.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => Number(b.term.isCurrent) - Number(a.term.isCurrent));
  }, [currentTerm?.id, enrollments, record.terms, search, selectedTerm]);

  const currentEnrollmentCount = enrollments.filter(
    (enrollment) =>
      enrollment.status === "Enrolled" && enrollment.termId === currentTerm?.id,
  ).length;

  return (
    <StudentRouteGuard>
      <div className="mx-auto w-full max-w-[1440px] space-y-7 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
        <section className="relative overflow-hidden rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.12] via-[#11162A] to-cyan-500/[0.06] p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
                <GraduationCap size={15} />
                Academic workspace
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                My Courses
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Review your enrolled courses and their course-specific learning
                materials.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#080B18]/50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                <BookOpenCheck size={20} />
              </div>
              <div>
                <p className="text-xl font-semibold text-white">
                  {currentEnrollmentCount}
                </p>
                <p className="text-xs text-slate-400">Current-term courses</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.04] px-4 py-3 text-xs leading-5 text-cyan-100/70">
          Enrollments are stored separately from academic grades. Completed
          course results remain available in Academic Progress; course
          descriptions and materials are illustrative demo content.
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-violet-300">
                <CalendarDays size={15} />
                {currentTerm ? currentTerm.label : "Academic terms"}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {selectedTerm === "current"
                  ? "Current academic term"
                  : "Course catalogue"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {currentTerm
                  ? `${currentTerm.academicYear} · ${currentEnrollmentCount} enrolled courses`
                  : "Choose an academic term to view its recorded courses."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative min-w-0 flex-1 sm:min-w-[260px]">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search course code or title..."
                  aria-label="Search courses by code or title"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#11162A] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/40"
                />
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#11162A] px-3">
                <Filter size={16} className="shrink-0 text-slate-400" />
                <select
                  aria-label="Filter courses by academic term"
                  value={selectedTerm}
                  onChange={(event) => setSelectedTerm(event.target.value)}
                  className="min-w-0 bg-transparent py-3 text-sm text-slate-300 outline-none"
                >
                  <option value="current" className="bg-[#11162A]">
                    Current term
                  </option>
                  <option value="all" className="bg-[#11162A]">
                    All terms
                  </option>
                  {record.terms
                    .filter((term) =>
                      enrollments.some(
                        (enrollment) => enrollment.termId === term.id,
                      ),
                    )
                    .filter((term) => !term.isCurrent)
                    .map((term) => (
                      <option
                        key={term.id}
                        value={term.id}
                        className="bg-[#11162A]"
                      >
                        {term.label}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Showing {courses.length} {courses.length === 1 ? "course" : "courses"}
          </p>

          {courses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {courses.map(({ course, term, enrollment }) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className={`group relative flex min-h-[250px] flex-col overflow-hidden rounded-2xl border p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-[#171D35] ${
                    term.isCurrent
                      ? "border-violet-500/25 bg-gradient-to-br from-violet-500/[0.08] to-[#11162A]"
                      : "border-white/[0.08] bg-[#11162A] hover:border-white/[0.15]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
                      <BookOpen size={20} />
                    </div>
                    {term.isCurrent && (
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                        Current
                      </span>
                    )}
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        enrollment.status === "Enrolled"
                          ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                          : "border-white/[0.08] bg-white/[0.03] text-slate-400"
                      }`}
                    >
                      {enrollment.status}
                    </span>
                  </div>

                  <div className="mt-5 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                      {course.courseCode}
                    </p>
                    <h4 className="mt-2 text-base font-semibold leading-6 text-white group-hover:text-violet-200">
                      {course.courseTitle}
                    </h4>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                      {course.instructor ?? "Instructor not listed"}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4 text-[11px] text-slate-400">
                    <span className="rounded-md border border-white/[0.08] px-2 py-1">
                      {course.credits} credits
                    </span>
                    <span className="rounded-md border border-white/[0.08] px-2 py-1">
                      {course.category}
                    </span>
                    <span className="w-full truncate pt-1 text-slate-500">
                      {term.label}
                    </span>
                  </div>

                  <span className="absolute bottom-5 right-5 text-violet-300 opacity-0 transition group-hover:opacity-100">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#11162A]/70 px-5 py-16 text-center">
              <Search size={28} className="mx-auto text-slate-500" />
              <h4 className="mt-4 font-semibold text-white">
                {record.terms.length === 0
                  ? "No academic terms available"
                  : "No courses found"}
              </h4>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {record.terms.length === 0
                  ? "Courses will appear here when academic records are available."
                  : "Try another search or select a different academic term."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-sm font-medium text-violet-300 hover:text-violet-200"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </StudentRouteGuard>
  );
}
