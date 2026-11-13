"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  FolderGit2,
  Users,
  ScrollText,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  FileText,
} from "lucide-react";
import {
  StaffOverviewMetrics,
  AcademicStaffActivity,
} from "@/lib/academic-staff-types";
import {
  getStaffOverviewMetrics,
  getRecentActivities,
} from "@/lib/academic-staff-service";

export default function AcademicServicesOverview() {
  const [metrics, setMetrics] = useState<StaffOverviewMetrics | null>(null);
  const [activities, setActivities] = useState<AcademicStaffActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, a] = await Promise.all([
          getStaffOverviewMetrics(),
          getRecentActivities(),
        ]);
        setMetrics(m);
        setActivities(a);
      } catch (err) {
        console.error("Failed to load academic staff overview data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <p className="text-xs text-slate-400">Loading Academic Services Hub...</p>
      </div>
    );
  }

  const serviceCards = [
    {
      title: "Assigned Courses",
      description:
        "Access course syllabi, module schedules, venues, and student counts for all assigned academic modules.",
      count: metrics ? `${metrics.assignedCoursesCount} Active Courses` : "4 Courses",
      href: "/academic-services/courses",
      icon: BookOpen,
      accent: "from-violet-500/20 via-violet-500/5 to-transparent",
      borderColor: "border-violet-500/20 hover:border-violet-500/40",
      badgeColor: "bg-violet-500/10 text-violet-300 border-violet-500/20",
      iconBg: "bg-violet-500/10 text-violet-400",
    },
    {
      title: "Teaching Resources",
      description:
        "Centralized teaching repository: lecture slides, laboratory exercise sheets, reading packs, and course rubrics.",
      count: metrics ? `${metrics.teachingResourcesCount} Materials` : "9 Materials",
      href: "/academic-services/resources",
      icon: FolderGit2,
      accent: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      borderColor: "border-cyan-500/20 hover:border-cyan-500/40",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      iconBg: "bg-cyan-500/10 text-cyan-400",
    },
    {
      title: "Student Progress",
      description:
        "Demonstration overview of student cohort metrics, attendance tracking, standing classifications, and grades.",
      count: metrics ? `${metrics.totalEnrolledStudents} Enrolled` : "280 Enrolled",
      href: "/academic-services/students",
      icon: Users,
      accent: "from-blue-500/20 via-blue-500/5 to-transparent",
      borderColor: "border-blue-500/20 hover:border-blue-500/40",
      badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      iconBg: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Academic Policies",
      description:
        "Authoritative institutional guidelines: examination conduct, grading moderation, attendance, and degree clearance.",
      count: metrics ? `${metrics.academicPoliciesCount} Senate Regulations` : "5 Regulations",
      href: "/academic-services/policies",
      icon: ScrollText,
      accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121633] via-[#0E1328] to-[#0A0D1D] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-48 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              <GraduationCap size={14} className="text-cyan-400" />
              <span>Academic Staff Workspace</span>
              <span className="h-1 w-1 rounded-full bg-violet-400" />
              <span className="text-[11px] font-normal normal-case text-slate-300">
                Department of Software Engineering
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Academic Services Hub
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Welcome to the unified teaching and academic management center.
              Supervise your assigned courses, curate teaching materials, consult senate
              policies, and monitor student academic performance.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
              <span>
                Instructor: <strong className="text-white">Prof. D. Karunaratne</strong>
              </span>
              <span>•</span>
              <span>
                Term: <strong className="text-cyan-300">2025/2026 Semester 1</strong>
              </span>
              <span>•</span>
              <span>
                Access Level: <strong className="text-emerald-400">Authorized Academic Staff</strong>
              </span>
            </div>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/quiz-management/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.98]"
            >
              <Plus size={15} />
              <span>Create New Quiz</span>
            </Link>

            <Link
              href="/academic-services/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08]"
            >
              <span>View My Courses</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Illustrative Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-4 text-xs text-cyan-200/90">
        <Info size={16} className="mt-0.5 shrink-0 text-cyan-400" />
        <p className="leading-relaxed">
          <strong>Academic Staff Demonstration Workspace:</strong> Course syllabi, teaching
          resources, and senate policy documents represent verified illustrative fixtures for the
          current academic term. Student performance records are synthetic demonstration fixtures
          designed for previewing staff administrative workflows.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Current Semester Snapshot
          </h2>
          <span className="text-[11px] text-slate-500">Live Academic Term 2025/2026</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm transition hover:border-violet-500/30">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
                <BookOpen size={20} />
              </div>
              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                Teaching
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">Assigned Courses</p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-white">
              {metrics?.assignedCoursesCount ?? "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">2 active, 2 archived terms</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm transition hover:border-cyan-500/30">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
                <Users size={20} />
              </div>
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                Enrolled
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">Total Students</p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-white">
              {metrics?.totalEnrolledStudents ?? "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">Across 4 assigned course offerings</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm transition hover:border-blue-500/30">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                <FolderGit2 size={20} />
              </div>
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                Library
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">Teaching Resources</p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-white">
              {metrics?.teachingResourcesCount ?? "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">Slides, lab sheets & guides</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-5 shadow-sm transition hover:border-emerald-500/30">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                <ScrollText size={20} />
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Governing
              </span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">Academic Policies</p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-white">
              {metrics?.academicPoliciesCount ?? "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">Active university senate codes</p>
          </div>
        </div>
      </section>

      {/* Primary Navigation Cards (Phase 1 core) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            Academic Services Directory
          </h2>
          <span className="text-xs text-slate-500">Select a service to proceed</span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {serviceCards.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.title}
                href={service.href}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br ${service.accent} ${service.borderColor} bg-[#11162A]/90 p-6 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${service.iconBg}`}>
                      <Icon size={22} />
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${service.badgeColor}`}
                    >
                      {service.count}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white transition group-hover:text-cyan-300">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs font-medium text-slate-300 transition group-hover:text-cyan-300">
                  <span>Open {service.title}</span>
                  <ArrowUpRight
                    size={16}
                    className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Two Column Section: Recent Academic Activity & Helpful Quick Actions */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Academic Activity Feed (7 cols) */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Recent Academic Activity
              </h3>
              <p className="text-xs text-slate-400">
                Audited timeline of teaching and administrative events
              </p>
            </div>
            <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[11px] font-mono text-slate-400">
              Synthetic Feed
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {activities.map((activity, idx) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3.5 ${
                  idx !== activities.length - 1
                    ? "border-b border-white/[0.05] pb-4"
                    : ""
                }`}
              >
                <div className="mt-0.5 rounded-lg bg-white/[0.05] p-2 text-cyan-400">
                  {activity.type === "quiz" && <Sparkles size={16} />}
                  {activity.type === "resource" && <FileText size={16} />}
                  {activity.type === "review" && <CheckCircle2 size={16} />}
                  {activity.type === "course" && <BookOpen size={16} />}
                  {activity.type === "policy" && <ScrollText size={16} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-200">
                      {activity.title}
                    </p>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock size={12} />
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400 leading-normal">
                    {activity.detail}
                  </p>
                  {activity.courseCode && (
                    <span className="mt-1.5 inline-block rounded bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-violet-300 border border-violet-500/20">
                      {activity.courseCode}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Helpful Quick Actions (5 cols) */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#11162A] p-6 lg:col-span-5">
          <div>
            <h3 className="text-base font-semibold text-white">
              Instructor Quick Actions
            </h3>
            <p className="text-xs text-slate-400">
              Direct access to frequent staff workflows
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/quiz-management/create"
                className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0D1225] p-3.5 transition hover:border-violet-500/30 hover:bg-[#151B38]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-violet-500/10 p-2 text-violet-400">
                    <Plus size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-violet-300">
                      Create Course Quiz
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Draft MCQs, code challenges & grading keys
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-slate-500 group-hover:text-violet-300" />
              </Link>

              <Link
                href="/academic-services/courses"
                className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0D1225] p-3.5 transition hover:border-cyan-500/30 hover:bg-[#151B38]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                      Inspect Assigned Courses
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Review syllabus milestone progress & enrollments
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-slate-500 group-hover:text-cyan-300" />
              </Link>

              <Link
                href="/academic-services/resources"
                className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0D1225] p-3.5 transition hover:border-blue-500/30 hover:bg-[#151B38]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                    <FolderGit2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-300">
                      Open Resource Library
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Review and preview course teaching materials
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-slate-500 group-hover:text-blue-300" />
              </Link>

              <Link
                href="/academic-services/policies"
                className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0D1225] p-3.5 transition hover:border-emerald-500/30 hover:bg-[#151B38]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <ScrollText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                      Consult Academic Policies
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Senate rules on examinations and attendance
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-slate-500 group-hover:text-emerald-300" />
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/[0.05] bg-[#080B18]/60 p-3.5 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Security Notice: </span>
            Student data displayed in this workspace is scoped strictly to teaching and
            academic coordination roles under University Data Protection Guidelines.
          </div>
        </div>
      </section>
    </div>
  );
}
