"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  BookOpen,
  TrendingUp,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import { useDemoAuth } from "@/lib/demo-auth-context";
import {
  useStudentAcademicRecord,
  AcademicTerm,
  GradeLetter,
} from "@/lib/academic-storage";

// ============================================================================
// Grade Badge Styling Helper
// ============================================================================

function getGradeBadgeStyle(grade: GradeLetter): {
  bg: string;
  border: string;
  text: string;
} {
  switch (grade) {
    case "A+":
    case "A":
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/25",
        text: "text-emerald-300",
      };
    case "A-":
      return {
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/25",
        text: "text-cyan-300",
      };
    case "B+":
    case "B":
      return {
        bg: "bg-violet-500/10",
        border: "border-violet-500/25",
        text: "text-violet-300",
      };
    case "B-":
    case "C+":
      return {
        bg: "bg-blue-500/10",
        border: "border-blue-500/25",
        text: "text-blue-300",
      };
    case "C":
    case "C-":
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/25",
        text: "text-amber-300",
      };
    default:
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/25",
        text: "text-red-300",
      };
  }
}

// ============================================================================
// Responsive SVG GPA Analytics Chart
// Plots Semester GPA and Cumulative GPA progression over terms
// ============================================================================

interface GpaChartProps {
  terms: AcademicTerm[];
}

function GpaAnalyticsChart({ terms }: GpaChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 640;
  const height = 230;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Scale Y from 2.0 to 4.0 GPA
  const minY = 2.0;
  const maxY = 4.0;

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return paddingTop + chartHeight - ((clamped - minY) / (maxY - minY)) * chartHeight;
  };

  const getX = (idx: number) => {
    if (terms.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (idx * chartWidth) / (terms.length - 1);
  };

  // Build SVG paths for SGPA and CGPA
  const sgpaPoints = terms.map((t, idx) => ({
    x: getX(idx),
    y: getY(t.semesterGpa),
    sgpa: t.semesterGpa,
    cgpa: t.cumulativeGpa,
    label: `Y${Math.ceil(t.semesterNumber / 2)}S${((t.semesterNumber - 1) % 2) + 1}`,
    fullLabel: t.label,
  }));

  const cgpaPoints = terms.map((t, idx) => ({
    x: getX(idx),
    y: getY(t.cumulativeGpa),
  }));

  const sgpaLine = sgpaPoints
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const cgpaLine = cgpaPoints
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const sgpaArea = `${sgpaLine} L ${sgpaPoints[sgpaPoints.length - 1]?.x.toFixed(1) || 0} ${(
    paddingTop + chartHeight
  ).toFixed(1)} L ${sgpaPoints[0]?.x.toFixed(1) || 0} ${(paddingTop + chartHeight).toFixed(1)} Z`;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        role="img"
        aria-label="Student GPA progression chart across semesters"
      >
        <defs>
          <linearGradient id="sgpaAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Gridlines (2.0, 2.5, 3.0, 3.5, 4.0) */}
        {[2.0, 2.5, 3.0, 3.5, 4.0].map((level) => {
          const y = getY(level);
          return (
            <g key={level}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="rgba(148, 163, 184, 0.12)"
                strokeDasharray={level === 2.0 || level === 4.0 ? "none" : "3 4"}
              />
              <text
                x={paddingLeft - 8}
                y={y + 3.5}
                textAnchor="end"
                fontSize="10"
                fontFamily="monospace"
                fill="#64748B"
              >
                {level.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* First-Class Honours Reference Line (3.70) */}
        {(() => {
          const yHonours = getY(3.7);
          return (
            <g>
              <line
                x1={paddingLeft}
                y1={yHonours}
                x2={width - paddingRight}
                y2={yHonours}
                stroke="rgba(34, 211, 238, 0.35)"
                strokeDasharray="4 4"
              />
              <text
                x={width - paddingRight}
                y={yHonours - 4}
                textAnchor="end"
                fontSize="9"
                fontWeight="600"
                fill="#22D3EE"
              >
                First-Class Benchmark (3.70)
              </text>
            </g>
          );
        })()}

        {/* Area fill under SGPA */}
        <path d={sgpaArea} fill="url(#sgpaAreaGradient)" />

        {/* Cumulative GPA Line (Cyan) */}
        <path
          d={cgpaLine}
          fill="none"
          stroke="#22D3EE"
          strokeWidth="2"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />

        {/* Semester GPA Line (Violet) */}
        <path
          d={sgpaLine}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & hover triggers */}
        {sgpaPoints.map((p, idx) => {
          const isHovered = hoveredIndex === idx;
          const cp = cgpaPoints[idx];

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {/* Vertical guideline on hover */}
              {isHovered && (
                <line
                  x1={p.x}
                  y1={paddingTop}
                  x2={p.x}
                  y2={paddingTop + chartHeight}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeDasharray="2 3"
                />
              )}

              {/* CGPA point circle */}
              <circle
                cx={cp.x}
                cy={cp.y}
                r="3.5"
                fill="#0D1225"
                stroke="#22D3EE"
                strokeWidth="1.8"
              />

              {/* SGPA point circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? "6" : "4.5"}
                fill="#0D1225"
                stroke="#A78BFA"
                strokeWidth={isHovered ? "2.5" : "2"}
                className="transition-all duration-150"
              />

              {/* Term Label on X-axis */}
              <text
                x={p.x}
                y={height - paddingBottom + 16}
                textAnchor="middle"
                fontSize="10"
                fontWeight={isHovered ? "600" : "400"}
                fill={isHovered ? "#F8FAFC" : "#94A3B8"}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip when hovering over a point */}
      {hoveredIndex !== null && sgpaPoints[hoveredIndex] && (
        <div
          className="pointer-events-none absolute z-20 rounded-xl border border-white/10 bg-[#080B18]/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md"
          style={{
            left: `${(sgpaPoints[hoveredIndex].x / width) * 100}%`,
            top: "-12px",
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-semibold text-white">
            {sgpaPoints[hoveredIndex].fullLabel}
          </p>
          <div className="mt-1 flex items-center gap-3 text-[11px] font-mono">
            <span className="text-violet-300">
              SGPA: {sgpaPoints[hoveredIndex].sgpa.toFixed(2)}
            </span>
            <span className="text-cyan-300">
              CGPA: {sgpaPoints[hoveredIndex].cgpa.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Student Academic Progress Workspace
// ============================================================================

export default function StudentAcademicProgressPage() {
  const router = useRouter();
  const { role, loading } = useDemoAuth();
  const { record } = useStudentAcademicRecord();

  // Role Safety Guard: Restrict to Student role
  useEffect(() => {
    if (!loading && role !== null && role !== "student") {
      router.replace("/dashboard");
    }
  }, [loading, role, router]);

  // Filters & State for Course Results
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTermFilter, setSelectedTermFilter] = useState("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  // Expanded state for Academic History Accordion (default: current term expanded)
  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({
    "term-y3s1": true,
    "term-y2s2": false,
    "term-y2s1": false,
    "term-y1s2": false,
    "term-y1s1": false,
  });

  const toggleTerm = (termId: string) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [termId]: !prev[termId],
    }));
  };

  const expandAllTerms = () => {
    const allExpanded: Record<string, boolean> = {};
    record.terms.forEach((t) => {
      allExpanded[t.id] = true;
    });
    setExpandedTerms(allExpanded);
  };

  const collapseAllTerms = () => {
    const allCollapsed: Record<string, boolean> = {};
    record.terms.forEach((t) => {
      allCollapsed[t.id] = false;
    });
    setExpandedTerms(allCollapsed);
  };

  // Flatten all courses for global searching & filtering
  const allCourses = useMemo(() => {
    return record.terms.flatMap((term) => term.courses);
  }, [record.terms]);

  // Filtered course list
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        course.courseCode.toLowerCase().includes(query) ||
        course.courseTitle.toLowerCase().includes(query) ||
        (course.instructor && course.instructor.toLowerCase().includes(query));

      const matchesTerm =
        selectedTermFilter === "All" || course.termId === selectedTermFilter;

      const matchesCategory =
        selectedCategoryFilter === "All" ||
        course.category === selectedCategoryFilter;

      return matchesSearch && matchesTerm && matchesCategory;
    });
  }, [allCourses, searchTerm, selectedTermFilter, selectedCategoryFilter]);

  // Category credit distribution
  const creditDistribution = useMemo(() => {
    const distribution: Record<string, number> = {
      Core: 0,
      Elective: 0,
      General: 0,
      Project: 0,
    };
    allCourses.forEach((c) => {
      distribution[c.category] = (distribution[c.category] || 0) + c.credits;
    });
    return distribution;
  }, [allCourses]);

  // ==========================================================================
  // Functional CSV Official Transcript Exporter
  // ==========================================================================
  const handleExportTranscriptCSV = () => {
    const headers = [
      "Academic Term",
      "Course Code",
      "Course Title",
      "Category",
      "Credits",
      "Grade",
      "Grade Points",
      "Total Quality Points",
      "Instructor",
    ];

    const rows: (string | number)[][] = [];

    record.terms.forEach((term) => {
      term.courses.forEach((course) => {
        const qualityPoints = (course.credits * course.gradePoints).toFixed(2);
        rows.push([
          term.label,
          course.courseCode,
          `"${course.courseTitle.replace(/"/g, '""')}"`,
          course.category,
          course.credits,
          course.grade,
          course.gradePoints.toFixed(2),
          qualityPoints,
          `"${course.instructor || "Department Faculty"}"`,
        ]);
      });
    });

    // Summary metadata block at top of CSV
    const csvContent = [
      `NEXORA OFFICIAL ACADEMIC TRANSCRIPT (DEMO RECORD)`,
      `Student Name,${record.studentName}`,
      `Student ID,${record.studentId}`,
      `Program,${record.program}`,
      `Faculty,${record.faculty}`,
      `Current Level,${record.currentLevel}`,
      `Cumulative GPA,${record.cumulativeGpa.toFixed(2)}`,
      `Academic Standing,${record.academicStanding.status} - ${record.academicStanding.honoursTrack}`,
      `Credits Earned,${record.totalCreditsEarned} of ${record.totalCreditsRequired}`,
      `Export Timestamp,${new Date().toISOString()}`,
      ``,
      headers.join(","),
      ...rows.map((r) => r.join(",")),
      ``,
      `End of Transcript — Grounded in University Academic Regulations`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `NEXORA_Transcript_${record.studentId.replace(/\//g, "_")}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Loading / Auth Protection
  if (loading || role !== "student") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="text-xs text-slate-400">
            Verifying Student Academic Records access...
          </p>
        </div>
      </div>
    );
  }

  const remainingCredits = Math.max(
    0,
    record.totalCreditsRequired - record.totalCreditsEarned
  );
  const creditProgressPercentage = Math.min(
    100,
    Math.round((record.totalCreditsEarned / record.totalCreditsRequired) * 100)
  );

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {/* ================================================================== */}
      {/* Workspace Header & Student Bio Banner */}
      {/* ================================================================== */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#11162A]/90 via-[#0D1225] to-[#171D35]/80 p-6 backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-48 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <GraduationCap size={14} className="text-violet-400" />
              <span>Student Academic Progress</span>
              <span className="h-1 w-1 rounded-full bg-cyan-400" />
              <span className="text-[11px] text-cyan-300">
                {record.currentLevel}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Academic Transcript & Degree Audit
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Review your cumulative grade point average, semester-by-semester course
              evaluations, credits progression, and official honours standing.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
              <span>
                Student: <strong className="text-white">{record.studentName}</strong>
              </span>
              <span>•</span>
              <span className="font-mono">
                ID: <strong className="text-slate-200">{record.studentId}</strong>
              </span>
              <span>•</span>
              <span>
                Program: <strong className="text-slate-200">{record.program}</strong>
              </span>
            </div>
          </div>

          {/* Action: Export Functional CSV Transcript */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportTranscriptCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.98]"
              title="Export complete academic records as a CSV transcript"
            >
              <Download size={14} />
              <span>Download Official Transcript (.CSV)</span>
            </button>

            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Sparkles size={14} className="text-violet-400" />
              <span>Ask AI About Degree Progress</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Data Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 text-xs text-amber-200/80">
        <Info size={16} className="mt-0.5 shrink-0 text-amber-400" />
        <p className="leading-relaxed">
          <strong>Demonstration Academic Records:</strong> These semester evaluations
          and GPA calculations are securely cached in local storage (
          <code className="rounded bg-black/40 px-1 py-0.5 text-amber-300 font-mono text-[11px]">
            nexora-student-academic-records
          </code>
          ). In production, these records will be fetched directly from the university
          Student Information System (SIS) / academic database.
        </p>
      </div>

      {/* ================================================================== */}
      {/* A. Academic Summary Cards */}
      {/* ================================================================== */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Key Academic Metrics
          </h2>
          <span className="text-[11px] text-slate-500">
            Standard 4.0 Scale · Senate Reg Section 4.3
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Cumulative GPA */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm transition duration-300 hover:border-violet-500/30">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                <Award size={20} />
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                +0.07 vs Y1
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">
              Cumulative GPA (CGPA)
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-white">
              {record.cumulativeGpa.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Calculated across {record.terms.length} completed semesters
            </p>
          </div>

          {/* Current Semester GPA */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm transition duration-300 hover:border-cyan-500/30">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                <TrendingUp size={20} />
              </div>
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
                Current Term
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">
              Semester GPA (SGPA)
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-white">
              {record.currentSemesterGpa.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {record.terms[record.terms.length - 1]?.label || "Latest Semester"}
            </p>
          </div>

          {/* Credits Progress */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm transition duration-300 hover:border-blue-500/30">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <BookOpen size={20} />
              </div>
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-300">
                {creditProgressPercentage}% Completed
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">
              Credits Earned / Required
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-white">
              {record.totalCreditsEarned}{" "}
              <span className="text-lg font-normal text-slate-500">
                / {record.totalCreditsRequired}
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {remainingCredits} credits remaining for graduation
            </p>
          </div>

          {/* Academic Standing */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm transition duration-300 hover:border-emerald-500/30">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                Dean&apos;s List
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">
              Academic Standing
            </p>
            <p className="mt-1 text-base font-bold text-white">
              {record.academicStanding.status}
            </p>
            <p className="mt-1 text-xs text-emerald-400">
              {record.academicStanding.honoursTrack}
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* B. GPA Analytics Chart & E. Credit Progress Grid */}
      {/* ================================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* GPA Progression Chart (7 cols) */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 lg:col-span-7">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-semibold text-white">
                GPA Performance Trajectory
              </h3>
              <p className="text-xs text-slate-400">
                Semester GPA (SGPA) vs. Cumulative GPA (CGPA) progression
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-violet-300">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                Semester GPA
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                Cumulative GPA
              </span>
            </div>
          </div>

          <div className="mt-4">
            <GpaAnalyticsChart terms={record.terms} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-slate-400">
            <span>
              Highest SGPA:{" "}
              <strong className="text-violet-300 font-mono">
                {Math.max(...record.terms.map((t) => t.semesterGpa)).toFixed(2)}
              </strong>
            </span>
            <span className="text-[11px] text-slate-500">
              Thresholds: ≥3.70 First-Class • ≥3.00 Second-Class Upper • &lt;2.00 Probation
            </span>
          </div>
        </div>

        {/* E. Credit Progress & Degree Audit (5 cols) */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                Degree Credit Audit
              </h3>
              <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-300">
                Level 3 Standing
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Total academic workload required for BSc (Hons) graduation
            </p>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Degree Completion</span>
                <span className="font-mono text-cyan-300">
                  {record.totalCreditsEarned} / {record.totalCreditsRequired} Credits ({creditProgressPercentage}%)
                </span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#080B18]">
                <div
                  style={{ width: `${creditProgressPercentage}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 transition-all duration-500"
                />
              </div>
            </div>

            {/* Category Credit Breakdown */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3">
                <span className="text-[10px] uppercase text-slate-500 font-semibold">
                  Core Requirements
                </span>
                <p className="mt-1 font-mono text-base font-bold text-white">
                  {creditDistribution.Core} Credits
                </p>
                <p className="text-[10px] text-slate-500">Major foundations</p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3">
                <span className="text-[10px] uppercase text-slate-500 font-semibold">
                  Technical Electives
                </span>
                <p className="mt-1 font-mono text-base font-bold text-cyan-300">
                  {creditDistribution.Elective} Credits
                </p>
                <p className="text-[10px] text-slate-500">Specialization modules</p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3">
                <span className="text-[10px] uppercase text-slate-500 font-semibold">
                  General & Skills
                </span>
                <p className="mt-1 font-mono text-base font-bold text-violet-300">
                  {creditDistribution.General} Credits
                </p>
                <p className="text-[10px] text-slate-500">Communication & Ethics</p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#080B18] p-3">
                <span className="text-[10px] uppercase text-slate-500 font-semibold">
                  Capstone / Research
                </span>
                <p className="mt-1 font-mono text-base font-bold text-emerald-400">
                  {creditDistribution.Project} Credits
                </p>
                <p className="text-[10px] text-slate-500">Thesis & Proposal</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-3.5 text-xs text-cyan-200/90">
            <p className="font-semibold text-cyan-300">
              Clearance Forecast:
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">
              With 81 credits completed at CGPA 3.81, you require 39 credits across the
              remaining 3 semesters to complete the degree.
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* C. Course Results: Search, Filter, and Tabular View */}
      {/* ================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Course Results Directory
            </h3>
            <p className="text-xs text-slate-400">
              Browse, search, and verify all completed modules across semesters
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredCourses.length} of {allCourses.length} modules
          </span>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#11162A] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search course code (e.g. SE201), course title, or lecturer..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#080B18] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-violet-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Term:</span>
              <select
                value={selectedTermFilter}
                onChange={(e) => setSelectedTermFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
              >
                <option value="All">All Semesters</option>
                {record.terms.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#080B18] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
              >
                <option value="All">All Categories</option>
                <option value="Core">Core</option>
                <option value="Elective">Elective</option>
                <option value="General">General</option>
                <option value="Project">Project</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11162A]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Course Code & Title</th>
                  <th className="px-6 py-3.5 font-semibold">Semester Term</th>
                  <th className="px-6 py-3.5 font-semibold">Category</th>
                  <th className="px-6 py-3.5 font-semibold">Credits</th>
                  <th className="px-6 py-3.5 font-semibold">Grade</th>
                  <th className="px-6 py-3.5 font-semibold">Grade Points</th>
                  <th className="px-6 py-3.5 text-right font-semibold">Quality Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredCourses.map((course) => {
                  const badgeStyle = getGradeBadgeStyle(course.grade);
                  const qualityPoints = (course.credits * course.gradePoints).toFixed(2);

                  return (
                    <tr
                      key={course.id}
                      className="transition duration-150 hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs font-bold text-violet-300">
                            {course.courseCode}
                          </span>
                          <div>
                            <p className="font-semibold text-white">
                              {course.courseTitle}
                            </p>
                            {course.instructor && (
                              <p className="text-[11px] text-slate-500">
                                {course.instructor}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {course.termLabel}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px]">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-slate-200">
                        {course.credits}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center justify-center rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${badgeStyle.bg} ${badgeStyle.border} ${badgeStyle.text}`}
                        >
                          {course.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-300">
                        {course.gradePoints.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-semibold text-white">
                        {qualityPoints}
                      </td>
                    </tr>
                  );
                })}

                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No courses matching your search criteria found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* D. Academic History: Semester-by-Semester Accordion */}
      {/* ================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Academic Term History (Detailed Breakdown)
            </h3>
            <p className="text-xs text-slate-400">
              Expand each semester to inspect modular performance, term SGPA, and cumulative credits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAllTerms}
              className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/[0.06]"
            >
              Expand All
            </button>
            <button
              onClick={collapseAllTerms}
              className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/[0.06]"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {record.terms.map((term) => {
            const isExpanded = expandedTerms[term.id] ?? false;
            const termQualityPoints = term.courses
              .reduce((sum, c) => sum + c.credits * c.gradePoints, 0)
              .toFixed(2);

            return (
              <div
                key={term.id}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11162A] transition"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleTerm(term.id)}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-white/[0.02]"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <span className="font-semibold text-sm text-white">
                      {term.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      Academic Year: {term.academicYear}
                    </span>
                    {term.isCurrent && (
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300">
                        Current Semester
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="hidden text-right text-xs sm:block">
                      <span className="text-slate-400">Semester GPA:</span>{" "}
                      <span className="font-mono font-bold text-violet-300">
                        {term.semesterGpa.toFixed(2)}
                      </span>
                    </div>

                    <div className="hidden text-right text-xs sm:block">
                      <span className="text-slate-400">Credits:</span>{" "}
                      <span className="font-mono text-slate-200">
                        {term.semesterCredits}
                      </span>
                    </div>

                    <div className="rounded-lg p-1.5 text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </button>

                {/* Accordion Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-white/[0.06] bg-[#0D1225]/60 p-5">
                    {/* Summary row */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.04] bg-[#080B18] px-4 py-2.5 text-xs">
                      <div className="flex flex-wrap items-center gap-4 font-mono text-slate-300">
                        <span>
                          Term Credits: <strong>{term.semesterCredits}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Quality Points: <strong>{termQualityPoints}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          SGPA: <strong className="text-violet-300">{term.semesterGpa.toFixed(2)}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          CGPA to date: <strong className="text-cyan-300">{term.cumulativeGpa.toFixed(2)}</strong>
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Cumulative Credits: {term.cumulativeCredits}
                      </span>
                    </div>

                    {/* Term Courses List */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="text-[10px] uppercase text-slate-500">
                          <tr>
                            <th className="py-2 font-medium">Code</th>
                            <th className="py-2 font-medium">Course Title</th>
                            <th className="py-2 font-medium">Category</th>
                            <th className="py-2 font-medium">Credits</th>
                            <th className="py-2 font-medium">Grade</th>
                            <th className="py-2 font-medium">Points</th>
                            <th className="py-2 text-right font-medium">Instructor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                          {term.courses.map((course) => {
                            const badgeStyle = getGradeBadgeStyle(course.grade);
                            return (
                              <tr key={course.id}>
                                <td className="py-2.5 font-mono font-bold text-violet-300">
                                  {course.courseCode}
                                </td>
                                <td className="py-2.5 font-medium text-slate-200">
                                  {course.courseTitle}
                                </td>
                                <td className="py-2.5 text-slate-400">
                                  {course.category}
                                </td>
                                <td className="py-2.5 font-mono text-slate-300">
                                  {course.credits}
                                </td>
                                <td className="py-2.5">
                                  <span
                                    className={`inline-block rounded px-2 py-0.5 font-mono text-[11px] font-bold ${badgeStyle.bg} ${badgeStyle.border} ${badgeStyle.text}`}
                                  >
                                    {course.grade}
                                  </span>
                                </td>
                                <td className="py-2.5 font-mono text-slate-400">
                                  {course.gradePoints.toFixed(2)}
                                </td>
                                <td className="py-2.5 text-right text-slate-500">
                                  {course.instructor || "Faculty Staff"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================== */}
      {/* University Regulations Footnote / Academic Governance Link */}
      {/* ================================================================== */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.06] bg-[#0D1225] p-5 text-xs text-slate-400 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-cyan-400" />
          <span>
            Academic Progress rules and honours award criteria are strictly governed by
            University Senate Regulations 2025/2026.
          </span>
        </div>
        <Link
          href="/learning"
          className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 hover:underline"
        >
          <span>Explore Academic Learning Library</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
