"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Users,
  Calendar,
  ArrowRight,
  Filter,
  Clock,
  MapPin,
} from "lucide-react";
import { StaffCourse } from "@/lib/academic-staff-types";

interface CourseTableProps {
  courses: StaffCourse[];
}

export default function CourseTable({ courses }: CourseTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");

  // Derive unique filter options
  const semesters = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.semester));
    return ["All", ...Array.from(set)];
  }, [courses]);

  const years = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.academicYear));
    return ["All", ...Array.from(set)];
  }, [courses]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        c.code.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.department.toLowerCase().includes(query);

      const matchesSemester =
        selectedSemester === "All" || c.semester === selectedSemester;
      const matchesYear =
        selectedYear === "All" || c.academicYear === selectedYear;

      return matchesSearch && matchesSemester && matchesYear;
    });
  }, [courses, searchTerm, selectedSemester, selectedYear]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedSemester("All");
    setSelectedYear("All");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by course code, title, or department..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 transition focus:border-cyan-400/50 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-1.5 text-xs text-slate-400">
            <Filter size={13} className="text-cyan-400" />
            <span className="hidden sm:inline">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              {semesters.map((s) => (
                <option key={s} value={s} className="bg-[#0D1225] text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-1.5 text-xs text-slate-400">
            <Calendar size={13} className="text-violet-400" />
            <span className="hidden sm:inline">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-[#0D1225] text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedSemester !== "All" || selectedYear !== "All") && (
            <button
              onClick={handleResetFilters}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{filteredCourses.length}</strong> of{" "}
          {courses.length} assigned courses
        </span>
        <span className="text-[11px] text-slate-500">
          Click any course row to view syllabus & resources
        </span>
      </div>

      {/* Courses Table / Cards */}
      {filteredCourses.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[#11162A]/50 p-8 text-center">
          <BookOpen size={36} className="text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-white">No Assigned Courses Match</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            No courses found with the selected criteria. Try adjusting your search query or reset
            the filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 rounded-xl bg-violet-600/20 border border-violet-500/30 px-4 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-600/30"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 transition duration-200 hover:border-cyan-500/30 hover:bg-[#141B34]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Course Primary Info */}
                <div className="flex items-start gap-4">
                  <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-3 text-center text-cyan-300 shrink-0 min-w-[70px]">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Code
                    </span>
                    <span className="block text-base font-bold font-mono text-white mt-0.5">
                      {course.code}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-white transition group-hover:text-cyan-300">
                        {course.title}
                      </h3>
                      <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-slate-300">
                        {course.credits} Credits
                      </span>
                      <span className="rounded-md border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                        {course.semester} · {course.academicYear}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-400 max-w-3xl line-clamp-2">
                      {course.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Users size={13} className="text-cyan-400" />
                        <strong className="text-white">{course.studentCount}</strong> Students Enrolled
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-violet-400" />
                        {course.schedule}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-emerald-400" />
                        {course.venue}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Progress & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:shrink-0 lg:pl-4 border-t border-white/[0.06] pt-4 lg:border-t-0 lg:pt-0">
                  {/* Syllabus Progress */}
                  <div className="w-full sm:w-36">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Syllabus</span>
                      <span className="font-mono font-semibold text-white">
                        {course.syllabusProgress}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#080B18]">
                      <div
                        style={{ width: `${course.syllabusProgress}%` }}
                        className={`h-full rounded-full ${
                          course.syllabusProgress === 100
                            ? "bg-emerald-400"
                            : "bg-gradient-to-r from-violet-500 to-cyan-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* View Details Link */}
                  <Link
                    href={`/academic-services/courses/${course.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-cyan-500/10 hover:border-cyan-400/30 hover:text-cyan-300 w-full sm:w-auto justify-center"
                  >
                    <span>Course Details</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
