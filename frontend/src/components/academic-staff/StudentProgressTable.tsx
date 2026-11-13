"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Filter,
  ArrowRight,
  Info,
} from "lucide-react";
import { StaffStudent, StudentStanding } from "@/lib/academic-staff-types";

interface StudentProgressTableProps {
  students: StaffStudent[];
}

export default function StudentProgressTable({
  students,
}: StudentProgressTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStanding, setSelectedStanding] = useState<string>("All");

  const standings: (StudentStanding | "All")[] = [
    "All",
    "Dean's List",
    "Good Standing",
    "Academic Warning",
    "Academic Probation",
  ];

  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        stu.name.toLowerCase().includes(query) ||
        stu.studentId.toLowerCase().includes(query) ||
        stu.program.toLowerCase().includes(query) ||
        stu.email.toLowerCase().includes(query);

      const matchesStanding =
        selectedStanding === "All" || stu.academicStanding === selectedStanding;

      return matchesSearch && matchesStanding;
    });
  }, [students, searchTerm, selectedStanding]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStanding("All");
  };

  const getStandingBadge = (standing: StudentStanding) => {
    switch (standing) {
      case "Dean's List":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "Good Standing":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "Academic Warning":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "Academic Probation":
        return "bg-red-500/10 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/10 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy and Demo Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-4 text-xs text-violet-200/90">
        <Info size={16} className="mt-0.5 shrink-0 text-violet-400" />
        <p className="leading-relaxed">
          <strong>Illustrative Student Cohort Demonstration:</strong> This student list
          contains entirely synthetic identities and mock evaluation scores. In production, this
          interface connects directly to the University Student Information System (SIS) with
          strict role-based authorization ensuring instructors only view students enrolled in
          their assigned lecture cohorts.
        </p>
      </div>

      {/* Search and Standing Filter Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, student ID, or programme..."
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
            <span className="hidden sm:inline">Standing:</span>
            <select
              value={selectedStanding}
              onChange={(e) => setSelectedStanding(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              {standings.map((s) => (
                <option key={s} value={s} className="bg-[#0D1225] text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedStanding !== "All") && (
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
          Showing <strong className="text-white">{filteredStudents.length}</strong> of{" "}
          {students.length} student records
        </span>
        <span className="text-[11px] text-slate-500">
          Click View Profile to review comprehensive academic summary
        </span>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[#11162A]/50 p-8 text-center">
          <Users size={36} className="text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-white">No Students Match Criteria</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            No synthetic student profiles found matching the active filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 rounded-xl bg-violet-600/20 border border-violet-500/30 px-4 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-600/30"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#11162A]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-[#0D1225] text-slate-400">
              <tr>
                <th className="py-3.5 pl-5 pr-3 font-semibold">Student & ID</th>
                <th className="px-3 py-3.5 font-semibold">Programme & Level</th>
                <th className="px-3 py-3.5 font-semibold text-center">CGPA</th>
                <th className="px-3 py-3.5 font-semibold text-center">Credits</th>
                <th className="px-3 py-3.5 font-semibold text-center">Attendance</th>
                <th className="px-3 py-3.5 font-semibold">Academic Standing</th>
                <th className="py-3.5 pl-3 pr-5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredStudents.map((stu) => {
                const safeUrlId = stu.id;
                return (
                  <tr
                    key={stu.id}
                    className="transition hover:bg-white/[0.02]"
                  >
                    {/* Student Name and ID */}
                    <td className="py-4 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 border border-white/[0.08] text-xs font-bold text-white">
                          {stu.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{stu.name}</p>
                          <p className="font-mono text-[11px] text-cyan-400">
                            {stu.studentId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Programme & Level */}
                    <td className="px-3 py-4 text-slate-300">
                      <p className="font-medium">{stu.program}</p>
                      <p className="text-[11px] text-slate-500">{stu.currentLevel}</p>
                    </td>

                    {/* CGPA */}
                    <td className="px-3 py-4 text-center">
                      <span className="font-mono text-sm font-bold text-white">
                        {stu.cgpa.toFixed(2)}
                      </span>
                      <p className="text-[10px] text-slate-500">
                        SGPA: {stu.sgpa.toFixed(2)}
                      </p>
                    </td>

                    {/* Credits */}
                    <td className="px-3 py-4 text-center">
                      <span className="font-mono font-medium text-slate-200">
                        {stu.creditsCompleted}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {" "}/ {stu.totalRequiredCredits}
                      </span>
                    </td>

                    {/* Attendance */}
                    <td className="px-3 py-4 text-center">
                      <span
                        className={`font-mono font-semibold ${
                          stu.attendanceRate >= 80
                            ? "text-emerald-400"
                            : stu.attendanceRate >= 70
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {stu.attendanceRate}%
                      </span>
                    </td>

                    {/* Standing */}
                    <td className="px-3 py-4">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStandingBadge(
                          stu.academicStanding
                        )}`}
                      >
                        {stu.academicStanding}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 pl-3 pr-5 text-right">
                      <Link
                        href={`/academic-services/students/${safeUrlId}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-300"
                      >
                        <span>View</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
