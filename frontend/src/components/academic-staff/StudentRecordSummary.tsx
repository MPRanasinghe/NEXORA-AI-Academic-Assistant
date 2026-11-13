"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Mail,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Info,
  ScrollText,
} from "lucide-react";
import { StaffStudent, StudentStanding } from "@/lib/academic-staff-types";

interface StudentRecordSummaryProps {
  student: StaffStudent;
}

export default function StudentRecordSummary({
  student,
}: StudentRecordSummaryProps) {
  const getStandingBadge = (standing: StudentStanding) => {
    switch (standing) {
      case "Dean's List":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          text: "text-emerald-300",
          desc: "Student is on the Dean's Honours Roll for exceptional academic excellence (CGPA ≥ 3.70).",
        };
      case "Good Standing":
        return {
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/30",
          text: "text-cyan-300",
          desc: "Student is making satisfactory degree progress in compliance with faculty requirements.",
        };
      case "Academic Warning":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          text: "text-amber-300",
          desc: "Cumulative GPA between 2.00 and 2.15. Administrative notification advising student of probation threshold.",
        };
      case "Academic Probation":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-300",
          desc: "CGPA below 2.00. Subject to Academic Standing Review under Senate Regulation 4.3.",
        };
      default:
        return {
          bg: "bg-slate-500/10",
          border: "border-slate-500/30",
          text: "text-slate-300",
          desc: "Active student registration.",
        };
    }
  };

  const standingMeta = getStandingBadge(student.academicStanding);
  const creditPercentage = Math.round(
    (student.creditsCompleted / student.totalRequiredCredits) * 100
  );

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/academic-services/students"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          <span>Back to Student Roster</span>
        </Link>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${standingMeta.bg} ${standingMeta.border} ${standingMeta.text}`}
        >
          {student.academicStanding}
        </span>
      </div>

      {/* Student Profile Card */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121633] via-[#0E1328] to-[#0A0D1D] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-48 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-xl font-bold text-white shadow-lg shadow-violet-500/20">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-white sm:text-2xl">
                  {student.name}
                </h1>
                <span className="rounded-md border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300">
                  {student.studentId}
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-slate-300">
                {student.program} · {student.currentLevel}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-violet-400" />
                  {student.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-cyan-400" />
                  Intake: {student.intakeYear}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-white/[0.08] bg-[#080B18]/60 p-4 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Official Standing Advice
            </span>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              {standingMeta.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Illustrative Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 text-xs text-amber-200/90">
        <Info size={16} className="mt-0.5 shrink-0 text-amber-400" />
        <p className="leading-relaxed">
          <strong>Demonstration Record:</strong> This summary represents a synthetic student
          profile illustrating how course coordinators can inspect student progress, attendance
          metrics, and quiz completion across assigned modules.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Cumulative GPA */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cumulative GPA (CGPA)</span>
            <Award size={18} className="text-violet-400" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-white">
            {student.cgpa.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Standard 4.0 grading scale</p>
        </div>

        {/* Semester GPA */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Semester GPA (SGPA)</span>
            <TrendingUp size={18} className="text-cyan-400" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-white">
            {student.sgpa.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Current semester evaluation</p>
        </div>

        {/* Credit Progress */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Degree Workload</span>
            <BookOpen size={18} className="text-blue-400" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-white">
            {student.creditsCompleted}{" "}
            <span className="text-base font-normal text-slate-500">
              / {student.totalRequiredCredits}
            </span>
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#080B18]">
            <div
              style={{ width: `${creditPercentage}%` }}
              className="h-full rounded-full bg-blue-400"
            />
          </div>
        </div>

        {/* Cumulative Attendance */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cumulative Attendance</span>
            {student.attendanceRate >= 80 ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <AlertTriangle size={18} className="text-amber-400" />
            )}
          </div>
          <p
            className={`mt-2 font-mono text-3xl font-bold ${
              student.attendanceRate >= 80
                ? "text-emerald-400"
                : student.attendanceRate >= 70
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            {student.attendanceRate}%
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {student.attendanceRate >= 80
              ? "Eligible for final examinations"
              : "Below 80% threshold — condonation required"}
          </p>
        </div>
      </section>

      {/* Enrolled Staff Modules Table */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Performance in Your Assigned Courses
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Modules taught by your department where this student is currently registered
            </p>
          </div>

          <Link
            href="/academic-services/policies"
            className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            <ScrollText size={13} />
            <span>Attendance Policy</span>
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-[#0D1225] text-slate-400">
              <tr>
                <th className="py-3 pl-4 pr-3 font-semibold">Course</th>
                <th className="px-3 py-3 font-semibold text-center">Credits</th>
                <th className="px-3 py-3 font-semibold text-center">Attendance</th>
                <th className="px-3 py-3 font-semibold text-center">Quizzes</th>
                <th className="py-3 pl-3 pr-4 text-right font-semibold">Grade Est.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {student.enrolledCourses.map((crs) => (
                <tr key={crs.courseId} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 pl-4 pr-3">
                    <p className="font-semibold text-white">{crs.courseTitle}</p>
                    <span className="font-mono text-[11px] text-cyan-400">
                      {crs.courseCode}
                    </span>
                  </td>

                  <td className="px-3 py-3.5 text-center font-mono text-slate-300">
                    {crs.credits}
                  </td>

                  <td className="px-3 py-3.5 text-center font-mono font-semibold">
                    <span
                      className={
                        crs.attendance >= 80
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }
                    >
                      {crs.attendance}%
                    </span>
                  </td>

                  <td className="px-3 py-3.5 text-center font-mono text-slate-300">
                    {crs.quizzesCompleted} / {crs.totalQuizzes}
                  </td>

                  <td className="py-3.5 pl-3 pr-4 text-right">
                    <span className="rounded bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 font-mono font-bold text-violet-300">
                      {crs.gradeEstimate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
