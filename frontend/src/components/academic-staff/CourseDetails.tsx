"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  FileText,
  FolderGit2,
  Plus,
  ArrowUpRight,
  Sparkles,
  Award,
  Layers,
  Eye,
  X,
} from "lucide-react";
import { StaffCourse, StaffCourseResource } from "@/lib/academic-staff-types";

interface CourseDetailsProps {
  course: StaffCourse;
  resources: StaffCourseResource[];
}

export default function CourseDetails({
  course,
  resources,
}: CourseDetailsProps) {
  const [previewResource, setPreviewResource] =
    useState<StaffCourseResource | null>(null);

  return (
    <div className="space-y-8">
      {/* Back button and quick breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/academic-services/courses"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          <span>Back to Assigned Courses</span>
        </Link>

        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
          {course.semester} · {course.academicYear}
        </span>
      </div>

      {/* Course Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121633] via-[#0E1328] to-[#0A0D1D] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-48 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 font-mono text-sm font-bold text-cyan-300">
                {course.code}
              </span>
              <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300">
                {course.credits} Credits
              </span>
              <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400">
                {course.department}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {course.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              {course.description}
            </p>

            {/* Timetable and Venue pills */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2">
                <Clock size={15} className="text-violet-400" />
                <span>{course.schedule}</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2">
                <MapPin size={15} className="text-emerald-400" />
                <span>{course.venue}</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2">
                <Users size={15} className="text-cyan-400" />
                <span>
                  <strong className="text-white">{course.studentCount}</strong> Students Enrolled
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
            <Link
              href="/quiz-management/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.98]"
            >
              <Plus size={15} />
              <span>Create Course Quiz</span>
            </Link>

            <Link
              href="/academic-services/resources"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08]"
            >
              <FolderGit2 size={15} className="text-cyan-400" />
              <span>All Resources</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Syllabus Completion</span>
            <Award size={18} className="text-cyan-400" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-white">
            {course.syllabusProgress}%
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#080B18]">
            <div
              style={{ width: `${course.syllabusProgress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Quizzes</span>
            <Sparkles size={18} className="text-violet-400" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-white">
            {course.activeQuizzesCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">Formative assessments published</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Coursework Milestones</span>
            <Layers size={18} className="text-blue-400" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-white">
            {course.assignmentsCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">Graded submissions & labs</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Teaching Materials</span>
            <FileText size={18} className="text-emerald-400" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-white">
            {resources.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Slides, notes and lab guides</p>
        </div>
      </section>

      {/* Learning Objectives */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-cyan-400" />
          <h2 className="text-base font-semibold text-white">
            Official Course Learning Objectives (CLOs)
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Accreditation criteria mapped to the Faculty Quality Assurance Framework
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {course.learningObjectives.map((objective, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#0D1225] p-3.5 text-xs text-slate-200"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-500/10 text-[10px] font-bold font-mono text-cyan-300">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{objective}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Associated Course Teaching Materials */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Associated Teaching Resources ({resources.length})
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Curated lecture slides, lab exercises, and reference notes for {course.code}
            </p>
          </div>

          <Link
            href="/academic-services/resources"
            className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            <span>View All Library</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {resources.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-white/[0.1] p-6 text-center text-xs text-slate-500">
            No resources linked to this course yet.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0D1225] p-4 transition hover:border-cyan-500/30 hover:bg-[#121832]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-cyan-500/10 p-2 text-cyan-400 shrink-0">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                        {res.title}
                      </h3>
                      <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-400">
                        {res.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {res.fileSize}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {res.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPreviewResource(res)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <Eye size={13} />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Preview Modal */}
      {previewResource && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-[#0D1225] p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                  {previewResource.type}
                </span>
                <h3 className="mt-2 text-base font-bold text-white">
                  {previewResource.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {previewResource.courseCode}: {previewResource.courseTitle}
                </p>
              </div>

              <button
                onClick={() => setPreviewResource(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-5 max-h-[350px] overflow-y-auto rounded-xl border border-white/[0.06] bg-[#080B18] p-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
              {previewResource.previewContent ||
                `File Name: ${previewResource.fileName || "N/A"}\nFile Size: ${previewResource.fileSize}\nDate Added: ${previewResource.dateAdded}\n\n[Demonstration preview of course teaching resource content for ${previewResource.courseCode}]`}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs">
              <span className="text-slate-500">
                Read-only academic staff teaching resource preview
              </span>
              <button
                onClick={() => setPreviewResource(null)}
                className="rounded-xl bg-white/[0.06] px-4 py-2 font-medium text-white hover:bg-white/[0.1]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
